console.log("MISSION.JS LOADED");

const defaultDailyMission = [
  "Minum Air 8 Gelas",

  "Olahraga",

  "Review Keuangan",

  "Kerjakan Tugas Utama",

  "Rapikan Meja",
];

let tasks = Database.get("tasks");

function saveTasks() {
  Database.save("tasks", tasks);

  renderTasks();

  updateDashboardTask();

  updateMissionStats();

  updateUrgentTask();
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

function initializeDailyMission() {
  const today = new Date().toISOString().split("T")[0];

  const savedDate = localStorage.getItem("dailyMissionDate");

  if (savedDate !== today) {
    const missions = defaultDailyMission.map((item) => ({
      title: item,

      completed: false,
    }));

    Database.save("dailyMission", missions);

    localStorage.setItem("dailyMissionDate", today);
  }
}

function renderDailyMission() {
  const container = document.getElementById("dailyMissionContainer");

  if (!container) return;

  const missions = Database.get("dailyMission");

  const completed = missions.filter((m) => m.completed).length;

  const percent = missions.length
    ? Math.round((completed / missions.length) * 100)
    : 0;

  container.innerHTML = `

        <div class="daily-progress">

            <h3>
            Progress Harian:
            ${percent}%
            </h3>

            <div class="progress-container">

                <div
                    class="progress-bar"
                    style="width:${percent}%">
                </div>

            </div>

        </div>

    `;

  missions.forEach((mission, index) => {
    const div = document.createElement("div");

    div.className = "daily-card";

    if (mission.completed) {
      div.classList.add("completed");
    }

    div.innerHTML = `

            <div
            class="daily-title">

            ${mission.title}

            </div>

            <input
                type="checkbox"
                ${mission.completed ? "checked" : ""}
                onchange=
                "toggleDailyMission(${index})">

        `;

    container.appendChild(div);
  });
}

function toggleDailyMission(index) {
  const missions = Database.get("dailyMission");

  missions[index].completed = !missions[index].completed;

  Database.save("dailyMission", missions);

  renderDailyMission();
}

function checkTaskReminder() {
  const today = new Date().toISOString().split("T")[0];

  const overdueTasks = tasks.filter(
    (task) => !task.completed && task.deadline && task.deadline <= today,
  );

  if (overdueTasks.length > 0) {
    const task = overdueTasks[0];

    showNotification(
      "⚠️ Tugas Belum Selesai",

      task.title,
    );
  }
}

initializeDailyMission();

renderDailyMission();

renderTasks();

updateMissionStats();

updateUrgentTask();

function checkTaskReminder() {
  const today = new Date().toISOString().split("T")[0];

  const overdueTasks = tasks.filter(
    (task) => !task.completed && task.deadline && task.deadline <= today,
  );

  if (overdueTasks.length > 0) {
    const task = overdueTasks[0];

    showNotification(
      "⚠️ Tugas Belum Selesai",

      task.title,
    );
  }
}

requestNotificationPermission();

setInterval(
  checkTaskReminder,

  1000000,
);

console.log("REMINDER SYSTEM STARTED");

setInterval(() => {
  console.log("CHECKING TASKS...");
}, 6000000);
