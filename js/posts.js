/* 게시글 작성 페이지 이벤트 */

const postCreateForm = document.querySelector(".post-create-form");

if (postCreateForm) {
  const postTitleInput = document.querySelector("#postTitle");
  const postContentTextarea = document.querySelector("#postContent");
  const postImageInput = document.querySelector("#postImage");
  const postFileName = document.querySelector("#postFileName");
  const postCreateHelperText = document.querySelector("#postCreateHelperText");
  const postSubmitButton = document.querySelector(".post-submit-button");

  let selectedPostImage = null;
  let selectedPostImageDataUrl = "";

  const getSavedPosts = () => {
    const savedPosts = localStorage.getItem("posts");

    if (!savedPosts) {
      return [];
    }

    return JSON.parse(savedPosts);
  };

  const setHelperText = (message) => {
    postCreateHelperText.textContent = message;
  };

  const clearHelperText = () => {
    postCreateHelperText.textContent = "";
  };

  const isPostFormValid = () => {
    const title = postTitleInput.value.trim();
    const content = postContentTextarea.value.trim();

    return title && title.length <= 26 && content;
  };

  const validatePostForm = () => {
    const title = postTitleInput.value.trim();
    const content = postContentTextarea.value.trim();

    if (!title || !content) {
      setHelperText("*제목, 내용을 모두 작성해주세요");
      return false;
    }

    clearHelperText();
    return true;
  };

  const updatePostSubmitButtonState = () => {
    if (isPostFormValid()) {
      postSubmitButton.style.backgroundColor = "#7f6aee";
      return;
    }

    postSubmitButton.style.backgroundColor = "#aca0eb";
  };

  const savePost = () => {
    const posts = getSavedPosts();

    const newPost = {
      id: Date.now(),
      title: postTitleInput.value.trim(),
      content: postContentTextarea.value.trim(),
      image: selectedPostImageDataUrl,
      imageName: selectedPostImage ? selectedPostImage.name : "",
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0,
    };

    posts.unshift(newPost);

    localStorage.setItem("posts", JSON.stringify(posts));
  };

  postTitleInput.addEventListener("input", () => {
    clearHelperText();
    updatePostSubmitButtonState();
  });

  postContentTextarea.addEventListener("input", () => {
    clearHelperText();
    updatePostSubmitButtonState();
  });

  postImageInput.addEventListener("change", () => {
    const file = postImageInput.files[0];

    if (!file) {
      selectedPostImage = null;
      selectedPostImageDataUrl = "";
      postFileName.textContent = "파일을 선택해주세요.";
      return;
    }

    selectedPostImage = file;
    postFileName.textContent = file.name;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      selectedPostImageDataUrl = reader.result;
    });

    reader.readAsDataURL(file);
  });

  postCreateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validatePostForm();

    if (!isValid) {
      postSubmitButton.style.backgroundColor = "#aca0eb";
      return;
    }

    savePost();

    window.location.href = "./posts.html";
  });

  updatePostSubmitButtonState();
}
