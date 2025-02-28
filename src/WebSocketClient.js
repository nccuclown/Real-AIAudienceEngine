
// WebSocketClient.js
export default class WebSocketClient {
  constructor(url = null) {
    this.url = url || `ws://${window.location.hostname}:3000/ws`;
    this.socket = null;
    this.listeners = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.connect();
  }

  connect() {
    try {
      console.log(`Connecting to WebSocket at ${this.url}`);
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
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
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyListeners('error', error);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.attemptReconnect();
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), 3000);
    } else {
      console.error('Max reconnect attempts reached. Giving up.');
    }
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    console.error('Cannot send message - WebSocket is not connected');
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
}
