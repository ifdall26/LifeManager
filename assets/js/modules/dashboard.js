function updateDashboardTask() {
  const tasks = Database.get("tasks");

  const activeTask = tasks.filter((task) => !task.completed).length;

  const element = document.getElementById("dashboardTask");

  if (element) {
    element.textContent = activeTask;
  }
}

function updateUrgentTask() {
  const tasks = Database.get("tasks");

  const urgentContainer = document.getElementById("urgentTask");

  if (!urgentContainer) {
    return;
  }

  const activeTasks = tasks.filter((task) => !task.completed);

  if (activeTasks.length === 0) {
    urgentContainer.innerHTML = "Tidak ada tugas aktif";

    return;
  }

  activeTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const urgent = activeTasks[0];

  urgentContainer.innerHTML = `
        <strong>${urgent.title}</strong>
        <br>
        Deadline:
        ${urgent.deadline}
    `;
}

updateDashboardTask();
updateUrgentTask();
