/* 게시글 목록 페이지 API 연동 */

const postList = document.querySelector("#postList");

if (postList) {
  const getPostsApi = async () => {
    return await request("/posts");
  };

  const formatPostListCount = (count) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}k`;
    }

    return String(count);
  };

  const getProfileImageStyle = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    return `style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"`;
  };

  const renderPosts = (posts) => {
    postList.innerHTML = "";

    if (!posts.length) {
      postList.innerHTML = `<p class="post-empty-message">게시글이 없습니다.</p>`;
      return;
    }

    posts.forEach((post) => {
      const postCardLink = document.createElement("a");

      postCardLink.href = `./post-detail.html?post_id=${post.post_id}`;
      postCardLink.className = "post-card-link";

      postCardLink.innerHTML = `
        <article class="post-card">
          <div class="post-card-top">
            <h2 class="post-title">${post.title}</h2>

            <div class="post-info-row">
              <div class="post-stats">
                <span>좋아요 ${formatPostListCount(post.like_count)}</span>
                <span>댓글 ${formatPostListCount(post.comment_count)}</span>
                <span>조회수 ${formatPostListCount(post.view_count)}</span>
              </div>

              <time class="post-date">${post.created_at}</time>
            </div>
          </div>

          <div class="post-card-bottom">
            <div 
              class="post-author-image"
              ${getProfileImageStyle(post.author_profile_image)}
            ></div>
            <span class="post-author-name">${post.author_nickname}</span>
          </div>
        </article>
      `;

      postList.appendChild(postCardLink);
    });
  };

  const loadPosts = async () => {
    try {
      const response = await getPostsApi();

      renderPosts(response.data.posts);
    } catch (error) {
      alert(error.message);
    }
  };

  loadPosts();
}

/* 게시글 상세 페이지 API 연동 */

const postDetailTitle = document.querySelector("#postDetailTitle");

if (postDetailTitle) {
  const postDetailAuthorImage = document.querySelector(
    "#postDetailAuthorImage",
  );
  const postDetailAuthorName = document.querySelector("#postDetailAuthorName");
  const postDetailDate = document.querySelector("#postDetailDate");
  const postDetailImage = document.querySelector("#postDetailImage");
  const postDetailContent = document.querySelector("#postDetailContent");
  const postDetailLikeCount = document.querySelector("#postDetailLikeCount");
  const postDetailViewCount = document.querySelector("#postDetailViewCount");
  const postDetailCommentCount = document.querySelector(
    "#postDetailCommentCount",
  );
  const postEditLink = document.querySelector("#postEditLink");
  const commentList = document.querySelector("#commentList");

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("post_id");

  const getPostDetailApi = async () => {
    return await request(`/posts/${postId}`);
  };

  const formatDetailCount = (count) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}k`;
    }

    return String(count);
  };

  const setBackgroundImage = (element, imageUrl) => {
    if (!imageUrl) {
      element.style.backgroundImage = "";
      return;
    }

    element.style.backgroundImage = `url(${imageUrl})`;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
  };

  const renderComments = (comments) => {
    commentList.innerHTML = "";

    comments.forEach((comment) => {
      const commentItem = document.createElement("article");
      commentItem.className = "comment-item";
      commentItem.dataset.commentId = comment.comment_id;

      commentItem.innerHTML = `
        <div class="comment-main">
          <div class="comment-profile-image"></div>

          <div class="comment-content-box">
            <div class="comment-meta-row">
              <span class="comment-author-name">${comment.author_nickname}</span>
              <time class="comment-date">${comment.created_at}</time>
            </div>

            <p class="comment-content">${comment.content}</p>
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

      const commentProfileImage = commentItem.querySelector(
        ".comment-profile-image",
      );

      setBackgroundImage(commentProfileImage, comment.author_profile_image);

      commentList.appendChild(commentItem);
    });
  };

  const renderPostDetail = (post) => {
    postDetailTitle.textContent = post.title;
    postDetailAuthorName.textContent = post.author_nickname;
    postDetailDate.textContent = post.created_at;
    postDetailContent.textContent = post.content;

    postDetailLikeCount.textContent = formatDetailCount(post.like_count);
    postDetailViewCount.textContent = formatDetailCount(post.view_count);
    postDetailCommentCount.textContent = formatDetailCount(post.comment_count);

    postEditLink.href = `./post-edit.html?post_id=${post.post_id}`;

    setBackgroundImage(postDetailAuthorImage, post.author_profile_image);

    if (post.image) {
      setBackgroundImage(postDetailImage, post.image);
      postDetailImage.style.display = "block";
    } else {
      postDetailImage.style.display = "none";
    }

    renderComments(post.comments);
  };

  const loadPostDetail = async () => {
    if (!postId) {
      alert("게시글 정보를 찾을 수 없습니다.");
      window.location.href = "./posts.html";
      return;
    }

    try {
      const response = await getPostDetailApi();

      renderPostDetail(response.data);
    } catch (error) {
      alert(error.message);
      window.location.href = "./posts.html";
    }
  };

  loadPostDetail();
}

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

  const createPostApi = async () => {
    const body = {
      title: postTitleInput.value.trim(),
      content: postContentTextarea.value.trim(),
      image: "",
    };

    return await request("/posts", {
      method: "POST",
      body: JSON.stringify(body),
    });
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

  postCreateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = validatePostForm();

    if (!isValid) {
      postSubmitButton.style.backgroundColor = "#aca0eb";
      return;
    }

    try {
      await createPostApi();

      window.location.href = "./posts.html";
    } catch (error) {
      setHelperText(`*${error.message}`);
      postSubmitButton.style.backgroundColor = "#aca0eb";
    }
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
const params = new URLSearchParams(window.location.search);
const postId = params.get("post_id");

const createCommentApi = async (content) => {
  return await request(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({
      content,
    }),
  });
};

