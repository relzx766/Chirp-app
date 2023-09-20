class websocketLink {
    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.reconnectTimes = 0;
        this.reconnectLock = false;
        this.reconnectLimit = options.reconnectLimit ? options.reconnectLimit : 5;
        this.socket = null;
    }

    start() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            this.options.onopen && this.options.onopen();
        }
        this.socket.onmessage = e => {
            this.options.onmessage && this.options.onmessage(e);
        }
        this.socket.onerror = err => {
            this.doReconnect();
            this.options.onerror && this.options.onerror(e);
        }
        this.socket.onclose = () => {
            this.doReconnect();
            this.options.onclose && this.options.onclose();
        }
    }

    doReconnect() {
        if (!this.reconnectLock && this.reconnectTimes <= this.reconnectLimit) {
            setTimeout(() => {
                this.reconnectLock = true;
                this.start();
                this.reconnectTimes++;
                this.reconnectLock = false;
            }, 2000)
        }
    }
}

export default websocketLink;