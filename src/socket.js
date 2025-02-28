
// socket.js
import WebSocketClient from './WebSocketClient';

let socket = null;
const listeners = [];
let isSocketAvailable = true;

export function initSocket() {
  if (socket) return socket;
  
  try {
    socket = new WebSocketClient();
    
    socket.addListener((event, data) => {
      if (event === 'message') {
        listeners.forEach(listener => listener(data));
      } else if (event === 'unavailable') {
        isSocketAvailable = false;
        console.log('WebSocket is unavailable. Some features may be limited.');
      } else if (event === 'connected') {
        isSocketAvailable = true;
      }
    });
    
    return socket;
  } catch (error) {
    console.error('Failed to initialize WebSocket:', error);
    isSocketAvailable = false;
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

export function isWebSocketAvailable() {
  return isSocketAvailable;
}

// Initialize socket when this module is imported
let socketInitialized = false;
window.addEventListener('load', () => {
  if (!socketInitialized) {
    socketInitialized = true;
    setTimeout(() => initSocket(), 1000); // Delay initialization to ensure the page is fully loaded
  }
});

export default {
  initSocket,
  addSocketListener,
  removeSocketListener,
  isWebSocketAvailable
};
