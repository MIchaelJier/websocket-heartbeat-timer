/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
import WebsocketHeartbeat from './websocketHeartbeat'
import { websocketHeartbeatOpts } from './types'

// getWorker
class workerWebsocketHeartbeat {
  private constructor() {}
  private static _instance: Worker | null = null

  private static getWorker(worker = function () {}, param: any) {
    const code = worker.toString()
    const blob = new Blob(['(' + code + ')(' + JSON.stringify(param) + ')'])
    return new Worker(URL.createObjectURL(blob))
  }

  public static set(otps: websocketHeartbeatOpts): Worker {
    return this.getWorker((options: websocketHeartbeatOpts = otps) => {
      const ws = new WebsocketHeartbeat(options)
      self.addEventListener(
        'message',
        function (e) {
          const { cmd, msg } = e.data
          switch (cmd) {
            case 'onclose':
            case 'onerror':
            case 'onopen':
            case 'onstart':
            case 'onstop':
            case 'onmessage':
            case 'onreconnect':
              // msg
              // ws[cmd] = msg
              break
            case 'start':
            case 'stop':
            case 'send':
            case 'close':
            case 'createWebSocket':
            case 'reconnect':
              // ws[cmd](msg)
              break
            default:
              break
          }
        },
        false
      )
    }, otps)
  }
}

export default workerWebsocketHeartbeat
