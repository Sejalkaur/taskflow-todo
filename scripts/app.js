// // App functionality
// document.addEventListener("DOMContentLoaded", function () {
//   // Check if user is logged in
//   checkUserAuthentication();

//   // Initialize app
//   initializeApp();

//   // App state
//   let tasks = {
//     todo: [],
//     completed: [],
//     archived: [],
//   };

//   // DOM elements
//   const userAvatar = document.getElementById("userAvatar");
//   const userName = document.getElementById("userName");
//   const signOutBtn = document.getElementById("signOutBtn");
//   const taskInput = document.getElementById("taskInput");
//   const addTaskBtn = document.getElementById("addTaskBtn");
//   const taskError = document.getElementById("taskError");

//   // Stage elements
//   const todoList = document.getElementById("todoList");
//   const completedList = document.getElementById("completedList");
//   const archivedList = document.getElementById("archivedList");
//   const todoCount = document.getElementById("todoCount");
//   const completedCount = document.getElementById("completedCount");
//   const archivedCount = document.getElementById("archivedCount");

//   // Event listeners
//   signOutBtn.addEventListener("click", signOut);
//   addTaskBtn.addEventListener("click", addTask);

//   taskInput.addEventListener("keypress", function (e) {
//     if (e.key === "Enter") {
//       addTask();
//     }
//   });

//   taskInput.addEventListener("input", function () {
//     if (taskError.textContent) {
//       taskError.textContent = "";
//     }
//   });

//   function checkUserAuthentication() {
//     try {
//       const userData = localStorage.getItem("taskflow_user");
//       if (!userData) {
//         redirectToLanding();
//         return;
//       }

//       const user = JSON.parse(userData);
//       if (!user.name || !user.dateOfBirth) {
//         redirectToLanding();
//         return;
//       }

//       // Verify age is still valid
//       if (!isValidAge(user.dateOfBirth)) {
//         localStorage.removeItem("taskflow_user");
//         redirectToLanding();
//         return;
//       }
//     } catch (error) {
//       console.error("Error checking authentication:", error);
//       redirectToLanding();
//     }
//   }

//   function isValidAge(dateOfBirth) {
//     const today = new Date();
//     const birthDate = new Date(dateOfBirth);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();

//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       age--;
//     }

//     return age > 10;
//   }

//   function redirectToLanding() {
//     window.location.href = "index.html";
//   }

//   async function initializeApp() {
//     // Load user info
//     loadUserInfo();

//     // Load tasks from localStorage
//     loadTasks();

//     // If no tasks exist, load dummy data
//     if (
//       tasks.todo.length === 0 &&
//       tasks.completed.length === 0 &&
//       tasks.archived.length === 0
//     ) {
//       await loadDummyTasks();
//     }

//     // Render tasks
//     renderAllTasks();
//   }

//   function loadUserInfo() {
//     try {
//       const userData = JSON.parse(localStorage.getItem("taskflow_user"));
//       const name = userData.name;

//       // Set user name
//       userName.textContent = name;

//       // Set user avatar
//       const avatarUrl = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
//         name
//       )}`;
//       userAvatar.src = avatarUrl;
//       userAvatar.alt = `${name}'s Avatar`;
//     } catch (error) {
//       console.error("Error loading user info:", error);
//       redirectToLanding();
//     }
//   }

//   function loadTasks() {
//     try {
//       const savedTasks = localStorage.getItem("taskflow_tasks");
//       if (savedTasks) {
//         tasks = JSON.parse(savedTasks);
//       }
//     } catch (error) {
//       console.error("Error loading tasks:", error);
//       tasks = { todo: [], completed: [], archived: [] };
//     }
//   }

//   function saveTasks() {
//     try {
//       localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
//     } catch (error) {
//       console.error("Error saving tasks:", error);
//     }
//   }

//   async function loadDummyTasks() {
//     try {
//       const response = await fetch("https://dummyjson.com/todos");
//       const data = await response.json();

//       if (data.todos && Array.isArray(data.todos)) {
//         const dummyTasks = data.todos.slice(0, 10).map((todo) => ({
//           id: generateId(),
//           title: todo.todo,
//           timestamp: formatTimestamp(new Date()),
//           created: new Date().toISOString(),
//         }));

//         tasks.todo = dummyTasks;
//         saveTasks();
//       }
//     } catch (error) {
//       console.error("Error loading dummy tasks:", error);
//       // Add some default tasks if API fails
//       tasks.todo = [
//         {
//           id: generateId(),
//           title: "Welcome to TaskFlow!",
//           timestamp: formatTimestamp(new Date()),
//           created: new Date().toISOString(),
//         },
//         {
//           id: generateId(),
//           title: "Add your first task",
//           timestamp: formatTimestamp(new Date()),
//           created: new Date().toISOString(),
//         },
//       ];
//       saveTasks();
//     }
//   }