if (commentCreateForm) {
  const commentTextarea = document.querySelector(".comment-create-textarea");
  const commentSubmitButton = document.querySelector(".comment-create-button");
  const commentList = document.querySelector(".comment-list");

  const likeStatCard = document.querySelector(".like-stat-card");
  const likeCountElement = document.querySelector(".like-count");
  const viewCountElement = document.querySelector(".view-count");
  const commentCountElement = document.querySelector(".comment-count");

  const commentDeleteModal = document.querySelector("#commentDeleteModal");
  const commentDeleteCancelButton = document.querySelector(
    ".delete-modal-cancel-button",
  );
  const commentDeleteConfirmButton = document.querySelector(
    ".delete-modal-confirm-button",
  );

  let editingCommentItem = null;
  let deletingCommentItem = null;
  let isLiked = false;

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("post_id");

  const addLikeApi = async () => {
    return await request(`/posts/${postId}/likes`, {
      method: "POST",
    });
  };

  const deleteLikeApi = async () => {
    return await request(`/posts/${postId}/likes`, {
      method: "DELETE",
    });
  };

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

  const formatCount = (count) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}k`;
    }

    return String(count);
  };

  const updateLikeState = (likeCount, liked) => {
    likeCountElement.textContent = formatCount(likeCount);
    isLiked = liked;

    if (isLiked) {
      likeStatCard.style.backgroundColor = "#aca0eb";
      return;
    }

    likeStatCard.style.backgroundColor = "#d9d9d9";
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

  likeStatCard.addEventListener("click", async () => {
    if (!postId) {
      alert("게시글 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const response = isLiked ? await deleteLikeApi() : await addLikeApi();

      updateLikeState(response.data.like_count, response.data.liked);
    } catch (error) {
      alert(error.message);
    }
  });

  commentTextarea.addEventListener("input", updateCommentButtonState);

  commentCreateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const commentText = commentTextarea.value.trim();

    if (!commentText) {
      commentSubmitButton.style.backgroundColor = "#aca0eb";
      return;
    }

    if (!postId) {
      alert("게시글 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      await createCommentApi(commentText);

      alert("댓글이 작성되었습니다.");

      commentTextarea.value = "";
      updateCommentButtonState();

      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });

  commentList.addEventListener("click", (event) => {
    const editButton = event.target.closest(".comment-edit-button");
    const deleteButton = event.target.closest(".comment-delete-button");

    if (editButton) {
      const commentItem = editButton.closest(".comment-item");
      const commentContent = commentItem.querySelector(".comment-content");

      editingCommentItem = commentItem;
      commentTextarea.value = commentContent.textContent;
      commentSubmitButton.textContent = "댓글 수정";
      commentSubmitButton.style.backgroundColor = "#7f6aee";

      commentTextarea.focus();
      return;
    }

    if (deleteButton) {
      deletingCommentItem = deleteButton.closest(".comment-item");
      commentDeleteModal.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  });

  commentDeleteCancelButton.addEventListener("click", () => {
    deletingCommentItem = null;
    commentDeleteModal.classList.remove("show");
    document.body.style.overflow = "";
  });

  commentDeleteConfirmButton.addEventListener("click", () => {
    if (!deletingCommentItem) {
      return;
    }

    if (editingCommentItem === deletingCommentItem) {
      editingCommentItem = null;
      commentTextarea.value = "";
      commentSubmitButton.textContent = "댓글 등록";
      updateCommentButtonState();
    }

    deletingCommentItem.remove();
    commentCount -= 1;
    updateStats();

    deletingCommentItem = null;
    commentDeleteModal.classList.remove("show");
    document.body.style.overflow = "";
  });

  updateCommentButtonState();
}
/* 게시글 삭제 모달 이벤트 */

const postDeleteButton = document.querySelector(".post-delete-button");
const postDeleteModal = document.querySelector("#postDeleteModal");

if (postDeleteButton && postDeleteModal) {
  const postDeleteCancelButton = postDeleteModal.querySelector(
    ".delete-modal-cancel-button",
  );
  const postDeleteConfirmButton = postDeleteModal.querySelector(
    ".delete-modal-confirm-button",
  );

  const openPostDeleteModal = () => {
    postDeleteModal.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  const closePostDeleteModal = () => {
    postDeleteModal.classList.remove("show");
    document.body.style.overflow = "";
  };

  postDeleteButton.addEventListener("click", openPostDeleteModal);

  postDeleteCancelButton.addEventListener("click", closePostDeleteModal);

  postDeleteConfirmButton.addEventListener("click", () => {
    localStorage.removeItem("editedPost");

    closePostDeleteModal();

    window.location.href = "./posts.html";
  });
}
