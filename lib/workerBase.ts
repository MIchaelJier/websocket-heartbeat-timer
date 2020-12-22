/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */

import WebsocketHeartbeat from './websocketHeartbeat'
let ws: WebsocketHeartbeat | null = null
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type WebsocketHeartbeatPropName = keyof Omit<
  WebsocketHeartbeat,
  'opts' | 'uuid' | 'ua'
>
const publicHooks: Array<WebsocketHeartbeatPropName> = [
  'onClose',
  'onError',
  'onOpen',
  'onStart',
  'onStop',
  'onReconnect',
]

self.addEventListener(
  'message',
  function (e) {
    const { cmd, msg } = e.data
    console.log(cmd, msg)
    switch (cmd) {
      case 'init':
        // eslint-disable-next-line no-case-declarations
        ws = new WebsocketHeartbeat(msg)
        publicHooks.forEach((item) => {
          // eslint-disable-next-line prettier/prettier
          (ws as WebsocketHeartbeat)[item] = function () {
            self.postMessage({ name: item })
          }
        })

        ws.onMessage = function (event) {
          self.postMessage({ name: 'onMessage', data: event.data })
        }
        break
      case 'start':
      case 'stop':
      case 'send':
      case 'close':
      case 'createWebSocket':
      case 'reconnect':
        if (!ws) return
        // eslint-disable-next-line prettier/prettier
        ws[cmd as WebsocketHeartbeatPropName](msg)
        break
      case 'uuid':
        if (!ws) return
        ws.uuid = msg
        break
      case 'ua':
        if (!ws) return
        ws.ua = msg
        break
      case 'userInfo':
        if (!ws) return
        // ws.opts.userInfo =
        Object.assign(ws.opts.userInfo, msg)
        break
      default:
        break
    }
  },
  false
)
