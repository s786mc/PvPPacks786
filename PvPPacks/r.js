document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("pp-user-mini");
  const user = JSON.parse(localStorage.getItem("pp-user"));

  if (user && user.name) {
    box.innerHTML = `<div class="name">👤 ${user.name}</div>`;
  } else {
    box.innerHTML = `<div class="icon">👤</div>`;
  }

  box.onclick = () => location.href = "./login.html";
});