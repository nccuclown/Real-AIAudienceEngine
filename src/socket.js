
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

// 仅在需要时初始化socket
let socketInitialized = false;

// 导出一个函数，只有在明确调用时才初始化WebSocket
export function ensureSocketInitialized() {
  if (!socketInitialized) {
    socketInitialized = true;
    try {
      initSocket();
    } catch (error) {
      console.log('WebSocket initialization skipped, will continue without real-time updates');
      isSocketAvailable = false;
    }
  }
  return isSocketAvailable;
}

// 不再自动初始化

export default {
  initSocket,
  addSocketListener,
  removeSocketListener,
  isWebSocketAvailable
};
