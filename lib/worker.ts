/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */

// import WebsocketHeartbeat from './websocketHeartbeat'
import {
  websocketHeartbeatOpts,
  websocketHeartbeatOptsInit,
  myWebsocket,
  userInfo,
} from './types'
import { getUUID } from './util/index'

class WorkerWebsocketHeartbeat extends Worker {
  constructor(
    stringUrl: string | URL,
    opts?: websocketHeartbeatOpts | undefined,
    options?: WorkerOptions | undefined
  ) {
    super(stringUrl, options)
    this.opts = opts
  }

  public opts: websocketHeartbeatOpts | undefined = websocketHeartbeatOptsInit

  public onClose(): void {}
  public onError(): void {}
  public onOpen(): void {}
  public onStart(): void {}
  public onStop(): void {}
  // WebSocket.onmessage 属性是一个当收到来自服务器的消息时被调用的 EventHandler
  public onMessage(event: any): void {}
  public onReconnect(): void {}

  public static getWorker(
    worker = function () {},
    param: websocketHeartbeatOpts
  ): WorkerWebsocketHeartbeat {
    const code = worker.toString()
    const blob = new Blob(['(' + code + ')(' + JSON.stringify(param) + ')'])
    // eslint-disable-next-line no-undefined
    return new WorkerWebsocketHeartbeat(URL.createObjectURL(blob), param)
  }

  public static create = function (
    options: websocketHeartbeatOpts = websocketHeartbeatOptsInit
  ): void {
    class WebsocketHeartbeat {
      public opts: websocketHeartbeatOpts = {
        url: '',
        pingTimeout: 5000,
        pongTimeout: 5000,
        reconnectTimeout: 2000,
        pingMsg: '',
        userInfo: {},
        manualStart: false,
      }
      private ws: myWebsocket = null // WebSocket
      private _repeat = 0
      // 前端发送ping消息，后端收到后，需要立刻返回pong消息
      private _pingTimeoutId: NodeJS.Timer | null = null
      private _pongTimeoutId: NodeJS.Timer | null = null
      private _lockReconnect = false
      private _forbidReconnect = false
      public uuid = ''

      private get msg(): string {
        return JSON.stringify({
          msg: this.opts.pingMsg,
          uuid: this.uuid,
          ...this.opts.userInfo,
        })
      }

      constructor(opts: websocketHeartbeatOpts) {
        Object.assign(this.opts, opts)
        if (!this.opts.manualStart) {
          this.createWebSocket()
        }
      }
      public onClose(): void {}
      public onError(): void {}
      public onOpen(): void {}
      public onStart(): void {}
      public onStop(): void {}
      // WebSocket.onmessage 属性是一个当收到来自服务器的消息时被调用的 EventHandler
      public onMessage(event: any): void {}
      public onReconnect(): void {}

      public start(): void {
        this.heartStart(this.onStart)
      }

      public stop(): void {
        this.heartReset(this.onStop)
      }

      public send(msg: string): void {
        if (!this.ws) return
        this.ws.send(
          JSON.stringify({ msg, uuid: this.uuid, ...this.opts.userInfo })
        )
      }

      public close(): void {
        // 如果手动关闭连接，不再重连
        if (!this.ws) return
        this._forbidReconnect = true
        this.heartReset()
        this.onClose()
        this.ws.close()
      }

      public createWebSocket(): void {
        try {
          this.ws = new WebSocket(this.opts.url)
          this.initEventHandle()
          this._forbidReconnect = false
        } catch (e) {
          this.reconnect()
          throw e
        }
      }

      public reconnect(): void {
        if (
          (this.opts.repeatLimit as number) > 0 &&
          (this.opts.repeatLimit as number) <= this._repeat
        ) {
          return
        }
        if (this._lockReconnect || this._forbidReconnect) return
        this._lockReconnect = true
        this._repeat++
        this.onReconnect()
        setTimeout(() => {
          this.createWebSocket()
          this._lockReconnect = false
        }, this.opts.reconnectTimeout)
      }

      private initEventHandle(): void {
        if (!this.ws) return
        this.ws.onclose = () => {
          this.onClose()
          this.reconnect()
        }
        this.ws.onerror = () => {
          this.onError()
          this.reconnect()
        }
        this.ws.onopen = () => {
          this._repeat = 0
          this.onOpen()
          // 心跳检测重置
          this.heartCheck()
        }
        this.ws.onmessage = (event: any) => {
          this.onMessage(event)
          this.heartCheck()
        }
      }

      private heartStart(fn = function () {}): void {
        if (this._forbidReconnect) return // 不再重连就不再执行心跳
        this.heartReset()
        this.ws && !this._forbidReconnect && fn()
        this._pingTimeoutId = setTimeout(() => {
          if (!this.ws) return
          this.ws.send(this.msg)
          this._pongTimeoutId = setTimeout(() => {
            if (!this.ws) return
            this.ws.close()
          }, this.opts.pongTimeout)
        }, this.opts.pingTimeout)
      }

      private heartCheck(): void {
        this.heartReset()
        this.heartStart()
      }

      private heartReset(fn = function () {}): void {
        this.ws && !this._forbidReconnect && fn()
        this._pingTimeoutId && clearTimeout(this._pingTimeoutId)
        this._pongTimeoutId && clearTimeout(this._pongTimeoutId)
      }
    }
    const ws = new WebsocketHeartbeat(options)
    type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
    type WebsocketHeartbeatPropName = keyof Omit<
      WebsocketHeartbeat,
      'opts' | 'uuid'
    >
    const publicHooks: Array<WebsocketHeartbeatPropName> = [
      'onClose',
      'onError',
      'onOpen',
      'onStart',
      'onStop',
      'onReconnect',
    ]
    publicHooks.forEach((item) => {
      // eslint-disable-next-line prettier/prettier
      ws[item] = function () {
        self.postMessage({ name: item })
      }
    })

    ws.onMessage = function (e) {
      self.postMessage({ name: 'onMessage', data: e.data })
    }
    self.addEventListener(
      'message',
      function (e) {
        const { cmd, msg } = e.data
        console.log(cmd, msg)
        switch (cmd) {
          case 'start':
          case 'stop':
          case 'send':
          case 'close':
          case 'createWebSocket':
          case 'reconnect':
            // eslint-disable-next-line prettier/prettier
            ws[cmd as WebsocketHeartbeatPropName](msg)
            break
          case 'uuid':
            ws.uuid = msg
            break
          case 'userInfo':
            // ws.opts.userInfo =
            Object.assign(ws.opts.userInfo, msg)
            break
          default:
            break
        }
      },
      false
    )
  }

  public useIt(
    useType: string,
    msg?: userInfo
  ): WorkerWebsocketHeartbeat | null {
    switch (useType) {
      case 'uuid':
        this.postMessage({
          cmd: 'uuid',
          msg: getUUID(),
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

// eslint-disable-next-line prettier/prettier
['start', 'stop', 'send', 'close', 'createWebSocket', 'reconnect'].forEach(
  (cmd) => {
    // eslint-disable-next-line prettier/prettier
  (<any>WorkerWebsocketHeartbeat).prototype[cmd] = function (msg: string) {
      this.postMessage({ cmd, msg })
    }
  }
)

export default WorkerWebsocketHeartbeat
