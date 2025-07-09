
// function signup() {
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;
//   const message = document.getElementById("message");
//   if (localStorage.getItem(email)) {
//     message.textContent = "User already exists.";
//     return;
//   }
//   localStorage.setItem(email, JSON.stringify({ password, tasks: [] }));
//   localStorage.setItem("loggedInUser", email);
//   window.location.href = "index.html";
// }

// function login() {
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;
//   const message = document.getElementById("message");
//   const userData = JSON.parse(localStorage.getItem(email));
//   if (!userData || userData.password !== password) {
//     message.textContent = "Invalid email or password.";
//     return;
//   }
//   localStorage.setItem("loggedInUser", email);
//   window.location.href = "index.html";
// }

// if (window.location.pathname.includes("index.html")) {
//   const userEmail = localStorage.getItem("loggedInUser");
//   if (!userEmail) window.location.href = "login.html";

//   document.getElementById("user-email").textContent = userEmail;
//   let userData = JSON.parse(localStorage.getItem(userEmail));
//   const taskForm = document.getElementById("task-form");
//   const taskList = document.getElementById("task-list");

//   taskForm.addEventListener("submit", function (e) {
//     e.preventDefault();
//     const title = document.getElementById("title").value;
//     const description = document.getElementById("description").value;
//     const dueDate = document.getElementById("dueDate").value;
//     const assignee = document.getElementById("assignee").value;
//     const status = document.getElementById("status").value;
//     const task = { title, description, dueDate, assignee, status };
//     userData.tasks.push(task);
//     localStorage.setItem(userEmail, JSON.stringify(userData));
//     taskForm.reset();
//     renderTasks();
//   });

//   function renderTasks() {
//     taskList.innerHTML = "";
//     userData.tasks.forEach((task, index) => {
//       const li = document.createElement("li");
//       li.className = "task";
//       li.innerHTML = `
//         <strong>${task.title}</strong><br>
//         ${task.description}<br>
//         Due: ${task.dueDate} | To: ${task.assignee}<br>
//         Status: ${task.status.toUpperCase()}<br>
//         <button onclick="updateStatus(${index})">Update Status</button>
//         <button onclick="deleteTask(${index})">Delete</button>
//       `;
//       taskList.appendChild(li);
//     });
//     checkDeadlineReminders();
//   }

//   function checkDeadlineReminders() {
//     const today = new Date().toISOString().split('T')[0];
//     const reminders = userData.tasks.filter(task => task.dueDate === today);
//     if (reminders.length > 0) {
//       let msg = "🔔 You have task(s) due today:\n\n";
//       reminders.forEach(task => {
//         msg += `• ${task.title} (Assigned to: ${task.assignee})\n`;
//       });
//       alert(msg);
//     }
//   }

//   window.updateStatus = function(index) {
//     const newStatus = prompt("Update status (pending, in-progress, completed):", userData.tasks[index].status);
//     if (newStatus) {
//       userData.tasks[index].status = newStatus.toLowerCase();
//       localStorage.setItem(userEmail, JSON.stringify(userData));
//       renderTasks();
//     }
//   };

//   window.deleteTask = function(index) {
//     if (confirm("Are you sure you want to delete this task?")) {
//       userData.tasks.splice(index, 1);
//       localStorage.setItem(userEmail, JSON.stringify(userData));
//       renderTasks();
//     }
//   };

//   function logout() {
//     localStorage.removeItem("loggedInUser");
//     window.location.href = "login.html";
//   }

//   window.logout = logout;
//   renderTasks();
// }
// --- LOGIN / SIGNUP LOGIC ---
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  if (localStorage.getItem(email)) {
    message.textContent = "User already exists.";
    return;
  }

  localStorage.setItem(email, JSON.stringify({ password, tasks: [] }));
  localStorage.setItem("loggedInUser", email);
  window.location.href = "index.html";
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  const userData = JSON.parse(localStorage.getItem(email));
  if (!userData || userData.password !== password) {
    message.textContent = "Invalid email or password.";
    return;
  }

  localStorage.setItem("loggedInUser", email);
  window.location.href = "index.html";
}

// --- DASHBOARD LOGIC ---
if (window.location.pathname.includes("index.html")) {
  const userEmail = localStorage.getItem("loggedInUser");
  if (!userEmail) window.location.href = "login.html";

  document.getElementById("user-email").textContent = userEmail;
  let userData = JSON.parse(localStorage.getItem(userEmail));
  const taskForm = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const assignee = document.getElementById("assignee").value;
    const status = document.getElementById("status").value;
    const task = { title, description, dueDate, assignee, status };
    userData.tasks.push(task);
    localStorage.setItem(userEmail, JSON.stringify(userData));
    taskForm.reset();
    renderTasks();
  });

  function renderTasks() {
    taskList.innerHTML = "";
    const today = new Date().toISOString().split('T')[0];
    userData.tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task";

      let reminderHTML = "";
      if (task.status.toLowerCase() !== "completed" && task.dueDate <= today) {
        reminderHTML = `<p style="color: red; font-weight: bold;">⏰ Reminder: Task is due or overdue!</p>`;
      }

      li.innerHTML = `
        <strong>${task.title}</strong><br>
        ${task.description}<br>
        Due: ${task.dueDate} | To: ${task.assignee}<br>
        Status: ${task.status.toUpperCase()}<br>
        ${reminderHTML}
        <button onclick="updateStatus(${index})">Update Status</button>
        <button onclick="deleteTask(${index})">Delete</button>
      `;
      taskList.appendChild(li);
    });
    checkDeadlineReminders();
  }

  function checkDeadlineReminders() {
    const today = new Date().toISOString().split('T')[0];
    const reminders = userData.tasks.filter(task => task.dueDate === today);
    if (reminders.length > 0) {
      let msg = "🔔 You have task(s) due today:\n\n";
      reminders.forEach(task => {
        msg += `• ${task.title} (Assigned to: ${task.assignee})\n`;
      });
      alert(msg);
    }
  }

  window.updateStatus = function(index) {
    const newStatus = prompt("Update status (pending, in-progress, completed):", userData.tasks[index].status);
    if (newStatus) {
      userData.tasks[index].status = newStatus.toLowerCase();
      localStorage.setItem(userEmail, JSON.stringify(userData));
      renderTasks();
    }
  };

  window.deleteTask = function(index) {
    if (confirm("Are you sure you want to delete this task?")) {
      userData.tasks.splice(index, 1);
      localStorage.setItem(userEmail, JSON.stringify(userData));
      renderTasks();
    }
  };

  function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  }

  window.logout = logout;
  renderTasks();
}
