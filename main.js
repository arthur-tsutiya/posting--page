const commentForm = document.querySelector("#comment-form");
const commentTitle = document.querySelector("#comment-title");
const commentText = document.querySelector("#comment-text");
const submitBtn = document.querySelector("#comment-submit-btn");
const postsWrapper = document.querySelector(".posts-wrapper");

commentForm.addEventListener("submit", e => {
    e.preventDefault();

    beginPostAnimation(submitBtn);
    sendPost(commentTitle, commentText);
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

    /*
    fetch(url, {
        method,
        body: JSON.stringify(data),
        headers
    }).then(response => response.json())
    .then(inData => {
        console.log(inData);
        postComment(postsWrapper, createComment(inData));
        stopPostAnimation(submitBtn);
        setTimeout(() => requestAnimationFrame(() => triggerCommentTransition(postsWrapper)), 40);
    });
    */

    /*DEBUGGING*/
    setTimeout(() => {
        console.log(data);
        postComment(postsWrapper, createComment(data));
        stopPostAnimation(submitBtn);
        resetInputs(commentTitle, commentText);
        setTimeout(() => requestAnimationFrame(() => triggerCommentTransition(postsWrapper)), 40);
    }, 500);
}

function createComment(data) {

    let title = data.title || "No title provided";
    let text = data.body ||  "No comment provided";
    let id = data.id || 0;
    let userId = data.userId || 1;
    let author = "Author";

    const commentTemplate = `<div class="post collapsed">
        <div class="post-content">
            <h3 class="post-title">${title}</h3>
            <p class="post-text">${text}</p>
            <div class="author-info-wrapper">
                <p class="author-info">Post by <span class="author-name">${author}</span></p>
                <img class="author-img">
            </div>
        </div>
    </div>`;

    return commentTemplate;
}

function postComment(postsWrapper, commentHTML) {
    if (!postsWrapper) return;

    postsWrapper.insertAdjacentHTML("beforeend", commentHTML);
}

function triggerCommentTransition(postsWrapper) {
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
    textInput.value ="";
}