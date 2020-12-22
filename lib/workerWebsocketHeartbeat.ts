/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
import workerBase from 'web-worker:./workerBase.ts'
import {
  websocketHeartbeatOpts,
  websocketHeartbeatOptsInit,
  userInfo,
} from './types'
import { getUUID } from './util/index'

class WorkerWebsocketHeartbeat extends workerBase {
  constructor(opts: websocketHeartbeatOpts) {
    super()
    this.postMessage({ cmd: 'init', msg: opts })
    this.opts = opts
    // eslint-disable-next-line semi-style
    ;['start', 'stop', 'send', 'close', 'createWebSocket', 'reconnect'].forEach(
      (cmd) => {
        // eslint-disable-next-line prettier/prettier
        (<any> this)[cmd] = function (msg: string) {
          this.postMessage({ cmd, msg })
        }
      }
    )
  }

  public opts: websocketHeartbeatOpts | undefined = websocketHeartbeatOptsInit

  public onClose = (): void => {}
  public onError = (): void => {}
  public onOpen = (): void => {}
  public onStart = (): void => {}
  public onStop = (): void => {}
  // WebSocket.onmessage 属性是一个当收到来自服务器的消息时被调用的 EventHandler
  public onMessage = (event: any): void => {}
  public onReconnect = (): void => {}
  public useIt = (
    useType: string,
    msg?: userInfo
  ): WorkerWebsocketHeartbeat | null => {
    switch (useType) {
      case 'uuid':
        this.postMessage({
          cmd: 'uuid',
          msg: getUUID(),
        })
        return this
      case 'ua':
        this.postMessage({
          cmd: 'ua',
          msg: navigator ? navigator.userAgent || '' : '',
        })
        return this
      case 'userInfo':
        this.postMessage({ cmd: 'userInfo', msg })
        return this
      default:
        throw new Error(`can't find type ${useType}`)
    }
  }
}

export default WorkerWebsocketHeartbeat
