'use babel'

export default (promise, timeout) => {
  if (timeout == null) {
    return promise
  }
  return Promise.race([
    promise,
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${timeout} ms`)), timeout)
    })
  ])
}