//   function generateId() {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2);
//   }

//   function formatTimestamp(date) {
//     const options = {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     };
//     return date.toLocaleString("en-US", options);
//   }

//   function addTask() {
//     const taskText = taskInput.value.trim();

//     if (!taskText) {
//       taskError.textContent = "Please enter a task description";
//       taskInput.focus();
//       return;
//     }

//     if (taskText.length > 100) {
//       taskError.textContent = "Task description must be 100 characters or less";
//       taskInput.focus();
//       return;
//     }

//     const newTask = {
//       id: generateId(),
//       title: taskText,
//       timestamp: formatTimestamp(new Date()),
//       created: new Date().toISOString(),
//     };

//     tasks.todo.push(newTask);
//     saveTasks();
//     renderAllTasks();

//     // Clear input
//     taskInput.value = "";
//     taskError.textContent = "";

//     // Add success feedback
//     showSuccessFeedback("Task added successfully!");
//   }

//   function showSuccessFeedback(message) {
//     const feedback = document.createElement("div");
//     feedback.textContent = message;
//     feedback.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: #27ae60;
//             color: white;
//             padding: 12px 20px;
//             border-radius: 8px;
//             font-weight: 600;
//             z-index: 1000;
//             animation: slideInRight 0.3s ease-out;
//         `;

//     document.body.appendChild(feedback);

//     setTimeout(() => {
//       feedback.style.animation = "slideOutRight 0.3s ease-in";
//       setTimeout(() => feedback.remove(), 300);
//     }, 2000);
//   }

//   function moveTask(taskId, fromStage, toStage) {
//     const taskIndex = tasks[fromStage].findIndex((task) => task.id === taskId);
//     if (taskIndex === -1) return;

//     const task = tasks[fromStage].splice(taskIndex, 1)[0];
//     task.timestamp = formatTimestamp(new Date());
//     tasks[toStage].push(task);

//     saveTasks();
//     renderAllTasks();

//     showSuccessFeedback(`Task moved to ${toStage}`);
//   }

//   function renderAllTasks() {
//     renderTasks("todo", todoList);
//     renderTasks("completed", completedList);
//     renderTasks("archived", archivedList);
//     updateCounts();
//   }

//   function renderTasks(stage, container) {
//     container.innerHTML = "";

//     if (tasks[stage].length === 0) {
//       const emptyState = document.createElement("div");
//       emptyState.className = "empty-state";
//       emptyState.textContent = `No ${stage} tasks`;
//       container.appendChild(emptyState);
//       return;
//     }

//     // Sort tasks by creation date (newest first)
//     const sortedTasks = [...tasks[stage]].sort(
//       (a, b) => new Date(b.created) - new Date(a.created)
//     );

//     sortedTasks.forEach((task) => {
//       const taskCard = createTaskCard(task, stage);
//       container.appendChild(taskCard);
//     });
//   }

//   function createTaskCard(task, stage) {
//     const card = document.createElement("div");
//     card.className = "task-card";

//     card.innerHTML = `
//             <div class="task-title">${escapeHtml(task.title)}</div>
//             <div class="task-timestamp">Last modified: ${task.timestamp}</div>
//             <div class="task-actions">
//                 ${getTaskActions(task.id, stage)}
//             </div>
//         `;

//     return card;
//   }

//   function getTaskActions(taskId, stage) {
//     let actions = "";

//     switch (stage) {
//       case "todo":
//         actions = `
//                     <button class="task-btn complete-btn" onclick="moveTask('${taskId}', 'todo', 'completed')">
//                         Mark as Completed
//                     </button>
//                     <button class="task-btn archive-btn" onclick="moveTask('${taskId}', 'todo', 'archived')">
//                         Archive
//                     </button>
//                 `;
//         break;
//       case "completed":
//         actions = `
//                     <button class="task-btn todo-btn" onclick="moveTask('${taskId}', 'completed', 'todo')">
//                         Move to Todo
//                     </button>
//                     <button class="task-btn archive-btn" onclick="moveTask('${taskId}', 'completed', 'archived')">
//                         Archive
//                     </button>
//                 `;
//         break;
//       case "archived":
//         actions = `
//                     <button class="task-btn todo-btn" onclick="moveTask('${taskId}', 'archived', 'todo')">
//                         Move to Todo
//                     </button>
//                     <button class="task-btn complete-btn" onclick="moveTask('${taskId}', 'archived', 'completed')">
//                         Move to Completed
//                     </button>
//                 `;
//         break;
//     }

