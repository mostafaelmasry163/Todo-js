//selectors
const todoInput = document.querySelector('.todoInput');
const todoButton = document.querySelector('.todoButton');
const todoList = document.querySelector('.todoList');
const filterOption = document.querySelector('.filterOption');



//event listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', optionCheck);
filterOption.addEventListener('click', filterTodo);





//functions
function addTodo(e) {
    e.preventDefault();

    let todo = todoInput.value;

    // create todo list node
    createTodoList(todo);

    //add todo to local storage
    saveLocalTodos([todo, 0]);

    //clear input value
    todoInput.value = "";
}

function createTodoList(todo) {
    //create div 
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");

    //create li
    const newTodo = document.createElement('li');
    newTodo.classList.add("todoItem");
    newTodo.innerText = todo;

    todoDiv.appendChild(newTodo);

    //create done button
    const doneButton = document.createElement('button');
    doneButton.classList.add("doneBtn");
    doneButton.innerHTML = '<i class="fas fa-check"></i>';

    todoDiv.appendChild(doneButton);

    //create delete button
    const delButton = document.createElement('button');
    delButton.classList.add("delBtn");
    delButton.innerHTML = '<i class="fas fa-trash"></i>'

    todoDiv.appendChild(delButton);

    //append to list
    todoList.appendChild(todoDiv);
}

function optionCheck(e) {
    const item = e.target;
    const todo = item.parentElement;

    //delete todo
    if (item.classList[0] === "delBtn") {
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', () => {
            todo.remove();
        });
    } else if (item.classList[0] === "doneBtn") {
        todo.classList.toggle("completed");
        removeLocalTodos(todo);
    }
}

function filterTodo(e) {
    const val = e.target.value;
    const todos = todoList.childNodes;
    todos.forEach(todo => {
        switch (val) {
            case "all":
                todo.style.display = 'flex';
                break;
            case "completed":
                todo.classList.contains("completed") ? todo.style.display = 'flex' : todo.style.display = 'none';
                break;
            case "uncompleted":
                todo.classList.contains("completed") ? todo.style.display = 'none' : todo.style.display = 'flex';
                break;
        }
    });
}

function checkLocalTodos() {
    //check
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}

function saveLocalTodos(todo) {
    //check
    let todos = checkLocalTodos();

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
    //check
    let todos = checkLocalTodos();

    todos.forEach(todo => {
        // create todo list node
        createTodoList(todo[0]);

        if (todo[1] === 1) {
            todoList.lastChild.classList.toggle("completed");
        }
    });
}

function removeLocalTodos(todo) {
    // check
    let todos = checkLocalTodos();
    let i = 0;
    const todoIndex = todo.children[0].innerText;
    let newTodo = todos.map(ntodo => ntodo.filter(ntodo => ntodo !== todoIndex));
    const val = todo.className;
    switch (val) {
        case "todo fall":
            newTodo.forEach(todo => {
                if (todo.length < 2) {
                    newTodo.splice(i, 1);
                }
                i++;
            });
            break;

        case "todo completed":
            newTodo.forEach(todo => {
                if (todo.length < 2) {
                    newTodo.splice(i, 1, [todoIndex, 1]);
                }
                i++;
            });
            break;

        default:
            newTodo.forEach(todo => {
                if (todo.length < 2) {
                    newTodo.splice(i, 1, [todoIndex, 0]);
                }
                i++;
            });
            break;
    }

    localStorage.setItem("todos", JSON.stringify(newTodo));
}

