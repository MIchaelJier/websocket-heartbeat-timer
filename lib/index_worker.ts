/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable prettier/prettier */

import WorkerWebsocketHeartbeat from './worker'
import { websocketHeartbeatOpts } from './types'

class WsHeartbeat extends WorkerWebsocketHeartbeat {
  private constructor(
    stringUrl: string | URL,
    options?: websocketHeartbeatOpts | undefined
  ) {
    super(stringUrl, options)
  }

  private static _instance: WsHeartbeat | null = null

  public static set(otps: websocketHeartbeatOpts): WsHeartbeat {
    if (!this._instance) {
      this._instance = WsHeartbeat.getWorker(this.create, otps)
    }
    return this._instance
  }

}

export default (otps: websocketHeartbeatOpts): WsHeartbeat => {
  const worker = WsHeartbeat.set(otps)
  worker.onmessage = function (event) {
    event.data.name && (<any>worker)[event.data.name](event.data)
  }
  return worker
}
