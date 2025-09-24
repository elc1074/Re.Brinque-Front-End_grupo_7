import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'https://back-rebrinque.onrender.com', {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;
