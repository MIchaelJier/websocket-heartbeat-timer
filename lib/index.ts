import websocketHeartbeat from './websocketHeartbeat'
import { websocketHeartbeatOpts } from './types'
import { getUUID } from './util/index'

export default class WsHeartbeat extends websocketHeartbeat {
  static opts: websocketHeartbeatOpts
  static getUUID(): string {
    return getUUID()
  }
  static get _instance(): WsHeartbeat {
    if (!WsHeartbeat._instance) {
      Object.defineProperty(WsHeartbeat, '_instance', {
        value: new WsHeartbeat(this.opts),
      })
    }
    return WsHeartbeat._instance
  }
}
