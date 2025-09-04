type LogEntry = {
  message: string;
  [key: string]: any; // allow additional properties
};

const logs: Array<LogEntry & { time: string }> = [];

export const LoggerService = {
  log: (entry: LogEntry) => {
    logs.push({ ...entry, time: new Date().toISOString() });
  },
  getLogs: (): Array<LogEntry & { time: string }> => [...logs].reverse(), // latest first
  clear: (): void => {
    logs.splice(0, logs.length);
  },
};
