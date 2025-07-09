// let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
// let filter = 'all';

// document.getElementById('task-form').addEventListener('submit', function(e) {
//   e.preventDefault();

//   const title = document.getElementById('title').value.trim();
//   const description = document.getElementById('description').value.trim();
//   const dueDate = document.getElementById('due-date').value;

//   if (title && description && dueDate) {
//     const task = {
//       id: Date.now(),
//       title,
//       description,
//       dueDate,
//       completed: false
//     };
//     tasks.push(task);
//     saveTasks();
//     this.reset();
//     renderTasks();
//   }
// });

// function renderTasks() {
//   const list = document.getElementById('task-list');
//   list.innerHTML = '';

//   const filteredTasks = tasks.filter(task => {
//     if (filter === 'all') return true;
//     if (filter === 'complete') return task.completed;
//     if (filter === 'incomplete') return !task.completed;
//   });

//   filteredTasks.forEach(task => {
//     const li = document.createElement('li');
//     li.className = 'task' + (task.completed ? ' complete' : '');

//     li.innerHTML = `
//       <h3>${task.title}</h3>
//       <p>${task.description}</p>
//       <small>Due: ${task.dueDate}</small>
//       <div class="actions">
//         <button onclick="toggleComplete(${task.id})">✔️</button>
//         <button onclick="deleteTask(${task.id})">🗑️</button>
//       </div>
//     `;

//     list.appendChild(li);
//   });
// }

// function toggleComplete(id) {
//   tasks = tasks.map(task => {
//     if (task.id === id) task.completed = !task.completed;
//     return task;
//   });
//   saveTasks();
//   renderTasks();
// }

// function deleteTask(id) {
//   tasks = tasks.filter(task => task.id !== id);
//   saveTasks();
//   renderTasks();
// }

// function filterTasks(type) {
//   filter = type;
//   renderTasks();
// }

// function saveTasks() {
//   localStorage.setItem('tasks', JSON.stringify(tasks));
// }

// // Optional: Simple reminder feature (alerts if due today)
// function checkReminders() {
//   const today = new Date().toISOString().split('T')[0];
//   tasks.forEach(task => {
//     if (!task.completed && task.dueDate === today) {
//       alert(`Reminder: Task "${task.title}" is due today!`);
//     }
//   });
// }

// checkReminders();
// renderTasks();
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const dueDate = document.getElementById('due-date').value;
  const editingId = this.getAttribute("data-edit-id");

  if (title && description && dueDate) {
    if (editingId) {
      tasks = tasks.map(task => {
        if (task.id == editingId) {
          task.title = title;
          task.description = description;
          task.dueDate = dueDate;
        }
        return task;
      });
      this.removeAttribute("data-edit-id");
    } else {
      const task = {
        id: Date.now(),
        title,
        description,
        dueDate,
        completed: false
      };
      tasks.push(task);
    }

    saveTasks();
    this.reset();
    renderTasks();
  }
});

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'complete') return task.completed;
    if (filter === 'incomplete') return !task.completed;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' complete' : '');

    li.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <small>Due: ${task.dueDate}</small>
      <div class="actions">
        <button onclick="toggleComplete(${task.id})">${task.completed ? '↩️' : '✔️'}</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function toggleComplete(id) {
  tasks = tasks.map(task => {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('due-date').value = task.dueDate;
    document.getElementById('task-form').setAttribute("data-edit-id", task.id);
  }
}

function filterTasks(type) {
  filter = type;
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkReminders() {
  const today = new Date().toISOString().split('T')[0];
  tasks.forEach(task => {
    if (!task.completed && task.dueDate === today) {
      alert(`Reminder: Task "${task.title}" is due today!`);
    }
  });
}

checkReminders();
renderTasks();
