export type AnyFunc = <T = unknown, R = unknown>(args?: T) => R | void;

export default class EventBus {
  private readonly listeners: { [key: string]: AnyFunc[] };
  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: AnyFunc): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: AnyFunc): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
  }

  emit(event: string, ...args: any): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event].forEach(function (listener) {
      listener(...args);
    });
  }
}
