const logger = {
  info: __DEV__ ? console.log : () => {},
  error: (msg: string, err?: Error) => {
    console.error(msg, err);
  },
};

export default logger;
