function updateDashboardTask() {
  const activeTask = tasks.filter((task) => !task.completed).length;

  const element = document.getElementById("dashboardTask");

  if (element) {
    element.textContent = activeTask;
  }
}

updateDashboardTask();
