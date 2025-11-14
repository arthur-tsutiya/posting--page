const postForm = document.querySelector("#post-form");
const inputTitle = document.querySelector("#input-title");
const inputText = document.querySelector("#input-text");
const submitBtn = document.querySelector("#submit-btn");
const postsWrapper = document.querySelector("#posts-wrapper");

const formSubmitHandler = leadingDebounce(() => {
    beginPostAnimation(submitBtn);
    sendPost(inputTitle, inputText);
}, 100);

postForm.addEventListener("submit", e => {
    e.preventDefault();

    formSubmitHandler();
});

function sendPost(titleInput, textInput) {
    if (!(titleInput && textInput)) throw new Error("Undefined/null argument(s) to sendPost()");

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
    })
    .then(response => response.json())
    .then(inData => {
        postComment(postsWrapper, createPostHTML(inData));
        stopPostAnimation(submitBtn);
        resetInputs(inputTitle, inputText);

        /* Necessary to trigger each post's transition from collapsed to visible as they are added to the DOM */
        setTimeout(() => requestAnimationFrame(() => triggerCommentTransition(postsWrapper)), 30);
    })
    .catch(error => console.log(error));
}

function createPostHTML(data) {

    let title = data.title || "No title provided";
    let text = data.body ||  "No comment provided";
    let id = data.id || -1;
    let userId = data.userId || -1;
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

    const postPlaceholder = postsWrapper.querySelector("#post-placeholder");

    if (postPlaceholder) {
        postPlaceholder.remove();
    }

    postsWrapper.insertAdjacentHTML("beforeend", postHTML);
}

function triggerCommentTransition(postsWrapper) {
    const lastComment = postsWrapper.children[postsWrapper.children.length - 1];
    lastComment.classList.remove("collapsed");
}

function beginPostAnimation(submitButton) {
    submitButton.value = "Posting...";
    submitButton.setAttribute("disabled", "");
}

function stopPostAnimation(submitButton) {
    submitButton.value = "Submit Post";
    submitButton.removeAttribute("disabled");
}

function resetInputs(titleInput, textInput) {
    titleInput.value = "";
    textInput.value = "";
}

function leadingDebounce(func, timeout = 200) {
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