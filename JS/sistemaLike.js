const likes = {};

const toggleLike = (postId) => {
    const likeBtn = document.getElementById(`likeBtn-${postId}`);
    const likeCount = document.getElementById(`likeCount-${postId}`);

    if (!likes[postId]) {
        likes[postId] = false;
    }

    if (likes[postId]) {
        likes[postId] = false;
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
        likeBtn.classList.remove("fa-solid");
        likeBtn.classList.add("fa-regular");
    } else {
        likes[postId] = true;
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
        likeBtn.classList.remove("fa-regular");
        likeBtn.classList.add("fa-solid");
    }
}