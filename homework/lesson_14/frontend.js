const addMessageOnSite = (message) => {
  const messagesListEl = document.querySelector('.messages');
  const messageEl = document.createElement('li');
  messageEl.innerHTML = message;
  messagesListEl.appendChild(messageEl);
};

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
};

window.onload = async () => {
  let notification;
  let status = false;
  const worker = new Worker('./service-worker.js');

  await requestNotificationPermission();

  const toggleStatus = () => {
    status = !status;
    const statusEl = document.querySelector('.status');
    statusEl.innerHTML = status ? 'On' : 'Off';
    worker.postMessage({ type: status ? 'start' : 'stop' });
  };

  document.querySelector('button').addEventListener('click', toggleStatus);

  worker.addEventListener('message', (event) => {
    if (event.data.type === 'message') {
      const message = event.data.payload;
      console.info(message);

      addMessageOnSite(message);

      if (notification) notification.close();

      notification = new Notification(message);
    }
  });

  // Init messaging
  toggleStatus(true);
};