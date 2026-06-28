/* 게시글 작성 페이지 이벤트 */

const postCreateForm = document.querySelector(
  ".post-create-form:not(.post-edit-form)",
);

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

/* 게시글 수정 페이지 이벤트 */

const postEditForm = document.querySelector(".post-edit-form");

if (postEditForm) {
  const editPostTitleInput = document.querySelector("#editPostTitle");
  const editPostContentTextarea = document.querySelector("#editPostContent");
  const editPostImageInput = document.querySelector("#editPostImage");
  const editPostFileName = document.querySelector("#editPostFileName");
  const postEditHelperText = document.querySelector("#postEditHelperText");
  const editPostSubmitButton = postEditForm.querySelector(
    ".post-submit-button",
  );

  let selectedEditImage = null;
  let selectedEditImageDataUrl = "";

  const setEditHelperText = (message) => {
    postEditHelperText.textContent = message;
  };

  const clearEditHelperText = () => {
    postEditHelperText.textContent = "";
  };

  const isPostEditFormValid = () => {
    const title = editPostTitleInput.value.trim();
    const content = editPostContentTextarea.value.trim();

    return title && content;
  };

  const validatePostEditForm = () => {
    const title = editPostTitleInput.value.trim();
    const content = editPostContentTextarea.value.trim();

    if (!title || !content) {
      setEditHelperText("*제목, 내용을 모두 작성해주세요");
      return false;
    }

    clearEditHelperText();
    return true;
  };

  const updateEditSubmitButtonState = () => {
    if (isPostEditFormValid()) {
      editPostSubmitButton.style.backgroundColor = "#7f6aee";
      return;
    }

    editPostSubmitButton.style.backgroundColor = "#aca0eb";
  };

  const updatePost = () => {
    const editedPost = {
      title: editPostTitleInput.value.trim(),
      content: editPostContentTextarea.value.trim(),
      image: selectedEditImageDataUrl,
      imageName: selectedEditImage
        ? selectedEditImage.name
        : editPostFileName.textContent,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("editedPost", JSON.stringify(editedPost));
  };

  editPostTitleInput.addEventListener("input", () => {
    clearEditHelperText();
    updateEditSubmitButtonState();
  });

  editPostContentTextarea.addEventListener("input", () => {
    clearEditHelperText();
    updateEditSubmitButtonState();
  });

  editPostImageInput.addEventListener("change", () => {
    const file = editPostImageInput.files[0];

    if (!file) {
      selectedEditImage = null;
      selectedEditImageDataUrl = "";
      editPostFileName.textContent = "기존 파일명";
      return;
    }

    selectedEditImage = file;
    editPostFileName.textContent = file.name;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      selectedEditImageDataUrl = reader.result;
    });

    reader.readAsDataURL(file);
  });

  postEditForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validatePostEditForm();

    if (!isValid) {
      editPostSubmitButton.style.backgroundColor = "#aca0eb";
      return;
    }

    updatePost();

    window.location.href = "./post-detail.html";
  });

  updateEditSubmitButtonState();
}

/* 게시글 상세 페이지 댓글 이벤트 */

const commentCreateForm = document.querySelector(".comment-create-form");

if (commentCreateForm) {
  const commentTextarea = document.querySelector(".comment-create-textarea");
  const commentSubmitButton = document.querySelector(".comment-create-button");
  const commentList = document.querySelector(".comment-list");

  let editingCommentItem = null;

  const getNowDateText = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  };

  const updateCommentButtonState = () => {
    const commentText = commentTextarea.value.trim();

    if (commentText) {
      commentSubmitButton.style.backgroundColor = "#7f6aee";
      return;
    }

    commentSubmitButton.style.backgroundColor = "#aca0eb";
  };

  const createCommentElement = (content) => {
    const commentItem = document.createElement("article");
    commentItem.className = "comment-item";

    commentItem.innerHTML = `
      <div class="comment-main">
        <div class="comment-profile-image"></div>

        <div class="comment-content-box">
          <div class="comment-meta-row">
            <span class="comment-author-name">더미 작성자 1</span>
            <time class="comment-date">${getNowDateText()}</time>
          </div>

          <p class="comment-content">${content}</p>
        </div>
      </div>

      <div class="comment-actions">
        <button type="button" class="post-detail-action-button comment-edit-button">
          <span class="post-detail-action-text">수정</span>
        </button>
        <button type="button" class="post-detail-action-button comment-delete-button">
          <span class="post-detail-action-text">삭제</span>
        </button>
      </div>
    `;

    return commentItem;
  };

  commentTextarea.addEventListener("input", updateCommentButtonState);

  commentCreateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const commentText = commentTextarea.value.trim();

    if (!commentText) {
      commentSubmitButton.style.backgroundColor = "#aca0eb";
      return;
    }

    if (editingCommentItem) {
      const commentContent =
        editingCommentItem.querySelector(".comment-content");

      commentContent.textContent = commentText;

      editingCommentItem = null;
      commentSubmitButton.textContent = "댓글 등록";
    } else {
      const newComment = createCommentElement(commentText);
      commentList.appendChild(newComment);
    }

    commentTextarea.value = "";
    updateCommentButtonState();
  });

  commentList.addEventListener("click", (event) => {
    const editButton = event.target.closest(".comment-edit-button");

    if (!editButton) {
      return;
    }

    const commentItem = editButton.closest(".comment-item");
    const commentContent = commentItem.querySelector(".comment-content");

    editingCommentItem = commentItem;
    commentTextarea.value = commentContent.textContent;
    commentSubmitButton.textContent = "댓글 수정";
    commentSubmitButton.style.backgroundColor = "#7f6aee";

    commentTextarea.focus();
  });

  updateCommentButtonState();
}
