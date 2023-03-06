import { WebSocketServer } from 'ws';

const PORT = 9001;

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  let pingInterval;

  ws.on('error', (err) => {
    clearInterval(pingInterval);
    console.error(err);
  });

  ws.on('message', (data) => {
    const message = `Server received: ${data}`;
    console.log(message);
  });

  let counter = 0;
  pingInterval = setInterval(() => {
    const message = `Message from server ${++counter}`;
    console.info('DEBUG:', 'server => message', message);
    ws.send(message);
  }, 5000);
});