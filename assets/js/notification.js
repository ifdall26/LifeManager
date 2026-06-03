async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

function showNotification(title, message) {
  console.log(title, message);

  alert(title + "\n\n" + message);
}
