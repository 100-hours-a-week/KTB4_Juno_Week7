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
