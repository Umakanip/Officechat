import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

type OnIncomingCall = (data: any) => void;

const useSocket = (onIncomingCall: OnIncomingCall): void => {
  useEffect(() => {
    const socket: Socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('connected to websocket server');
    });

    socket.on('incomingCall', (data: any) => {
      onIncomingCall(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [onIncomingCall]);
};

export default useSocket;
