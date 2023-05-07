export {};

declare global {
  type ObjectWithSingleTypeFromKeys<Keys = any[], D> = {
    [k in Keys[number]]: D;
  };

  type OmitFromKeyList<S, Keys> = {
    [K in keyof S as Exclude<K, Keys[number]>]: S[K];
  };

  type MergeKeys<S, Keys, ValueDataType> = OmitFromKeyList<S, Keys> & {
    [K in Keys[number]]: ValueDataType;
  };
}
