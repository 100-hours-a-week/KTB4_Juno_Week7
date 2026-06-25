const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const loginForm = document.querySelector(".login-form");
const loginButton = document.querySelector(".login-button");
const loginHelperText = document.querySelector("#loginHelperText");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,20}$/;

const getLoginErrorMessage = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email) {
    return "* 이메일을 입력해주세요.";
  }

  if (!emailRegex.test(email)) {
    return "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@adapterz.kr)";
  }

  if (!password) {
    return "* 비밀번호를 입력해주세요.";
  }

  if (!passwordRegex.test(password)) {
    return "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  return "";
};

const updateLoginState = () => {
  const errorMessage = getLoginErrorMessage();

  loginHelperText.textContent = errorMessage;

  if (errorMessage) {
    loginButton.classList.remove("active");
    return false;
  }

  loginButton.classList.add("active");
  return true;
};

emailInput.addEventListener("input", updateLoginState);
passwordInput.addEventListener("input", updateLoginState);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid = updateLoginState();

  if (!isValid) {
    return;
  }

  window.location.href = "./posts.html";
});
