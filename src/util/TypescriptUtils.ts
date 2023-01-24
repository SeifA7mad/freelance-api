export const InferKeys = <T>(et: { [K in keyof T]: any }) => et;

export type Modify<T, R> = Omit<T, keyof R> & R;
