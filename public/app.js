let input = document.getElementById("inputTask");
let error = document.getElementById("error");
let task = document.getElementById("dailyTask");
let edit = false;
let editId = 0;
let obj = {};
let id = 0;
document.getElementById("submit").addEventListener("click", (e) => {
  if (input.value !== "") {
    if (edit) {
      let temp = document.getElementById(editId);
      temp.textContent = input.value;
      localStorage.setItem(editId, input.value);
      edit = false;
      return;
    }
    addPost();
    input.value = "";
    e.preventDefault();

    error.textContent = "";
  } else {
    error.textContent = `write something`;
  }
});

let addPost = () => {
  task.innerHTML += `
  <li class='tasks'>
  <span>Task: </span><p id='${id}' class='task-data'>${input.value}</p>
    <span task-icon>
    <i onclick='taskCompleted(this)'class="fa-regular fa-circle-check"></i>
    <i onclick='editData(this)' class="fa-solid fa-pen-to-square task-edit"></i>
    <i onclick ="deleteData(this)" class="fa-solid fa-trash"></i>
    </span>
  </li>`;
  // localStorage.setItem(id, input.value);
  id++;
};
let taskCompleted = (element) => {
  if (element.getAttribute("class") === "fa-solid fa-circle-check") {
    element.className = `fa-regular fa-circle-check`;
    element.parentElement.previousElementSibling.style.textDecoration = "";
  } else {
    element.className = "fa-solid fa-circle-check";
    element.parentElement.previousElementSibling.style.textDecoration =
      "line-through";
  }
};
let editData = (element) => {
  input.value = element.parentElement.previousElementSibling.textContent;
  edit = true;
  editId = element.parentElement.previousElementSibling.id;
};

let deleteData = (element) => {
  element.parentElement.parentElement.remove();
};
