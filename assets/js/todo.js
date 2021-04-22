const todo = () => {
    let todoListDb = {};
    
    // Конструктор
    const construct = () => {
        dbConnect();
        selectElements();
        buildTask();
        bindAdd();
    };

    // Подключение к БД
    const dbConnect = () => {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
    };

    // Получение списка задач
    const getListTasks = async () => {
        await db.ref().child('tasks').get().then((snapshot) => {
            todoListDb = snapshot.val();
        });
    };

    // Добавление задачи в БД
    const addTaskDb = async text => {
        let postListRef = db.ref('tasks');
        let newPostRef = postListRef.push();
        newPostRef.set({
            taskText: text,
            completed: false
        });
    };

    // Выбор элементов
    const selectElements = () => {
        todoInput = document.getElementById("todo-input");
        todoList = document.getElementById("todo-list");
        todoListChildren = todoList.children;
        addButton = document.getElementById("todo-add-btn");
        infoMessage = document.getElementById("message");
    };

    // Рендеринг задач
    const buildTask = async () => {
        let todoListItem, taskCheckbox, taskValue, taskButton;

        await getListTasks();
        todoList.innerHTML = "";

        if (!todoListDb) return;

        Object.entries(todoListDb).map(([key, task]) => {
            todoListItem = document.createElement("li");
            todoListItem.setAttribute("class", "task");
            
            taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            taskCheckbox.checked = task.completed;       
            completeTask(todoListItem,taskCheckbox, key);

            taskValue = document.createElement("span");
            taskValue.innerHTML = task.taskText;
    
            taskButton = document.createElement("button");
            taskButton.setAttribute("class", "fa fa-trash");
    
            todoListItem.appendChild(taskCheckbox);
            todoListItem.appendChild(taskValue);
            todoListItem.appendChild(taskButton);
    
            todoList.appendChild(todoListItem);
        });

        await bindTodoListItem();
    };

    // Отображение ошибки
    const error = () => { 
        infoMessage.style.display = "block";
    };

    // Добавление задачи
    const addTask = async () => {
        let taskValue = todoInput.value;
        infoMessage.style.display = "none";

        if (taskValue === "")
            error();
        else {
            await addTaskDb(taskValue);
            await buildTask();
            todoInput.value = "";
        }
    };

    // Добавление задачи по Enter
    const enterKey = event => {
        if (event.keyCode === 13 && event.which === 13)
            addTask();
    };

    // Прикрепление обработчика для добавления
    const bindAdd = () => {
        addButton.onclick = addTask.bind(this);
        todoInput.onkeypress = enterKey.bind(this);
    };

    // Прикрепление обработчика для списка
    const bindTodoListItem = async () => {
        let todoListItem, checkBox, deleteButton, idx = 0;

        Object.entries(todoListDb).map(([key]) => {
            todoListItem = todoListChildren[idx++];

            checkBox = todoListItem.getElementsByTagName("input")[0];
            deleteButton = todoListItem.getElementsByTagName("button")[0];

            checkBox.onclick = completeTask.bind(this, todoListItem, checkBox, key);

            deleteButton.onclick = deleteTask.bind(this, key);
        })
    };

    // Удаление задачи
    const deleteTask = async key => {
        await db.ref().child('tasks/' + key).remove();
        await buildTask();
    };

    // Изменение статуса задачи на "Выполнено"
    const completeTask = (todoListItem, checkBox, key) => {
        if (checkBox.checked) {
            todoListItem.className = "task completed";
            db.ref().child('tasks/' + key).update({ 'completed': true })
        }
        else
            incompleteTask(todoListItem, key);
    };

    // Изменение статуса задачи на "Не выполнено"
    const incompleteTask = (todoListItem, key) => {
        todoListItem.className = "task";
        db.ref().child('tasks/' + key).update({ 'completed': false })
    };

    construct();
}

todo();