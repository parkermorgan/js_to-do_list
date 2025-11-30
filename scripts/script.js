// Main task array that holds all task objects
let tasks = []

const addButton = document.getElementById("taskButton");
const taskList = document.getElementById("taskList");
const filterMenu = document.getElementById("filterMenu");

const taskModal = document.getElementById("taskModal");
const modalTaskInput = document.getElementById("modalTaskInput");
const saveTaskButton = document.getElementById("saveTaskButton");
const closeModalButton = document.getElementById("closeModalButton");
const cleanButton = document.getElementById("cleanButton");
let completeCount = document.getElementById("incompleteCount");

// Load tasks from localStorage if they exist
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    showTasks();
}

function addTask(taskText) {
    // Adds a new task and handles empty input errors
    try {
        if (taskText.trim() === "") {
            throw new Error("Task cannot be empty.");
        }
        
        const task = {
            text: taskText,
            completed: false
        };

        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        showTasks();
    } catch (error) {
        alert(`Error adding task: ${error.message}`);
        console.error(error);
    }
}
// Removes a task based on its index
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
}

// Re-renders the task list and applies filtering + UI updates
function showTasks() {
    taskList.innerHTML = "";

    // Apply filter based on dropdown selection
    let filteredTasks = tasks;

    if (filterMenu.value === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filterMenu.value === "incomplete") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    // Build each task item in the DOM
    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.classList.add("task-text");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("smallButton");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.classList.add("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteTask(index);
            alert(`Task '${task.text}' has been deleted.`)
        });

        const completeBtn = document.createElement("button");
        completeBtn.classList.add("smallButton");
        completeBtn.classList.add("completeBtn")
        completeBtn.classList.add("button");
        completeBtn.textContent = task.completed ? "Reset" : "Complete";
        completeBtn.addEventListener("click", function () {
            task.completed = !task.completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks();
        });

        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        taskItem.appendChild(completeBtn);
        taskList.appendChild(taskItem);

        if (task.completed) {
            taskText.style.textDecoration = "line-through";
            completeBtn.style.backgroundColor = "rgb(4, 167, 4)";
            taskText.style.opacity = 0.6;
        } else {
            taskText.style.textDecoration = "none";
            taskText.style.opacity = 1;
        }
    });
    const remaining = countIncomplete();
    if (remaining === 0 && tasks.length > 0) {
        completeCount.textContent = "All tasks completed!";
    } else {
        completeCount.textContent = "Incomplete tasks: " + remaining;
    }
}

// Recursive function that counts how many tasks are incomplete
function countIncomplete(index = 0, count = 0) {
    if (index >= tasks.length) {
        return count;
    }

    if (!tasks[index].completed) {
        count++;
    }

    return countIncomplete(index + 1, count);
}

// Event listeners for modal actions and UI buttons
addButton.addEventListener("click", function () {
    taskModal.style.display = "block";
});

saveTaskButton.addEventListener("click", function () {
    try {
        const text = modalTaskInput.value.trim();
        if (!text) {
            throw new Error("Please enter a task before saving.");
        }

        addTask(text);
        modalTaskInput.value = "";
        taskModal.style.display = "none";
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error(error);
    }
});

closeModalButton.addEventListener("click", function () {
    taskModal.style.display = "none";
});

cleanButton.addEventListener("click", function () {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
});

filterMenu.addEventListener("change", showTasks)