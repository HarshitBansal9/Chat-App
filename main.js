export class ChatSocket {
    static socket = null;

    static initialize() {
        if (ChatSocket.socket) {
            return;
        }
        ChatSocket.socket = io('http://localhost:3001/chat', {
            query: {
                token: localStorage.getItem('token')
            }
        });
    }

    static sendMessage(message) {
        ChatSocket.socket.emit('chat message', message);
    }

    static onMessage(callback) {
        ChatSocket.socket.on('chat message', callback);
    }
}

ChatSocket.initialize();