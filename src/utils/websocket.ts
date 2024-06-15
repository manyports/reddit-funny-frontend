export const connectWebSocket = (onMessage: (message: any) => void) => {
    const socket = new WebSocket('ws://localhost:8080');
  
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
  