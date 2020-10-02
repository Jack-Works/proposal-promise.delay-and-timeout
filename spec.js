console.warn(`This is an experimental implementation of the Promise.delay and Promise.timeout proposal (https://github.com/Jack-Works/proposal-promise.delay-and-timeout) of ECMAScript.
It _will_ be changed if the specification has changed.
It should only be used to collect developers feedback about the APIs.`)
{
    const currentRealm = globalThis
    const { TypeError, setTimeout } = currentRealm
    const Call = Reflect.apply
    const { isNaN } = Number
    const NewPromiseCapability = (C) => {
        if (typeof C !== 'function') throw new TypeError()
        let promise, resolve, reject
        promise = new C((r, j) => {
            if (resolve !== undefined) throw new TypeError()
            if (reject !== undefined) throw new TypeError()
            resolve = r
            reject = j
        })
        if (typeof resolve !== 'function') throw new TypeError()
        if (typeof reject !== 'function') throw new TypeError()
        return { promise, resolve, reject }
    }
    // This is a host hook, not in the spec.
    const HostEnqueuePromiseJob = (job, realm, afterTime) => {
        if (typeof afterTime !== 'number') throw new TypeError('afterTime must be a number')
        if (isNaN(afterTime)) throw new TypeError('afterTime must not be NaN')
        if (afterTime < 0) throw new TypeError('afterTime must be greater or equal than 0')
        Call(setTimeout, realm, { __proto__: null, length: 2, 0: job, 1: afterTime })
    }
    if (!Promise.delay) {
        Promise.delay = function (afterTime) {
            const C = this
            const { promise, reject, resolve } = NewPromiseCapability(C)
            const job = () => resolve()
            try {
                HostEnqueuePromiseJob(job, currentRealm, afterTime)
            } catch (e) {
                reject(e)
            }
            return promise
        }
    }
    if (!Promise.timeout) {
        Promise.timeout = function (wrapPromise, afterTime) {
            const C = this
            const { promise, reject, resolve } = NewPromiseCapability(C)
            const job = () => reject()
            try {
                HostEnqueuePromiseJob(job, currentRealm, afterTime)
                wrapPromise.then(resolve, reject)
            } catch (e) {
                reject(e)
            }
            return promise
        }
    }
}
