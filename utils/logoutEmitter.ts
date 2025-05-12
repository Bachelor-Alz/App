import { EventEmitter } from "events";

const logoutEmitter = new EventEmitter();

export const emitLogoutEvent = () => {
  logoutEmitter.emit("logout");
};

export const addLogoutListener = (callback: () => void) => {
  logoutEmitter.addListener("logout", callback);
};

export const removeLogoutListener = (callback: () => void) => {
  logoutEmitter.removeListener("logout", callback);
};
