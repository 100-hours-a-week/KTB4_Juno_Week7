/* 회원정보수정 페이지 이벤트 */

const profileEditForm = document.querySelector(".profile-edit-form");

if (profileEditForm) {
  const profileImageInput = document.querySelector("#profileImageInput");
  const profileImageEditButton = document.querySelector(
    ".profile-image-edit-button",
  );
  const nicknameInput = document.querySelector("#nickname");
  const profileHelperText = document.querySelector("#profileHelperText");
  const profileSubmitButton = document.querySelector(".profile-submit-button");
  const profileToast = document.querySelector("#profileToast");

  const withdrawButton = document.querySelector(".withdraw-button");
  const withdrawModal = document.querySelector("#withdrawModal");
  const withdrawCancelButton = withdrawModal.querySelector(
    ".withdraw-modal-cancel-button",
  );
  const withdrawConfirmButton = withdrawModal.querySelector(
    ".withdraw-modal-confirm-button",
  );

  const originalNickname = nicknameInput.value.trim();

  const getSavedUsers = () => {
    const savedUsers = localStorage.getItem("users");

    if (!savedUsers) {
      return [];
    }

    try {
      return JSON.parse(savedUsers);
    } catch (error) {
      return [];
    }
  };

  const showHelperText = (message) => {
    profileHelperText.textContent = message;
    profileHelperText.style.visibility = "visible";
  };

  const hideHelperText = () => {
    profileHelperText.textContent = "* helper text";
    profileHelperText.style.visibility = "hidden";
  };

  const isDuplicatedNickname = (nickname) => {
    const users = getSavedUsers();

    return users.some((user) => {
      return user.nickname === nickname && nickname !== originalNickname;
    });
  };

  const validateNickname = () => {
    const nickname = nicknameInput.value.trim();

    if (!nickname) {
      showHelperText("*닉네임을 입력해주세요.");
      return false;
    }

    if (nickname.length >= 11) {
      showHelperText("*닉네임은 최대 10자 까지 작성 가능합니다.");
      return false;
    }

    if (isDuplicatedNickname(nickname)) {
      showHelperText("*중복된 닉네임 입니다.");
      return false;
    }

    hideHelperText();
    return true;
  };

  const updateProfileSubmitButtonState = () => {
    const nickname = nicknameInput.value.trim();

    if (!nickname || nickname.length >= 11) {
      profileSubmitButton.style.backgroundColor = "#aca0eb";
      return;
    }

    profileSubmitButton.style.backgroundColor = "#7f6aee";
  };

  const showProfileToast = () => {
    profileToast.classList.add("show");

    setTimeout(() => {
      profileToast.classList.remove("show");
    }, 2000);
  };

  const saveProfile = () => {
    const profile = {
      nickname: nicknameInput.value.trim(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("profile", JSON.stringify(profile));
  };

  profileImageInput.addEventListener("change", () => {
    const file = profileImageInput.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      profileImageEditButton.style.backgroundImage = `url(${reader.result})`;
      profileImageEditButton.classList.add("has-image");
    });

    reader.readAsDataURL(file);
  });

  nicknameInput.addEventListener("input", () => {
    hideHelperText();
    updateProfileSubmitButtonState();
  });

  profileEditForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validateNickname();

    if (!isValid) {
      profileSubmitButton.style.backgroundColor = "#aca0eb";
      return;
    }

    saveProfile();
    profileSubmitButton.style.backgroundColor = "#7f6aee";
    showProfileToast();
  });

  withdrawButton.addEventListener("click", () => {
    withdrawModal.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  withdrawCancelButton.addEventListener("click", () => {
    withdrawModal.classList.remove("show");
    document.body.style.overflow = "";
  });

  withdrawConfirmButton.addEventListener("click", () => {
    localStorage.removeItem("loginUser");
    localStorage.removeItem("profile");

    withdrawModal.classList.remove("show");
    document.body.style.overflow = "";

    window.location.href = "./index.html";
  });

  hideHelperText();
  updateProfileSubmitButtonState();
}
/* 비밀번호 수정 페이지 이벤트 */

const passwordEditForm = document.querySelector(".password-edit-form");

if (passwordEditForm) {
  const passwordInput = document.querySelector("#password");
  const passwordConfirmInput = document.querySelector("#passwordConfirm");
  const passwordHelperText = document.querySelector("#passwordHelperText");
  const passwordConfirmHelperText = document.querySelector(
    "#passwordConfirmHelperText",
  );
  const passwordSubmitButton = document.querySelector(
    ".password-submit-button",
  );
  const passwordToast = document.querySelector("#passwordToast");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,20}$/;

  const showPasswordHelperText = (message) => {
    passwordHelperText.textContent = message;
    passwordHelperText.style.visibility = "visible";
  };

  const hidePasswordHelperText = () => {
    passwordHelperText.textContent = "* helper text";
    passwordHelperText.style.visibility = "hidden";
  };

  const showPasswordConfirmHelperText = (message) => {
    passwordConfirmHelperText.textContent = message;
    passwordConfirmHelperText.style.visibility = "visible";
  };

  const hidePasswordConfirmHelperText = () => {
    passwordConfirmHelperText.textContent = "* helper text";
    passwordConfirmHelperText.style.visibility = "hidden";
  };

  const isPasswordFormValid = () => {
    const password = passwordInput.value.trim();
    const passwordConfirm = passwordConfirmInput.value.trim();

    return (
      password &&
      passwordRegex.test(password) &&
      passwordConfirm &&
      password === passwordConfirm
    );
  };

  const updatePasswordSubmitButtonState = () => {
    if (isPasswordFormValid()) {
      passwordSubmitButton.style.backgroundColor = "#7f6aee";
      return;
    }

    passwordSubmitButton.style.backgroundColor = "#aca0eb";
  };

  const validatePasswordInput = () => {
    const password = passwordInput.value.trim();
    const passwordConfirm = passwordConfirmInput.value.trim();

    if (!password) {
      showPasswordHelperText("*비밀번호를 입력해주세요");
      return false;
    }

    if (!passwordRegex.test(password)) {
      showPasswordHelperText(
        "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.",
      );
      return false;
    }

    if (passwordConfirm && password !== passwordConfirm) {
      showPasswordHelperText("*비밀번호 확인과 다릅니다.");
      return false;
    }

    hidePasswordHelperText();
    return true;
  };

  const validatePasswordConfirmInput = () => {
    const password = passwordInput.value.trim();
    const passwordConfirm = passwordConfirmInput.value.trim();

    if (!passwordConfirm) {
      showPasswordConfirmHelperText("*비밀번호를 한번 더 입력해주세요");
      return false;
    }

    if (password && password !== passwordConfirm) {
      showPasswordConfirmHelperText("*비밀번호와 다릅니다.");
      return false;
    }

    hidePasswordConfirmHelperText();
    return true;
  };

  const validatePasswordForm = () => {
    const isPasswordValid = validatePasswordInput();
    const isPasswordConfirmValid = validatePasswordConfirmInput();

    return isPasswordValid && isPasswordConfirmValid;
  };

  const showPasswordToast = () => {
    passwordToast.classList.add("show");

    setTimeout(() => {
      passwordToast.classList.remove("show");
    }, 2000);
  };

  const savePassword = () => {
    const passwordInfo = {
      password: passwordInput.value.trim(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("passwordInfo", JSON.stringify(passwordInfo));
  };

  passwordInput.addEventListener("input", () => {
    validatePasswordInput();

    if (passwordConfirmInput.value.trim()) {
      validatePasswordConfirmInput();
    }

    updatePasswordSubmitButtonState();
  });

  passwordConfirmInput.addEventListener("input", () => {
    validatePasswordConfirmInput();

    if (passwordInput.value.trim()) {
      validatePasswordInput();
    }

    updatePasswordSubmitButtonState();
  });

  passwordEditForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validatePasswordForm();

    if (!isValid) {
      passwordSubmitButton.style.backgroundColor = "#aca0eb";
      return;
    }

    savePassword();
    passwordSubmitButton.style.backgroundColor = "#7f6aee";
    showPasswordToast();
  });

  hidePasswordHelperText();
  hidePasswordConfirmHelperText();
  updatePasswordSubmitButtonState();
}
