import { Readable } from "stream";

export function bufferToStream(buffer: Buffer) {
  const readable = new Readable();

  // we don't need read since buffer's already in memory
  readable._read = () => {};
  // send the buffer and end the stream(with null)
  readable.push(buffer);
  readable.push(null);

  return readable;
}