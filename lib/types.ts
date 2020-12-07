export interface websocketHeartbeatOpts {
  url: string
  pingTimeout: number
  pongTimeout: number
  reconnectTimeout: number
  pingMsg: string
  repeatLimit?: number
}

// eslint-disable-next-line no-undef
export type myWebsocket = WebSocket | null
