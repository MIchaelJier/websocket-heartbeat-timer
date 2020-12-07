/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-empty-function */
import { websocketHeartbeatOpts, myWebsocket } from './types'

class websocketHeartbeat {
  opts: websocketHeartbeatOpts = {
    url: '',
    pingTimeout: 5000,
    pongTimeout: 5000,
    reconnectTimeout: 2000,
    pingMsg: '',
  }
  ws: myWebsocket = null // WebSocket
  repeat = 0
  pingTimeoutId:any
  pongTimeoutId:any
  lockReconnect = false
  forbidReconnect = false

  constructor(opts: websocketHeartbeatOpts) {
    Object.assign(this.opts, opts)
    this.createWebSocket()
  }
  onclose() {}
  onerror() {}
  onopen() {}
  onmessage(event: any) {}
  onreconnect() {}

  createWebSocket(): void {
    try {
      this.ws = new WebSocket(this.opts.url)
      this.initEventHandle()
    } catch (e) {
      this.reconnect()
      throw e
    }
  }
  initEventHandle(): void {
    (this.ws as WebSocket).onclose = () => {
      this.onclose()
      this.reconnect()
    }
    (this.ws as WebSocket).onerror = () => {
      this.onerror()
      this.reconnect()
    }
    (this.ws as WebSocket).onopen = () => {
      this.repeat = 0
      this.onopen()
      // 心跳检测重置
      this.heartCheck()
    }
    (this.ws as WebSocket).onmessage = (event: any) => {
      this.onmessage(event)
      // 如果获取到消息，心跳检测重置
      // 拿到任何消息都说明当前连接是正常的
      this.heartCheck()
    }
  }
  reconnect(): void {
    if (
      (this.opts.repeatLimit as number) > 0 &&
      (this.opts.repeatLimit as number) <= this.repeat
    ) {
      return
    }
    if (this.lockReconnect || this.forbidReconnect) return
    this.lockReconnect = true
    this.repeat++
    this.onreconnect()
    setTimeout(() => {
      this.createWebSocket()
      this.lockReconnect = false
    }, this.opts.reconnectTimeout)
  }

  close(): void {
    // 如果手动关闭连接，不再重连
    this.forbidReconnect = true
    this.heartReset();
    (this.ws as WebSocket).close()
  }

  heartStart(): void {
    if (this.forbidReconnect) return // 不再重连就不再执行心跳
    this.pingTimeoutId = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage拿到返回的心跳就说明连接正常
      (this.ws as WebSocket).send(this.opts.pingMsg)
      // 如果超过一定时间还没重置，说明后端主动断开了
      this.pongTimeoutId = setTimeout(() => {
        // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        (this.ws as WebSocket).close()
      }, this.opts.pongTimeout)
    }, this.opts.pingTimeout)
  }

  heartCheck(): void {
    this.heartReset()
    this.heartStart()
  }

  heartReset(): void {
    clearTimeout(this.pingTimeoutId)
    clearTimeout(this.pongTimeoutId)
  }

  send(msg: string): void {
    (this.ws as WebSocket).send(msg)
  }
}

if (typeof window !== 'undefined') {
  (window as any).websocketHeartbeat = websocketHeartbeat
}

export default websocketHeartbeat