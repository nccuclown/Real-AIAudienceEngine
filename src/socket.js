
// socket.js
import WebSocketClient from './WebSocketClient';

let socket = null;
const listeners = [];
let isSocketAvailable = false;
let socketInitialized = false;

// 檢查環境是否支持 WebSocket
const isWebSocketSupported = () => {
  return typeof WebSocket !== 'undefined';
};

export function initSocket() {
  if (socket) return socket;
  
  if (!isWebSocketSupported()) {
    console.log('WebSocket not supported in this environment');
    isSocketAvailable = false;
    return null;
  }
  
  try {
    socket = new WebSocketClient();
    
    socket.addListener((event, data) => {
      if (event === 'message') {
        listeners.forEach(listener => listener(data));
      } else if (event === 'unavailable') {
        isSocketAvailable = false;
        console.log('WebSocket is unavailable. Application will continue without real-time updates.');
      } else if (event === 'connected') {
        isSocketAvailable = true;
        console.log('WebSocket is available. Real-time updates are enabled.');
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

// 導出一個函數，只有在明確調用時才初始化WebSocket
export function ensureSocketInitialized() {
  if (!socketInitialized) {
    socketInitialized = true;
    try {
      const ws = initSocket();
      isSocketAvailable = !!ws;
    } catch (error) {
      console.log('WebSocket initialization skipped, will continue without real-time updates');
      isSocketAvailable = false;
    }
  }
  return isSocketAvailable;
}

// 不再自動初始化
// 如果應用不依賴 WebSocket 功能也能運行，可以完全禁用它
export function disableWebSocket() {
  if (socket) {
    socket.disable();
  }
  isSocketAvailable = false;
}

export default {
  initSocket,
  addSocketListener,
  removeSocketListener,
  isWebSocketAvailable,
  ensureSocketInitialized,
  disableWebSocket
};
