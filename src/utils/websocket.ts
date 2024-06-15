export const connectWebSocket = (onMessage: (message: any) => void) => {
    const socket = new WebSocket('ws://reddit-funny-backend.onrender.com/start-cron');
  
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };
  
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(() => connectWebSocket(onMessage), 1000);
    };
  
    return socket;
  };
  