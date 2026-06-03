const navButtons = document.querySelectorAll(".nav-btn");

const pages = document.querySelectorAll(".page");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    pages.forEach((page) => {
      page.classList.remove("active-page");
    });

    button.classList.add("active");

    const target = button.dataset.page;

    document.getElementById(target).classList.add("active-page");
  });
});
