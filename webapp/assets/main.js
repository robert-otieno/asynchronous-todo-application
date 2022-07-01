const addNewTodoButton = document.getElementById("add-new-todo");
const createTodoButton = document.getElementById("create-todo");
const updateTodoButton = document.getElementById("update-todo");
const idField = document.getElementById("id-field");
const timeField = document.getElementById("time-field");
const bodyField = document.getElementById("body-field");
const todoList = document.querySelector(".todo-content");
const div = document.createElement("div");

updateTodoButton.style.display = "none"

let Todos = [];

// REST api

const displayAllTodos = () => {
	// todoList.innerHTML = ""
	axios
		.get("http://localhost:8000/posts").then(res => {
			Todos = [...res.data]
			if (Todos.length == 0) {
				todoList.innerHTML += `
			<div class = "empty-todo">
			<img src="./assets/images/undraw_empty_xct9.png" alt="empty image" style="width: 50%;">
			<br>
			<span style="font-family: 'Fira Sans', sans-serif; font-size: 20px; font-weight: bold;">There are no todos yet...</span>
			<br>
			</div>
			`;
			} else {
				for (let key in Todos) {
					let todo = Todos[key];
					todoList.innerHTML += `
				<div data-id="${todo.id}" class="todo-content-item">
					<span class="todo-id">▪️ ${todo.id} ▪️</span>
					${todo.status === "Complete" ? `<span style="text-decoration: line-through;" class="todo-text">${todo.body}</span>` : `<span class="todo-text">${todo.body}</span>`}
					<span class="todo-date">Created at : ${todo.timestamp}</span>
					${todo.status === "Complete" ? `<span class="todo-status complete">▪️ ${todo.status} ▪️</span>` : `<span class="todo-status incomplete">▪️ ${todo.status} ▪️</span>`}
					<div style="display: flex; flex-direction: column; justify-content: space-around; align-items: center;" class="actions-window">
						<i class="far fa-edit"></i>
						<i class="far fa-trash-alt"></i>
						${todo.status === "Complete" ? "" : '<i class="fas fa-check"></i>'}
					</div>
				</div>
				`;
				};
			}
		})
		.then(() => console.log(`GET: Here's the list of todos`, Todos))
		.catch(err => console.log(err));
}

// Initial display of all Todos
displayAllTodos();

const addTodo = () => {
	axios
		.post('http://localhost:8000/posts', {
			id: idField.value,
			timestamp: timeField.value,
			body: bodyField.value,
			status: "Not complete",
		})
		.then(res => {
			console.log(res.data)
			displayAllTodos();
		})
		.catch(err => console.error(err));

	idField.value = "";
	timeField.value = "";
	bodyField.value = "";
}

const editTodo = (itemId) => {
	createTodoButton.style.display = "none"
	updateTodoButton.style.display = "block"

	const { id, timestamp, status, body } = Todos.filter(todo => todo.id == itemId)[0];

	idField.value = id;
	timeField.value = getTimeStamp();
	bodyField.value = body;
}

const generateID = () => {
	let id = `${Math.random().toString(36).substr(2, 6)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 6)}`;
	return id;
}

const getTimeStamp = () => {
	let date = new Date();
	let time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	return time;
}

const addNewTodo = () => {
	idField.value = generateID();
	timeField.value = getTimeStamp();
}

const deleteTodo = (itemId) => {
	axios
		.delete(`http://localhost:8000/posts/${itemId}`)
		.then(res => {
			console.log(res.data)
			displayAllTodos()
		})
		.catch(err => console.log(err));
}

const updateTodo = () => {
	axios
		.patch(`http://localhost:8000/posts/${idField.value}`, {
			body: bodyField.value,
			timestamp: timeField.value,
		})
		.then(res => {
			console.log(`I fired:`, res.data)
			displayAllTodos();
		})
		.catch(err => console.log(err));
	idField.value = "";
	timeField.value = "";
	bodyField.value = "";

	updateTodoButton.style.display = "none"
	createTodoButton.style.display = "block"
}

const markTodoAsComplete = (itemId) => {
	axios
		.patch(`http://localhost:8000/posts/${itemId}`, {
			status: "Complete",
		})
		.then(res => {
			console.log(res.data)
			displayAllTodos();
		})
		.catch(err => console.log(err));
}

todoList.addEventListener('click', (e) => {

	const id = e.target.parentElement.parentElement.dataset.id;

	if (e.target.classList.contains('fa-edit')) {
		editTodo(id);
	}

	if (e.target.classList.contains('fa-trash-alt')) {
		deleteTodo(id);
	}

	if (e.target.classList.contains('fa-check')) {
		markTodoAsComplete(id);
	}
})

addNewTodoButton.addEventListener('click', addNewTodo);
createTodoButton.addEventListener('click', addTodo);
updateTodoButton.addEventListener('click', updateTodo);