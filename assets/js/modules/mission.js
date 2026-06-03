let tasks = Database.get("tasks");

function saveTasks() {
  Database.save("tasks", tasks);

  renderTasks();

  updateDashboardTask();

  updateMissionStats();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");

  if (!taskList) return;

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const div = document.createElement("div");

    div.className = "task-card";

    const today = new Date().toISOString().split("T")[0];

    if (!task.completed && task.deadline && task.deadline < today) {
      div.classList.add("task-overdue");
    }

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

<span class="
priority-badge
priority-${task.priority}
">

${task.priority.toUpperCase()}

</span>

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

function updateMissionStats() {
  const active = tasks.filter((t) => !t.completed).length;

  const completed = tasks.filter((t) => t.completed).length;

  document.getElementById("activeMissionCount").textContent = active;

  document.getElementById("completedMissionCount").textContent = completed;

  const total = tasks.length;

  let percent = 0;

  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  document.getElementById("missionProgress").style.width = percent + "%";
}

renderTasks();

updateMissionStats();
