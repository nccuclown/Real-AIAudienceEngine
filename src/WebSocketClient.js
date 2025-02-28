
// WebSocketClient.js
export default class WebSocketClient {
  constructor(url = null) {
    // 使用窗口位置來構建 WebSocket URL
    this.url = url || this.getWebSocketUrl();
    this.socket = null;
    this.listeners = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3; // 減少重連次數
    this.isConnecting = false;
    this.enabled = true; // 控制是否啟用 WebSocket
    
    // 只有在啟用狀態才連接
    if (this.enabled) {
      this.connect();
    } else {
      console.log('WebSocket is disabled');
      this.notifyListeners('unavailable', null);
    }
  }

  // 從當前窗口位置構建 WebSocket URL
  getWebSocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  connect() {
    if (this.isConnecting || !this.enabled) return;
    
    this.isConnecting = true;
    try {
      console.log(`Connecting to WebSocket at ${this.url}`);
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyListeners('connected', null);
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners('message', data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.notifyListeners('error', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.notifyListeners('disconnected', null);
        this.isConnecting = false;
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyListeners('error', error);
        this.isConnecting = false;
        // 出錯時嘗試重連
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  attemptReconnect() {
    if (!this.enabled) return;
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(2000 * this.reconnectAttempts, 5000);
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay/1000}s...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.log('WebSocket unavailable, continuing without real-time updates.');
      this.notifyListeners('unavailable', null);
    }
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener(event, data);
      }
    });
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
  
  // 禁用 WebSocket
  disable() {
    this.enabled = false;
    this.close();
  }
  
  // 啟用 WebSocket
  enable() {
    if (!this.enabled) {
      this.enabled = true;
      this.connect();
    }
  }
}
