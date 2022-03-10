"use strict";
// IIFE to create local scope and to avoid global namespacing collision
(function () {
  let todoCollection = {};
  let todoIds = [];

  /* 
  Data Structure:
  const todoCollection = {
    "1": {
      id: 1,
      task: "HTML",
      isCompleted: false,
    },
    "2": {
      id: 2,
      task: "CSS",
      isCompleted: false,
    },
  };
  const todoIds = [1, 2];
  */

  // Localstorage
  function persistData(key, value) {
    const valueStirng = JSON.stringify(value);
    window.localStorage.setItem(key, valueStirng);
  }

  function getPersistedData(key) {
    const value = window.localStorage.getItem(key);
    return JSON.parse(value);
  }

  function init() {
    const _todoCollection = getPersistedData("todoCollection");
    const _todoIds = getPersistedData("todoIds");

    if (_todoCollection) {
      todoCollection = _todoCollection;
    }

    if (_todoIds) {
      todoIds = _todoIds;
    }

    if (todoIds.length) {
      renderTodoList(todoListEl, todoIds, todoCollection);
    }
  }

  // Dom Elements
  const todoListEl = document.getElementById("js-todo-list");
  const addTodoBtn = document.getElementById("js-add-todo-btn");
  const addTodoInput = document.getElementById("js-add-todo-input");
  const filterTodoRadioBtns = document.querySelectorAll(
    ".js-filter-todo-radio-btn"
  );
  const deleteAllBtn = document.getElementById("js-delete-all-btn");

  function createListItemEl(todoItem) {
    return `<li class="flex align-center todo-list-item">
    <input class="mt0 mb0 mr1" type="checkbox" value="${todoItem.id}" id="${
      todoItem.id
    }" ${todoItem.isCompleted ? "checked" : ""} />
    <label for="${todoItem.id}">${todoItem.task}</label>
    <button class="text-btn delete-btn danger js-delete-btn mla" data-id="${
      todoItem.id
    }">X</button>
    </li>`;
  }

  function renderTodoList(container, todoIds, todoCollection) {
    let todoListHTML = "";
    todoIds.forEach((id) => {
      todoListHTML += createListItemEl(todoCollection[id]);
    });

    container.innerHTML = todoListHTML;
  }

  function addTodo(task) {
    const todoId = todoIds.length + 1;
    const todoItem = {
      id: todoId,
      task,
      isCompleted: false,
    };

    todoCollection[todoId] = todoItem;
    todoIds.push(todoItem.id);
    addTodoInput.value = "";

    persistData("todoCollection", todoCollection);
    persistData("todoIds", todoIds);

    renderTodoList(todoListEl, todoIds, todoCollection);
  }

  function toggleTodoItem(id) {
    todoCollection[id].isCompleted = !todoCollection[id].isCompleted;
    persistData("todoCollection", todoCollection);
  }

  function filterTodoitems(category) {
    console.log("category", category);

    if (category === "all") {
      renderTodoList(todoListEl, todoIds, todoCollection);
      return;
    }

    let filteredTodoCollection = {};
    let filteredTodoIds = [];
    if (category === "active") {
      todoIds.forEach((id) => {
        const todoItem = todoCollection[id];
        console.log(todoItem);
        if (!todoItem.isCompleted) {
          filteredTodoCollection[id] = todoItem;
          filteredTodoIds.push(id);
        }
      });
    } else if (category === "completed") {
      todoIds.forEach((id) => {
        const todoItem = todoCollection[id];
        if (todoItem.isCompleted) {
          filteredTodoCollection[id] = todoItem;
          filteredTodoIds.push(id);
        }
      });
    } else {
      filteredTodoCollection = todoCollection;
    }

    renderTodoList(todoListEl, filteredTodoIds, filteredTodoCollection);
  }

  function deleteAll() {
    todoCollection = {};
    todoIds = [];

    persistData("todoCollection", {});
    persistData("todoIds", []);

    renderTodoList(todoListEl, [], {});
  }

  function deleteTodoItem(id) {
    const todoItemIndex = todoIds.indexOf(Number(id));
    delete todoCollection[id];
    todoIds.splice(todoItemIndex, 1);

    persistData("todoCollection", todoCollection);
    persistData("todoIds", todoIds);

    renderTodoList(todoListEl, todoIds, todoCollection);
  }

  function onAddTodo() {
    const task = addTodoInput.value;
    addTodo(task);
  }

  // Using EventDelegation: to keep our code simple and performant
  function onClickTodoItem(e) {
    const target = e.target;

    if (target.tagName === "INPUT") {
      e.stopPropagation();
      const id = target.id;
      toggleTodoItem(id);
    }

    if (
      target.tagName === "BUTTON" &&
      target.classList.contains("js-delete-btn")
    ) {
      e.stopPropagation();
      const id = target.getAttribute("data-id");
      deleteTodoItem(id);
    }
  }

  function onFilterTodoItems(e) {
    e.stopPropagation();
    const category = e.target.value;
    filterTodoitems(category);
  }

  function onDeleteAll() {
    deleteAll();
  }

  init();

  // AttachEvents
  addTodoBtn.addEventListener("click", onAddTodo, false);
  todoListEl.addEventListener("click", onClickTodoItem, false);
  filterTodoRadioBtns.forEach((item) => {
    item.addEventListener("input", onFilterTodoItems, false);
  });
  deleteAllBtn.addEventListener("click", onDeleteAll, true);
})();
