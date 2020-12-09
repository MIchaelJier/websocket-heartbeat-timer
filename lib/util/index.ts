/* eslint-disable no-undef */
export function getUUID(): string {
  let d: number = new Date().getTime()
  if (
    (window as any).performance &&
    typeof (window as any).performance.now === 'function'
  ) {
    d += (performance as any).now()
  }
  const uuid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  return uuid
}
