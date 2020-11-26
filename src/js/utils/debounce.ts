export default (func: <T = unknown, R = unknown>(args?: T) => R | void, wait: number): Function => {
  // export default (func: <T extends unknown[], R = unknown>(...args: T) => R | void, wait: number): Function => {
  let timeout: number | NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(<NodeJS.Timeout>timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
