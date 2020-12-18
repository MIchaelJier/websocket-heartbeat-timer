# websocket-heartbeat-timer
💓== msg ==>📦

## 安装
```
npm i @gdyfe/wwebsocket-heartbeat-timer --save
yarn add @gdyfe/websocket-heartbeat-timer -D
```
## 使用
```javascript
// script
<script src="./dist/wsHeartbeat.min.js"></script> 
// npm
import websocketHeartbeat from '@gdyfe/websocket-heartbeat-timer'
websocketHeartbeat({ 
  url: url,
  pingTimeout: 1000,
  pongTimeout: 1000,
  manualStart: true,
  repeatLimit: 3,
  userInfo: {
      token: '1234567',
      id: '1234',
  },
  webworker: true
}).useIt('uuid')  
```
## 参数
| 选项名          | 类型                 | 是否必填 | 默认值 | 描述   
| :-------------- | :------------------- | :------- | :----- | :------------- | 
|url           |  string  |  true   |  ''     |  websocket地址  |
|pingTimeout   |  number  |  false  |  5000   |  心跳发送间隔。如果收到任何后端消息，计时器将重置  |
|pongTimeout   |  number  |  false  |  5000   |  ping消息发送后，没有收到后端消息断开连接的时间间隔 |
|pingMsg       |  string  |  false  |  ''     |  ping message 内容  |
|manualStart   |  number  |  false  |  false  |  是否手动开启  |
|repeatLimit   |  number  |  false  |  unlimited      |  重连次数限制  |
|userInfo      |  number  |  false  |  {}     |  userInfo用户信息，{ token: 'xxxxx', id: 'xxxxx', ... } |
|webworker     |  number  |  false  |  false  |  是否开启webworker  |

## hook function and event function
```javascript
// websocket hook
 websocketHeartbeatJs.onOpen = function () { // 连接 }
 websocketHeartbeatJs.onMessage = function (e) {
   // 发送消息
   // e.data = ping message 内容
 }
 websocketHeartbeatJs.onReconnect = function () { // 重连 } 
 websocketHeartbeatJs.onClose = function () { // 关闭 }
 websocketHeartbeatJs.onStart = function () { // 开始 }
 websocketHeartbeatJs.onStop = function () { // 停止 }

// useIt()
 websocketHeartbeatJs.useIt('uuid').useIt('userInfo', {
  token: 'xxxx', 
  id: 'xxxx',
 }) 
```
