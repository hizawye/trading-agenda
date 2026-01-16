import * as Sentry from 'sentry-expo';

const logger = {
  info: __DEV__ ? console.log : () => {},
  error: (msg: string, err?: Error) => {
    if (__DEV__) {
      console.error(msg, err);
    }
    if (Sentry.Native) {
      Sentry.Native.captureException(err || new Error(msg));
    }
  },
};

export default logger;
