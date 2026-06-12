import { EventEmitter } from "events";

const eventBus = new EventEmitter();

export function subscribe(userID: string, callback: (event: string, data: unknown) => void) {
  const channel = `user:${userID}`;

  const handler = (event: string, data: unknown) => {
    callback(event, data);
  };

  eventBus.on(channel, handler);

  return () => {
    eventBus.off(channel, handler);
  };
}

export function publish(userID: string, event: string, data: unknown) {
  eventBus.emit(`user:${userID}`, event, data);
}

export function setOnline(userID: string) {
  publish(userID, "online", { userID, online: true });
}

export function setOffline(userID: string) {
  publish(userID, "online", { userID, online: false });
}
