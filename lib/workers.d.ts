/* eslint-disable no-undef */
declare module 'web-worker:*' {
  const WorkerFactory: new () => Worker
  export default WorkerFactory
}
