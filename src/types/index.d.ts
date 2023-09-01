declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

declare type EmitFn = (event: any, ...args: any[]) => void;

declare type Recordable<T = any> = Record<string, T>;

declare type Nullable<T> = T | null | undefined;
