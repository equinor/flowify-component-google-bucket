

const LOG_LEVELS = Object.freeze({
  CRITICAL: 1,
  ERROR: 2,
  WARNING: 3,
  INFO: 4,
  DEBUG: 5,
});

const DEFAULT_LOG_LEVEL = LOG_LEVELS.WARNING;

const LOG_LEVEL = Number.parseInt(process.env.LOG_LEVEL) || DEFAULT_LOG_LEVEL;

const noop = () => {};

const makeLogger = level => (...log) => {
  console.log(
      JSON.stringify({
          time: new Date().toISOString(),
          level,
          log,
      })
  );
  if (LOG_LEVELS[level]<3){
      throw new Error(log);
  }
}

export const critical =
  LOG_LEVEL < LOG_LEVELS.CRITICAL ? noop : makeLogger('CRITICAL');

export const error = LOG_LEVEL < LOG_LEVELS.ERROR ? noop : makeLogger('ERROR');

export const warning =
  LOG_LEVEL < LOG_LEVELS.WARNING ? noop : makeLogger('WARNING');

export const info = LOG_LEVEL < LOG_LEVELS.INFO ? noop : makeLogger('INFO');

export const debug = LOG_LEVEL < LOG_LEVELS.DEBUG ? noop : makeLogger('DEBUG');