# Promise.delay and Promise.timeout

[Spec](https://jack-works.github.io/proposal-promise.delay-and-timeout/)

[Playground](https://jack-works.github.io/proposal-promise.delay-and-timeout/playground.html)

## API

```ts
interface PromiseConstructor {
    delay(afterTime: unknown): Promise<void>
    timeout<T>(warpPromise: PromiseLike<T>, afterTime: unknown): Promise<T>
}
```
