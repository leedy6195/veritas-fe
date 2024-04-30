onmessage = function (e) {
    let delay = e.data;

    let timer = setTimeout(() => {
        postMessage(null);
        clearTimeout(timer);
    }, delay);
};