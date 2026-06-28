/* 헤더 프로필 드롭다운 이벤트 */

const headerProfileButton = document.querySelector(".header-profile-button");
const headerProfileMenu = document.querySelector(".header-profile-menu");
const logoutButton = document.querySelector(".logout-button");

if (headerProfileButton && headerProfileMenu) {
  headerProfileButton.addEventListener("click", (event) => {
    event.stopPropagation();
    headerProfileMenu.classList.toggle("show");
  });

  headerProfileMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    headerProfileMenu.classList.remove("show");
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loginUser");
    window.location.href = "./index.html";
  });
}
