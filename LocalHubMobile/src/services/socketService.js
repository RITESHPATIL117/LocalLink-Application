import { io } from 'socket.io-client';
import { Platform } from 'react-native';
import { API_URL } from '../config/env';

// Use the API_URL to determine the correct socket server host
const SOCKET_URL = API_URL.replace('/api', '');

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
