import WebsocketHeartbeat from './websocketHeartbeat'

export interface userInfo {
  [propName: string]: string
}

export const websocketHeartbeatOptsInit = {
  url: '',
  pingTimeout: 5000,
  pongTimeout: 5000,
  reconnectTimeout: 2000,
  pingMsg: '',
  userInfo: {},
  manualStart: false,
}

export type WebsocketHeartbeatPropName = keyof WebsocketHeartbeat
// export type WebsocketHeartbeatPropName = [propName in keyof WebsocketHeartbeat]

// let arr:Array<string> = WebsocketHeartbeat
// export enum a =

export interface websocketHeartbeatOpts {
  url: string
  pingTimeout: number
  pongTimeout: number
  reconnectTimeout: number
  pingMsg: string
  manualStart: boolean
  userInfo: userInfo
  repeatLimit?: number
  webworker?: boolean
}

// eslint-disable-next-line no-undef
export type myWebsocket = WebSocket | null
