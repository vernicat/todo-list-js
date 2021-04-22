const todo = () => {
    
    // конструктор
    const construct = () => {
        selectElements();
        bindAdd();
        bindTodoListItem();
    };

    // выбор элементов
    const selectElements = () => {
        todoInput = document.getElementById("todo-input");
        todoList = document.getElementById("todo-list");
        todoListChildren = todoList.children;
        addButton = document.getElementById("todo-add-btn");
        infoMessage = document.getElementById("message");
    };

    // рендеринг задачи
    const buildTask = () => {
        let todoListItem, taskCheckbox, taskValue, taskButton;

        todoListItem = document.createElement("li");
        todoListItem.setAttribute("class", "task");

        taskCheckbox = document.createElement("input");
        taskCheckbox.setAttribute("type", "checkbox");

        taskValue = document.createElement("span");
        taskValue.innerHTML = this.todoInput.value;

        taskButton = document.createElement("button");
        taskButton.setAttribute("class", "fa fa-trash");

        todoListItem.appendChild(taskCheckbox);
        todoListItem.appendChild(taskValue);
        todoListItem.appendChild(taskButton);

        todoList.appendChild(todoListItem);
    };

    // отображение ошибки
    const error = () => { 
        infoMessage.style.display = "block";
    };

    // добавление задачи
    const addTask = () => {
        let taskValue = todoInput.value;
        infoMessage.style.display = "none";

        if (taskValue === "")
            error();
        else {
            buildTask();
            todoInput.value = "";
            bindTodoListItem();
        }
    };

    // добавление по Enter
    const enterKey = event => {
        if (event.keyCode === 13 && event.which === 13)
            addTask();
    };

    // прикрепление обработчика для добавления
    const bindAdd = () => {
        addButton.onclick = addTask.bind(this);
        todoInput.onkeypress = enterKey.bind(this);
    };

    // прикрепление обработчика для списка
    const bindTodoListItem = () => {
        let todoListItem, checkBox, deleteButton;

        for (i = 0; i < todoListChildren.length; i++) {
            todoListItem = todoListChildren[i];

            checkBox = todoListItem.getElementsByTagName("input")[0];
            deleteButton = todoListItem.getElementsByTagName("button")[0];

            checkBox.onclick = completeTask.bind(this, todoListItem, checkBox);

            deleteButton.onclick = deleteTask.bind(this, i);
        }
    };

    // удаление задачи
    const deleteTask = i => {
        todoListChildren[i].remove();
        bindTodoListItem();
    };

    // завершение задачи
    const completeTask = (todoListItem, checkBox) => {
        if (checkBox.checked)
            todoListItem.className = "task completed";
        else
            incompleteTask(todoListItem);
    };

    // перенос задачи обратно в выполнение
    const incompleteTask = todoListItem => {
        todoListItem.className = "task";
    };

    construct();
}

todo();