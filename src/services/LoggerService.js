const logs = [];

export const LoggerService = {
  log: entry => {
    logs.push({ ...entry, time: new Date().toISOString() });
  },
  getLogs: () => [...logs].reverse(), // show latest first
  clear: () => logs.splice(0, logs.length),
};
