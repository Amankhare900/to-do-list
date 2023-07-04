let input = document.getElementById("inputTask");
let error = document.getElementById("error");
let task = document.getElementById("dailyTask");
let edit = false;
let editId = 0;
let id;
document.getElementById("submit").addEventListener("click", (e) => {
  if (input.value.trim() !== "") {
    if (edit) {
      let temp = document.getElementById(editId);
      temp.textContent = input.value;
      //   localStorage.setItem(editId, input.value);
      editTodo(input.value);
      edit = false;
      return;
    }
    saveTodo(input.value.trim(), addPost);
    e.preventDefault();
  } else {
    error.textContent = `write something`;
  }
});
// document.onclick = () => {
//   edit = false;
//   input.value = "";
// };

// document.addEventListener("click", (e) => {
//   // it is not adding the data when click to the edit button

//   if (edit === true)
//     if (e.target !== input && e.target !== document.getElementById("submit") && ) {
//       console.log(e.target);
//       edit = false;
//       input.value = "";
//     }
// });
function saveTodo(value, callback) {
  const imageInput = document.getElementById("my_images");
  const image = imageInput.files[0];
  if (image) {
    const xyz = new FormData();

    //console.log(image);
    xyz.append("task", value);
    xyz.append("image", image);

    // for (var key of xyz.entries()) {
    //   console.log(key[0] + " " + key[1]);
    // }
    let request = new XMLHttpRequest();
    request.open("POST", "/save-todo");

    request.send(xyz);
    request.addEventListener("load", () => {
      const pathName = request.responseText;
      request.status === 200 && callback(pathName);
    });
  }
}

function editTodo(value) {
  let request = new XMLHttpRequest();
  request.open("PUT", "/update-todo");

  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({ id: editId, task: value }));
  request.addEventListener("load", () => {
    request.status === 200;
  });
  input.value = "";
}

let addPost = (fileName) => {
  task.innerHTML += `
  <li class='tasks'>
  <span>Task: </span><p id='${id}' class='task-data'>${input.value}</p><img src="${fileName}" />
    <span task-icon>
    <i onclick='completeTodo(this)' event.stopPropagation() class="fa-regular fa-circle-check"></i>
    <i onclick='editData(this)' event.stopPropagation() class="fa-solid fa-pen-to-square task-edit"></i>
    <i onclick ='deleteTodo(this)' event.stopPropagation() class="fa-solid fa-trash"></i>
    </span>
  </li>`;

  input.value = "";
  error.textContent = "";
  id++;
};

function editData(element) {
  input.value =
    element.parentElement.previousElementSibling.previousElementSibling.textContent;
  editId =
    element.parentElement.previousElementSibling.previousElementSibling.id;
  edit = true;
}

function completeTodo(element) {
  let request = new XMLHttpRequest();
  request.open("PUT", "/complete-todo");
  request.setRequestHeader("Content-Type", "application/json");
  console.log(
    element.parentElement.previousElementSibling.previousElementSibling.style
      .textDecoration
  );
  request.send(
    JSON.stringify({
      id: parseInt(
        element.parentElement.previousElementSibling.previousElementSibling.getAttribute(
          "id"
        )
      ),
      isChecked:
        element.getAttribute("class") === "fa-solid fa-circle-check"
          ? false
          : true,
    })
  );
  request.addEventListener("load", () => {
    request.status === 200 && taskCompleted(element);
  });
}
let taskCompleted = (element) => {
  if (element.getAttribute("class") === "fa-solid fa-circle-check") {
    element.className = `fa-regular fa-circle-check`;
    // element.parentElement.previousElementSibling.style.textDecoration = "";
    element.parentElement.previousElementSibling.previousElementSibling.classList.remove(
      "line-through"
    );
  } else {
    element.className = "fa-solid fa-circle-check";
    // element.parentElement.previousElementSibling.style.textDecoration =
    //   "line-through";

    element.parentElement.previousElementSibling.previousElementSibling.classList.add(
      "line-through"
    );
  }
};

let deleteData = (element) => {
  element.parentElement.parentElement.remove();
  input.value = " ";
  edit = false;
};

function deleteTodo(element) {
  let request = new XMLHttpRequest();
  request.open("DELETE", "/delete-todo");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(
    JSON.stringify({
      id: parseInt(
        element.parentElement.previousElementSibling.previousElementSibling.getAttribute(
          "id"
        )
      ),
    })
  );
  request.addEventListener("load", () => {
    request.status === 200 && deleteData(element);
  });
}

let getTodo = (callback) => {
  var request = new XMLHttpRequest();
  request.open("GET", "/get-todo");
  request.send();
  request.addEventListener("load", () => {
    callback(JSON.parse(request.responseText));
  });
};

getTodo((todos) => {
  // iterating in todos map
  let isExist = false;
  for (let [key, obj] of Object.entries(todos)) {
    isExist = true;
    if (typeof obj === "object") {
      let value = obj.task;
      let fileName = obj.filename;
      console.log(fileName);
      task.innerHTML += `
            <li class='tasks'>
              <span>Task: </span><p id='${key}' class='task-data'>${value}</p><img src="${fileName}" />
              <span task-icon>
                <i onclick='completeTodo(this)' event.stopPropagation() class="fa-regular fa-circle-check"></i>
                <i onclick='editData(this)' event.stopPropagation() class="fa-solid fa-pen-to-square task-edit"></i>
                <i onclick ='deleteTodo(this)' event.stopPropagation() class="fa-solid fa-trash"></i>
              </span>
            </li>`;
      console.log(obj.isChecked);
      if (JSON.parse(obj.isChecked)) {
        // console.log(
        //   document.getElementById(key).nextElementSibling.childNodes[1]
        // );
        document
          .getElementById(key)
          .nextElementSibling.nextElementSibling.childNodes[1].setAttribute(
            "class",
            "fa-solid fa-circle-check"
          );
        document.getElementById(key).classList.add("line-through");
      } else {
        document
          .getElementById(key)
          .nextElementSibling.nextElementSibling.childNodes[1].setAttribute(
            "class",
            "fa-regular fa-circle-check"
          );
        document.getElementById(key).classList.remove("line-through");
      }
      input.value = "";
      error.textContent = "";
    }
  }
  if (isExist) {
    id = todos.currIdNo;
  } else {
    id = 0;
  }
  console.log(id);
});
