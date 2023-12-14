export enum MessageType {
  CONVERSATION = "00",
  REPALY = "10",
  SCRIPT = "70",
  TWITERR = "80",
  TEXT = "90",
}

export const Hidden = [
  MessageType.SCRIPT,
  MessageType.TEXT,
  MessageType.TWITERR,
];
