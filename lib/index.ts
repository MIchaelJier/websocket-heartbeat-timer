/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import WsHeartbeat from './normal'
import WwHeartbeat from './worker'
import { websocketHeartbeatOpts } from './types'

class Ws {
  // eslint-disable-next-line no-useless-constructor
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
