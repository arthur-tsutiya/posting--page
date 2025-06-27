const commentForm = document.querySelector("#comment-form");
const commentTitle = document.querySelector("#comment-title");
const commentText = document.querySelector("#comment-text");
const submitBtn = document.querySelector("#comment-submit-btn");
const postsWrapper = document.querySelector(".posts-wrapper");

const formSubmitHandler = leadingDebouncer(() => {
    beginPostAnimation(submitBtn);
    sendPost(commentTitle, commentText);
}, 100);

commentForm.addEventListener("submit", e => {
    e.preventDefault();

    formSubmitHandler();
});

function sendPost(titleInput, textInput) {
    if (!(titleInput && textInput)) return;

    const url = 'https://jsonplaceholder.typicode.com/posts';
    const method = 'POST';
    const headers = {"Content-type": "application/json; charset=UTF-8"};

    const data = {
        title: titleInput.value,
        body: textInput.value, 
        userId: 1
    }

    fetch(url, {
        method,
        body: JSON.stringify(data),
        headers
    }).then(response => response.json())
    .then(inData => {
        postComment(postsWrapper, createPostHTML(inData));
        stopPostAnimation(submitBtn);
        resetInputs(commentTitle, commentText);
        setTimeout(() => requestAnimationFrame(() => triggerCommentTransition(postsWrapper)), 40);
    });
}

function createPostHTML(data) {

    let title = data.title || "No title provided";
    let text = data.body ||  "No comment provided";
    let id = data.id || 0;
    let userId = data.userId || 1;
    let author = "Author";

    const postTemplate = `<div class="post collapsed">
        <div class="post-content">
            <h3 class="post-title">${title}</h3>
            <p class="post-text">${text}</p>
            <div class="author-info-wrapper">
                <p class="author-info">Post by <span class="author-name">${author}</span></p>
                <img class="author-img circular" src="./img/profile-placeholder-60px.png" alt="Placeholder profile picture">
            </div>
        </div>
    </div>`;

    return postTemplate;
}

function postComment(postsWrapper, postHTML) {
    if (!postsWrapper) return;

    const postPlaceholder = postsWrapper.querySelector("#post-placeholder");

    if (postPlaceholder) {
        postPlaceholder.remove();
    }

    postsWrapper.insertAdjacentHTML("beforeend", postHTML);
}

function triggerCommentTransition(postsWrapper) {
    if(!postsWrapper) return;

    const lastComment = postsWrapper.children[postsWrapper.children.length - 1];
    lastComment.classList.remove("collapsed");
}

function beginPostAnimation(submitButton) {
    if (!submitButton) return;

    submitButton.value = "Posting...";
    submitButton.setAttribute("disabled", "");
}

function stopPostAnimation(submitButton) {
    if (!submitButton) return;

    submitButton.value = "Submit Post";
    submitButton.removeAttribute("disabled");
}

function resetInputs(titleInput, textInput) {
    if (!(titleInput && textInput)) return;

    titleInput.value = "";
    textInput.value = "";
}

function leadingDebouncer(func, timeout = 200) {
    let timer;

    return (...args) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);

        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    }
}