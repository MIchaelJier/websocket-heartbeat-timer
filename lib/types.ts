export interface userInfo {
  [propName: string]: string
}

export interface websocketHeartbeatOpts {
  url: string
  pingTimeout: number
  pongTimeout: number
  reconnectTimeout: number
  pingMsg: string
  manualStart: boolean
  userInfo: userInfo
  repeatLimit?: number
}

// eslint-disable-next-line no-undef
export type myWebsocket = WebSocket | null
