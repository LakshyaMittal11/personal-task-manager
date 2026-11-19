
// Get HTML Elements
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const priorityInput = document.querySelector("#priorityInput");
const taskList = document.querySelector("#taskList");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");
const clearCompleted = document.querySelector("#clearCompleted");
const themeToggle = document.querySelector("#themeToggle");

// Load tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        const matchesSearch = task.name
            .toLowerCase()
            .includes(searchInput.value.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty-message">No tasks found! Add a new task.</p>';
    }

    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-name"></span>

            <span class="priority ${task.priority}">
                ${task.completed ? "✓ Done" : task.priority}
            </span>

            <div class="actions">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;

        // Set task name safely
        card.querySelector(".task-name").textContent = task.name;

        // Complete Task
        card.querySelector(".task-checkbox").addEventListener("change", () => {

            task.completed = !task.completed;

            saveTasks();
            renderTasks();

        });

        // Delete Task
        card.querySelector(".delete-btn").addEventListener("click", () => {

            tasks = tasks.filter(t => t.id !== task.id);

            saveTasks();
            renderTasks();

        });

        // Edit Task
        card.querySelector(".edit-btn").addEventListener("click", () => {

            const updatedTask = prompt("Edit your task:", task.name);

            if (updatedTask !== null && updatedTask.trim() !== "") {

                task.name = updatedTask.trim();

                saveTasks();
                renderTasks();

            }

        });

        taskList.appendChild(card);

    });

    updateProgress();
}

// Add New Task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") return;

    const newTask = {
        id: Date.now(),
        name: taskName,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

});

// Filter Tasks
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

// Search Tasks
searchInput.addEventListener("input", renderTasks);

// Update Progress
function updateProgress() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        task => task.completed
    ).length;

    const percentage = totalTasks === 0
        ? 0
        : (completedTasks / totalTasks) * 100;

    progressText.textContent =
        `${completedTasks} of ${totalTasks} tasks completed`;

    progressFill.style.width = percentage + "%";

}

// Clear Completed Tasks
clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

});

// Dark / Light Mode
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    themeToggle.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("darkMode", isDark);

});

// Restore Theme
if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀️";

}

// Initial Render
renderTasks();
