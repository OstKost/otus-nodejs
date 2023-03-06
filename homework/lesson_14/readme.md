Option2:  
Создать небольшой WebSocket Server на Node.js  
(Либо на https://www.npmjs.com/package/ws либо с использованием https://www.npmjs.com/package/socket.io). Примечание: Socket.io отличается наличием fallbacks на случай если Web Sockets не работают на данном устройстве  
1) На FE создать index.html c основным скриптом, подключить к нему Web Worker (создать его отдельным файлом), подключить Web Worker к Web Socket Server.   
Примечание: смотрите практическую часть урока, последний час записи для подробностей;  
2) Отправлять нотификации через WS Server через разумный интервал, проверить, что Web Worker получает сообщения от Web Socket Server.  
3) Из Web Worker отправить сообщения на основной скрипт и отображать в виде Web Notifications.  

Материалы:  

Web Sockets:

- https://javascript.info/websocket
- https://www.websocket.org/
- https://aarontgrogg.com/blog/2015/07/20/the-difference-between-service-workers-web-workers-and-websockets/

Web Workers
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers  

Notification API
- https://hackernoon.com/why-and-how-to-implement-web-notification-api-4eb795c5b05d
- https://flaviocopes.com/notifications-api/