import io from 'socket.io-client';
import { Constant } from '../constants/Constant';

class SocketService {
  socket: any;
  constructor() {
    this.socket = null;
  }

  initializeSocket(REG_ID: string) {
    this.socket = io(Constant.SOCKET_SERVER_URL);

    this.socket.on('connect', () => {
      console.log('Connected to socket server', this.socket.id);
      this.socket.emit('register', REG_ID);
      console.log('Connected to socket server', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    // Add more event listeners as needed
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: any) {
    if (this.socket) {
      console.log('socket on', this.socket.id);
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: any) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketService = new SocketService();
export default socketService;
