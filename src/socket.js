
// socket.js
import WebSocketClient from './WebSocketClient';

let socket = null;
const listeners = [];

export function initSocket() {
  if (socket) return socket;
  
  try {
    socket = new WebSocketClient();
    
    socket.addListener((event, data) => {
      if (event === 'message') {
        listeners.forEach(listener => listener(data));
      }
    });
    
    return socket;
  } catch (error) {
    console.error('Failed to initialize WebSocket:', error);
    return null;
  }
}

export function addSocketListener(listener) {
  if (typeof listener === 'function') {
    listeners.push(listener);
  }
}

export function removeSocketListener(listener) {
  const index = listeners.indexOf(listener);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
}

// Initialize socket when this module is imported
window.addEventListener('load', () => {
  if (!socket) {
    initSocket();
  }
});

export default {
  initSocket,
  addSocketListener,
  removeSocketListener
};
