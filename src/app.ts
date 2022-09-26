{
    const $form = document.getElementsByTagName("form")[0];
    const $url = $form.elements["url"] as HTMLInputElement;
    const $comments = document.getElementById("js-content-comments");

    $form.onsubmit = function () {
        fetch($url.value)
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                const parser = new DOMParser();

                const doc = parser.parseFromString(html, "text/html");

                $comments.append(doc.querySelector("ul.items"));
            })
            .catch(console.error);
    };
}
