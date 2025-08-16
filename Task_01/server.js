require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const path = require('path');

const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
});

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/realtime-chat';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('Mongo connected'))
  .catch(err=>console.error(err));

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already used' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = createToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = createToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email _id').limit(100);
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const { room, withUser } = req.query;
    let messages;
    if (room) {
      messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(200).populate('from','name email');
    } else if (withUser && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload = jwt.verify(token, JWT_SECRET);
      const me = payload.id;
      messages = await Message.find({
        $or: [
          { from: me, to: withUser },
          { from: withUser, to: me }
        ]
      }).sort({ createdAt: 1 }).limit(200).populate('from','name email');
    } else {
      return res.status(400).json({ msg: 'Provide room or withUser and auth' });
    }
    res.json(messages);
  } catch (err) {
    console.error(err); res.status(500).json({ msg: 'Server error' });
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.data.user = { id: payload.id, name: payload.name, email: payload.email };
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const me = socket.data.user;
  console.log('User connected', me.name, me.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    socket.to(room).emit('user-joined', { user: me, room });
  });

  socket.on('join-private', (room) => {
    socket.join(room);
  });

  socket.on('typing', (payload) => {
    if (payload.room) socket.to(payload.room).emit('typing', { user: me, room: payload.room });
    else if (payload.toUserId) socket.to(payload.toUserId).emit('typing', { user: me });
  });

  socket.on('send-message', async (data) => {
    try {
      const doc = { from: me.id, text: data.text };
      if (data.room) doc.room = data.room;
      if (data.toUserId) doc.to = data.toUserId;

      const msg = await Message.create(doc);
      await msg.populate('from','name email');
      if (data.room) {
        io.to(data.room).emit('new-message', msg);
      } else if (data.toUserId) {
        const privateRoom = data.privateRoom || [me.id, data.toUserId].sort().join(':');
        io.to(privateRoom).emit('new-message', msg);
      }
    } catch (err) {
      console.error('send-message error', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', me.name);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log('Server running on', PORT));
