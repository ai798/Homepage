import mitt, { Emitter } from "mitt";

type Events = {
  sendMessage?: object;
  getHistory?: object;
  openNewChat?: any;
  refreshList?: any;
  stopReceive?: boolean;
  stopChat?: boolean;
};

const emitter: Emitter<Events> = mitt<Events>();

export default emitter;
