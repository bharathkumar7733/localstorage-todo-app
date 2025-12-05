// Select elements
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-task-btn");
const taskList = document.querySelector(".tasklist");
const progressLine = document.getElementById("progressline");
const numberText = document.getElementById("number");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add Button / Form Submit
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(task);
  taskInput.value = "";
  saveTasks();
  renderTasks();
  updateProgress();
}

// Render All Tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    li.innerHTML = `
      <div class="left">
        <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
        <span class="task-text">${task.text}</span>
      </div>
      <div class="actions">
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑</button>
      </div>
    `;

    // Checkbox event
    li.querySelector(".task-check").addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      updateProgress();
      renderTasks();
    });

    // Delete Task
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
      updateProgress();
    });

    // Edit Task
    li.querySelector(".edit-btn").addEventListener("click", () => {
      const newText = prompt("Edit your task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    taskList.appendChild(li);
  });
}

// Update Progress Bar & Count + Confetti Celebration
function updateProgress() {
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  progressLine.style.width = `${progressPercent}%`;
  numberText.textContent = `${completedTasks}/${totalTasks}`;

  if (progressPercent === 100 && totalTasks > 0) {
    launchConfetti();
  }
}

// Confetti Animation
function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 50,
      spread: 50,
      startVelocity: 60,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
  }, 250);
}

// Local Storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks on page start
renderTasks();
updateProgress();
