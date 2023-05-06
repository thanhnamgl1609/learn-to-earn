type ILoggerOptions = {
  method: 'log' | 'error';
};

type ILogger = {
  (msg: any, options?: ILoggerOptions): void;
};

const defaultOptions: ILoggerOptions = {
  method: 'log',
};

export const logger: ILogger = (msg, { method } = defaultOptions) => {
  if (process.env.NODE_ENV !== 'production') {
    console[method](msg);
  }
};
