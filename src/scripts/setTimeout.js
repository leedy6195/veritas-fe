let timeouts = [];

self.onmessage = (event) => {
    if (event.data.type === 'setTimeout') {
        const { callback, delay } = event.data;
        const id = setTimeout(() => {
            self.postMessage({ type: 'timeout' });
            callback();
        }, delay);
        timeouts.push(id);
    } else if (event.data.type === 'clearTimeout') {
        const { id } = event.data;
        clearTimeout(id);
        timeouts = timeouts.filter((timeoutId) => timeoutId !== id);
    }
};