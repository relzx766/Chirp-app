const heartBeat = "heartBeat";
export const baseUrl = "ws://localhost:8080/advice-service/interaction";

class websocketLink {
    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.reconnectTimes = 0;
        this.reconnectLock = false;
        this.reconnectLimit = options.reconnectLimit ? options.reconnectLimit : 5;
        this.socket = null;
        this.status = false;
    }

    start() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            this.options.onopen && this.options.onopen();
            this.reconnectTimes = 0;
            this.doHeartBeat();
            this.status = true;
        };
        this.socket.onmessage = (e) => {
            if (heartBeat.toLowerCase() !== e.data.toLowerCase()) {
                this.options.onmessage && this.options.onmessage(e);
            }
        };
        this.socket.onerror = (err) => {
            this.status = false;
            this.doReconnect();
            this.options.onerror && this.options.onerror(err);
        };
        this.socket.onclose = () => {
            this.status = false;
            this.doReconnect();
            this.options.onclose && this.options.onclose();
        };
    }

    doHeartBeat() {
        setInterval(() => {
            this.send(heartBeat);
        }, 5000);
    }

    send(text) {
        if (this.socket) {
            this.socket.send(text);
        }
    }

    close() {
        this.socket && this.socket.close();
    }

    doReconnect() {
        if (!this.reconnectLock && this.reconnectTimes <= this.reconnectLimit) {
            this.options.onretry && this.options.onretry();
            setTimeout(() => {
                this.reconnectLock = true;
                this.start();
                this.reconnectTimes++;
                this.reconnectLock = false;
            }, 2000);
        }
    }
}

export default websocketLink;
