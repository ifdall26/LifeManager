let tasks = Database.get("tasks");

function saveTasks() {
  Database.save("tasks", tasks);

  renderTasks();

  updateDashboardTask();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");

  if (!taskList) return;

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const div = document.createElement("div");

    div.className = "task-card";

    if (task.completed) {
      div.classList.add("task-completed");
    }

    div.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>

                <p>
                Deadline:
                ${task.deadline}
                </p>

                <p>
                Prioritas:
                ${task.priority}
                </p>
            </div>

            <div>

                <button
                onclick="toggleTask(${task.id})">
                ✓
                </button>

                <button
                onclick="deleteTask(${task.id})">
                ✕
                </button>

            </div>
        `;

    taskList.appendChild(div);
  });
}

function addTask() {
  const title = document.getElementById("taskTitle").value;

  const deadline = document.getElementById("taskDeadline").value;

  const priority = document.getElementById("taskPriority").value;

  if (title.trim() === "") {
    alert("Masukkan nama tugas");

    return;
  }

  tasks.push({
    id: Date.now(),

    title,

    deadline,

    priority,

    completed: false,
  });

  saveTasks();

  document.getElementById("taskTitle").value = "";
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
}

document.getElementById("addTaskBtn")?.addEventListener("click", addTask);

renderTasks();
