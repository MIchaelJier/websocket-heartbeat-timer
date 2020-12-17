/* eslint-disable no-useless-constructor */
import WsHeartbeat from './index_normal'
import WwHeartbeat from './index_worker'
import { websocketHeartbeatOpts } from './types'

class Ws {
  private constructor() {}
  private static _instance: Ws | null = null

  public static setOut(otps: websocketHeartbeatOpts): Ws {
    if (!this._instance) {
      this._instance = otps.webworker ? WwHeartbeat(otps) : WsHeartbeat(otps)
    }
    return this._instance
  }
}

export default (otps: websocketHeartbeatOpts): Ws => Ws.setOut(otps)
