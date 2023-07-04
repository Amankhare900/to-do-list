let input = document.getElementById("inputTask");
let error = document.getElementById("error");
let taskList = document.getElementById("dailyTask");
let editMode = {
  active: false,
  id: null,
};
let tasks = [];

document.getElementById("submit").addEventListener("click", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();

  const taskContent = input.value.trim();

  if (taskContent !== "") {
    if (editMode.active) {
      updateTask(editMode.id, taskContent);
    } else {
      addTask(taskContent);
    }

    input.value = "";
    error.textContent = "";
  } else {
    error.textContent = "Please enter a task";
  }
}

function addTask(content) {
  const task = {
    id: generateUniqueId(),
    content: content,
    completed: false,
  };

  tasks.push(task);
  saveTasksToLocalStorage();
  renderTasks();
}

function updateTask(id, newContent) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex].content = newContent;
    saveTasksToLocalStorage();
    renderTasks();
    exitEditMode();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasksToLocalStorage();
  renderTasks();
  exitEditMode();
}

function toggleTaskCompletion(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

function enterEditMode(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex !== -1) {
    editMode.active = true;
    editMode.id = id;
    input.value = tasks[taskIndex].content;
  }
}

function exitEditMode() {
  editMode.active = false;
  editMode.id = null;
  input.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "tasks";
    taskItem.innerHTML = `
      <span>Task: </span>
      <p id="${task.id}" class="task-data">${task.content}</p>
      <span class="task-icon">
        <i onclick="toggleTaskCompletion('${task.id}')" class="fas ${
      task.completed ? "fa-check-circle" : "fa-circle"
    }"></i>
        <i onclick="enterEditMode('${task.id}')" class="fas fa-edit"></i>
        <i onclick="deleteTask('${task.id}')" class="fas fa-trash"></i>
      </span>
    `;

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    taskList.appendChild(taskItem);
  });
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

loadTasksFromLocalStorage();
