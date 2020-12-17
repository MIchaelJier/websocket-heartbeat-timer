/* eslint-disable no-useless-constructor */
import websocketHeartbeat from './websocketHeartbeat'
import { websocketHeartbeatOpts, userInfo } from './types'
import { getUUID } from './util/index'

class WsHeartbeat extends websocketHeartbeat {
  private constructor(otps: websocketHeartbeatOpts) {
    super(otps)
  }
  private static _instance: WsHeartbeat | null = null
  public static getUUID(): string {
    return getUUID()
  }

  public static set(otps: websocketHeartbeatOpts): WsHeartbeat {
    if (!this._instance) {
      this._instance = new WsHeartbeat(otps)
    }
    return this._instance
  }

  public useIt(useType: string, info?: userInfo): WsHeartbeat | null {
    switch (useType) {
      case 'uuid':
        this.uuid = getUUID()
        return this
      case 'userInfo':
        Object.assign(this.opts.userInfo, info)
        return this
      default:
        throw new Error(`can't find type ${useType}`)
    }
  }
}

export default (otps: websocketHeartbeatOpts): WsHeartbeat =>
  WsHeartbeat.set(otps)
