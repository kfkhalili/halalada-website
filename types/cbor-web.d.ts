declare module "cbor-web" {
  const decodeFirst: (buffer: ArrayBuffer) => Promise<any>;
  const encode: (data: any) => ArrayBuffer;
  export { decodeFirst, encode };
}
