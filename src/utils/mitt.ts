import mitt, { Emitter } from "mitt";

type Events = {
  sendMessage?: object;
  getHistory?: object;
};

const emitter: Emitter<Events> = mitt<Events>();

export default emitter;
