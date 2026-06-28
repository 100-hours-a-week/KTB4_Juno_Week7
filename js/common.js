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

const signoutApi = async () => {
  return await request("/users/signout", {
    method: "POST",
  });
};

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signoutApi();
    } catch (error) {
      console.error(error.message);
    } finally {
      localStorage.removeItem("userId");
      localStorage.removeItem("loginUser");
      window.location.href = "./index.html";
    }
  });
}
