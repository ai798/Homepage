import emitter from "@/utils/mitt";
import { currentItem, editable } from "./chatList.vue";

export const handleOpenHistory = (item: any) => {
currentItem.value = item;
if (editable.value) return;
emitter.emit("getHistory", item);
emitter.emit("stopChat");
};
