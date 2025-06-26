const commentForm = document.querySelector("#comment-form");
const commentTitle = document.querySelector("#comment-title");
const commentText = document.querySelector("#comment-text");
const postsWrapper = document.querySelector(".posts-wrapper");

/*
const postObserver = new MutationObserver((records, observerRef) => {
    for (let record of records) {
        for (let addedNode of record.addedNodes) {
            addedNode.classList.remove("collapsed");
        }
    }
});
*/
/*postObserver.observe(postsWrapper, {childList: true});*/

commentForm.addEventListener("submit", e => {
    e.preventDefault();

    let comment = createComment(commentTitle, commentText);

    if (comment){
        postComment(postsWrapper, comment);
        setTimeout(() => triggerCommentTransition(postsWrapper), 50);
    }
});

function createComment(titleInput, textInput) {
    if (!(titleInput && textInput)) return;

    let title = titleInput.value || "No title provided";
    let text = textInput.value ||  "No comment provided";
    let author = "Author";

    const commentTemplate = `<div class="post collapsed">
        <h3 class="post-title">${title}</h3>
        <p class="post-text">${text}</p>
        <div class="author-info-wrapper">
            <p class="author-info">Post by <span class="author-name">${author}</span></p>
            <img class="author-img">
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
