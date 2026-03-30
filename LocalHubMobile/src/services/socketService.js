import { io } from 'socket.io-client';
import { Platform } from 'react-native';

// Use the local development URL for the emulator or device
const SOCKET_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket) return;

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
        });

        this.socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error);
        });
    }

    joinRoom(userId) {
        if (!this.socket) this.connect();
        this.socket.emit('join_room', userId);
    }

    onNewLead(callback) {
        if (!this.socket) this.connect();
        this.socket.on('new_lead', callback);
    }

    onStatsUpdate(callback) {
        if (!this.socket) this.connect();
        this.socket.on('stats_update', callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();
