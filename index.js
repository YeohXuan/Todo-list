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
const todoList = document.getElementById("todo-list");

function pushToDB() {
  const inputValue = input.value;

  if (inputValue) {
    push(todoListInDB, inputValue);
    input.value = "";
  }
}

addBtn.addEventListener("click", pushToDB);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    pushToDB();
  }
});

onValue(todoListInDB, function (snapshot) {
  if (snapshot.exists()) {
    todoList.textContent = "";
    const taskArray = Object.entries(snapshot.val());
    for (let [taskID, task] of taskArray) {
      renderTodoList(taskID, task);
    }
  } else {
    todoList.innerHTML = "&nbsp&nbspNo task today... yet";
  }
});

function renderTodoList(taskID, task) {
  const newEl = document.createElement("li");
  newEl.textContent += task;

  newEl.addEventListener("click", () => {
    remove(ref(database, `todoList/${taskID}`));
  });

  todoList.append(newEl);
}
