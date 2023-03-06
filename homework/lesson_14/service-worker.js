const url = 'ws://localhost:9001';

let socket;

addEventListener('message', (event) => {
  if (event.data.type === 'start') {
    socket = new WebSocket(url);

    socket.addEventListener('message', (event) => {
      postMessage({ type: 'message', payload: event.data });
    });
  }

  if (event.data.type === 'stop') {
    if (socket) {
      socket.close();
    }
  }
});