//     return actions;
//   }

//   function updateCounts() {
//     todoCount.textContent = tasks.todo.length;
//     completedCount.textContent = tasks.completed.length;
//     archivedCount.textContent = tasks.archived.length;
//   }

//   function escapeHtml(text) {
//     const div = document.createElement("div");
//     div.textContent = text;
//     return div.innerHTML;
//   }

//   function signOut() {
//     if (confirm("Are you sure you want to sign out?")) {
//       localStorage.removeItem("taskflow_user");
//       localStorage.removeItem("taskflow_tasks");
//       redirectToLanding();
//     }
//   }

//   // Make moveTask function global so it can be called from onclick handlers
//   window.moveTask = moveTask;

//   // Add CSS for success feedback animation
//   const style = document.createElement("style");
//   style.textContent = `
//         @keyframes slideInRight {
//             from {
//                 transform: translateX(100%);
//                 opacity: 0;
//             }
//             to {
//                 transform: translateX(0);
//                 opacity: 1;
//             }
//         }

//         @keyframes slideOutRight {
//             from {
//                 transform: translateX(0);
//                 opacity: 1;
//             }
//             to {
//                 transform: translateX(100%);
//                 opacity: 0;
//             }
//         }
//     `;
//   document.head.appendChild(style);
// });

// App functionality
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  checkUserAuthentication();

  // Initialize app
  initializeApp();

  // App state
  let tasks = {
    todo: [],
    completed: [],
    archived: [],
  };

  // DOM elements
  const userAvatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const signOutBtn = document.getElementById("signOutBtn");
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskError = document.getElementById("taskError");

  // Stage elements
  const todoList = document.getElementById("todoList");
  const completedList = document.getElementById("completedList");
  const archivedList = document.getElementById("archivedList");
  const todoCount = document.getElementById("todoCount");
  const completedCount = document.getElementById("completedCount");
  const archivedCount = document.getElementById("archivedCount");

  // Event listeners
  signOutBtn.addEventListener("click", signOut);
  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  taskInput.addEventListener("input", function () {
    if (taskError.textContent) {
      taskError.textContent = "";
    }
  });

  function checkUserAuthentication() {
    try {
      const userData = localStorage.getItem("taskflow_user");
      if (!userData) {
        redirectToLanding();
        return false;
      }

      const user = JSON.parse(userData);
      if (!user.name || !user.dateOfBirth) {
        redirectToLanding();
        return false;
      }

      // Verify age is still valid
      if (!isValidAge(user.dateOfBirth)) {
        localStorage.removeItem("taskflow_user");
        redirectToLanding();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      redirectToLanding();
      return false;
    }
  }

  function isValidAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age > 10;
  }

  function redirectToLanding() {
    window.location.href = "index.html";
  }

  async function initializeApp() {
    // Only proceed if user is authenticated
    if (!checkUserAuthentication()) {
      return;
    }

    // Load user info
    loadUserInfo();

    // Load tasks from localStorage
    loadTasks();

    // If no tasks exist, load dummy data
    if (
      tasks.todo.length === 0 &&
      tasks.completed.length === 0 &&
      tasks.archived.length === 0
    ) {
      await loadDummyTasks();
    }

    // Render tasks
    renderAllTasks();
  }

  function loadUserInfo() {
    try {
      const userData = localStorage.getItem("taskflow_user");
      if (!userData) {
        redirectToLanding();
        return;
      }

      const user = JSON.parse(userData);
      if (!user.name) {
        redirectToLanding();
        return;
      }

      const name = user.name;

      // Set user name
      userName.textContent = name;

      // Set user avatar
      const avatarUrl = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
        name
      )}`;
      userAvatar.src = avatarUrl;
      userAvatar.alt = `${name}'s Avatar`;
    } catch (error) {
      console.error("Error loading user info:", error);
      // Don't redirect here, just set default values
      userName.textContent = "User";
      userAvatar.src =
        "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=User";
    }
  }

  function loadTasks() {
    try {
      const savedTasks = localStorage.getItem("taskflow_tasks");
      if (savedTasks) {
        tasks = JSON.parse(savedTasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      tasks = { todo: [], completed: [], archived: [] };
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }

  async function loadDummyTasks() {
    try {
      const response = await fetch("https://dummyjson.com/todos");
      const data = await response.json();

      if (data.todos && Array.isArray(data.todos)) {
        const dummyTasks = data.todos.slice(0, 10).map((todo) => ({
          id: generateId(),
          title: todo.todo,
          timestamp: formatTimestamp(new Date()),
          created: new Date().toISOString(),
        }));

        tasks.todo = dummyTasks;
        saveTasks();
      }
    } catch (error) {
      console.error("Error loading dummy tasks:", error);
      // Add some default tasks if API fails
      tasks.todo = [
        {
          id: generateId(),
          title: "Welcome to TaskFlow!",
          timestamp: formatTimestamp(new Date()),
          created: new Date().toISOString(),
        },
        {
          id: generateId(),
          title: "Add your first task",
          timestamp: formatTimestamp(new Date()),
          created: new Date().toISOString(),
        },
      ];
      saveTasks();
    }
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  function formatTimestamp(date) {
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  }

  function addTask() {
    const taskText = taskInput.value.trim();

    if (!taskText) {
      taskError.textContent = "Please enter a task description";
      taskInput.focus();
      return;
    }

    if (taskText.length > 100) {
      taskError.textContent = "Task description must be 100 characters or less";
      taskInput.focus();
      return;
    }

    const newTask = {
      id: generateId(),
      title: taskText,
      timestamp: formatTimestamp(new Date()),
      created: new Date().toISOString(),
    };

    tasks.todo.push(newTask);
    saveTasks();
    renderAllTasks();

    // Clear input
    taskInput.value = "";
    taskError.textContent = "";

    // Add success feedback
    showSuccessFeedback("Task added successfully!");
  }

  function showSuccessFeedback(message) {
    const feedback = document.createElement("div");
    feedback.textContent = message;
    feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }

  function moveTask(taskId, fromStage, toStage) {
    const taskIndex = tasks[fromStage].findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[fromStage].splice(taskIndex, 1)[0];
    task.timestamp = formatTimestamp(new Date());
    tasks[toStage].push(task);

    saveTasks();
    renderAllTasks();

    showSuccessFeedback(`Task moved to ${toStage}`);
  }

  function renderAllTasks() {
    renderTasks("todo", todoList);
    renderTasks("completed", completedList);
    renderTasks("archived", archivedList);
    updateCounts();
  }

  function renderTasks(stage, container) {
    container.innerHTML = "";

    if (tasks[stage].length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = `No ${stage} tasks`;
      container.appendChild(emptyState);
      return;
    }

    // Sort tasks by creation date (newest first)
    const sortedTasks = [...tasks[stage]].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    sortedTasks.forEach((task) => {
      const taskCard = createTaskCard(task, stage);
      container.appendChild(taskCard);
    });
  }

  function createTaskCard(task, stage) {
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
            <div class="task-title">${escapeHtml(task.title)}</div>
            <div class="task-timestamp">Last modified: ${task.timestamp}</div>
            <div class="task-actions">
                ${getTaskActions(task.id, stage)}
            </div>
        `;

    return card;
  }

  function getTaskActions(taskId, stage) {
    let actions = "";

    switch (stage) {
      case "todo":
        actions = `
                    <button class="task-btn complete-btn" onclick="moveTask('${taskId}', 'todo', 'completed')">
                        Mark as Completed
                    </button>
                    <button class="task-btn archive-btn" onclick="moveTask('${taskId}', 'todo', 'archived')">
                        Archive
                    </button>
                `;
        break;
      case "completed":
        actions = `
                    <button class="task-btn todo-btn" onclick="moveTask('${taskId}', 'completed', 'todo')">
                        Move to Todo
                    </button>
                    <button class="task-btn archive-btn" onclick="moveTask('${taskId}', 'completed', 'archived')">
                        Archive
                    </button>
                `;
        break;
      case "archived":
        actions = `
                    <button class="task-btn todo-btn" onclick="moveTask('${taskId}', 'archived', 'todo')">
                        Move to Todo
                    </button>
                    <button class="task-btn complete-btn" onclick="moveTask('${taskId}', 'archived', 'completed')">
                        Move to Completed
                    </button>
                `;
        break;
    }

    return actions;
  }

  function updateCounts() {
    todoCount.textContent = tasks.todo.length;
    completedCount.textContent = tasks.completed.length;
    archivedCount.textContent = tasks.archived.length;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function signOut() {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("taskflow_user");
      localStorage.removeItem("taskflow_tasks");
      redirectToLanding();
    }
  }

  // Make moveTask function global so it can be called from onclick handlers
  window.moveTask = moveTask;

  // Add CSS for success feedback animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
});
