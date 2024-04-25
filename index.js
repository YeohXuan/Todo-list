import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://todo-list-b4fa5-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const todoListInDB = ref(database, "todoList");

const input = document.getElementById("input");
const addBtn = document.getElementById("add-btn");
const isImportantBtn = document.getElementById("toggle-imp");
const todoList = document.getElementById("todo-list");

function pushToDB() {
  const inputValue = input.value.trim();
  let isChecked;

  if (isImportantBtn.checked) {
    isChecked = true;
  } else {
    isChecked = false;
  }

  if (inputValue) {
    push(todoListInDB, `${inputValue} ${isChecked}`);
    input.value = "";
    isImportantBtn.checked = false;
  }
}

addBtn.addEventListener("click", pushToDB);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    pushToDB();
  }
});

onValue(todoListInDB, (snapshot) => {
  if (snapshot.exists()) {
    todoList.textContent = "";
    const taskArr = Object.entries(snapshot.val());

    for (let [taskID, task] of taskArr) {
      const words = task.split(" ");
      const isChecked = words.pop();
      const taskName = words.join(" ");

      renderTodoList(taskID, taskName, isChecked);
    }
  } else {
    todoList.textContent = "No task today... yet";
  }
});

function renderTodoList(taskID, task, isChecked) {
  const newEl = document.createElement("li");
  newEl.textContent += task;

  if (isChecked === "true") {
    newEl.classList.add("is-checked");
  }

  todoList.append(newEl);

  newEl.addEventListener("click", () => {
    remove(ref(database, `todoList/${taskID}`));
  });
}
