export type DeepReadonly<T> =
   T extends [infer U]                                    ? DeepReadonlyObject<[U]> :
  T extends [infer U, infer V]                            ? DeepReadonlyObject<[U, V]> :
  T extends [infer U, infer V, infer X]                   ? DeepReadonlyObject<[U, V, X]> :
  T extends [infer U, infer V, infer X, infer Y]          ? DeepReadonlyObject<[U, V, X, Y]> :
  T extends [infer U, infer V, infer X, infer Y, infer Z] ? DeepReadonlyObject<[U, V, X, Y, Z]> :
  T extends (infer U)[]                                   ? DeepReadonlyArray<U> : 
  T extends Function                                      ? T :
   T extends Map<infer U, infer V>                        ? ReadonlyMap<DeepReadonlyObject<U>, DeepReadonlyObject<V>> :
  T extends Set<infer U>                                  ? ReadonlySet<DeepReadonlyObject<U>> :
  T extends object                                        ? DeepReadonlyObject<T> :
  T

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }