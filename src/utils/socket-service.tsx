import io from 'socket.io-client';
import { Constant } from '../constants/Constant';
import { store } from '../redux/store';
import { RootStackParamList, RootTabParamList } from '../types/navigation';

type SocketEmitActionType = 'page_view' | 'click';

type SocketEmitNameInterface =
  | `${keyof RootTabParamList} Screen`
  | `${keyof RootStackParamList} Screen`
  | 'Bottom Tab'
  | 'Add to Cart'
  | 'Remove from Cart'
  | 'Category Filter'
  | 'Add to Wishlist'
  | 'Back Button Pressed'
  | 'Header Button Pressed'
  | 'Checkout'
  | 'View Coupons'
  | 'Reorder'
  | 'Cancel Order'
  | 'Pay Now'
  | 'Event Button';

interface SocketEmitDataInterface {
  action: SocketEmitActionType;
  name: SocketEmitNameInterface;
  from?: SocketEmitNameInterface;
  params?: string;
}

class SocketService {
  socket: any;
  sessionId: string | null;
  constructor() {
    this.socket = null;
    this.sessionId = null;
  }

  initializeSocket(REG_ID: string) {
    this.socket = io(Constant.SOCKET_SERVER_URL);
    this.sessionId =
      Math.random().toString(26).substring(2, 13) +
      Math.random().toString(26).substring(2, 13) +
      Date.now();

    console.log('Initializing socket');

    this.socket.on('connect', () => {
      console.log('register Id:', REG_ID);
      this.socket.emit('register', REG_ID);
      console.log('Connected to socket server', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    // Add more event listeners as needed
  }

  emit(event: string, data: any) {
    if (this.socket && !__DEV__) {
      this.socket.emit(event, {
        user_id: store.getState().user.userData?.user_id,
        session_id: this.sessionId,
        ...data,
      });
    }
  }

  logAnalytics(data: SocketEmitDataInterface) {
    if (this.socket && !__DEV__) {
      this.socket.emit('analytics', {
        user_id: store.getState().user.userData?.user_id,
        session_id: this.sessionId,
        ...data,
      });
    }
  }

  on(event: string, callback: any) {
    if (this.socket) {
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
