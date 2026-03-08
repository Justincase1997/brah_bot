const timers = new Map();

function startTimer(key, delayMs, onExpire) {
  if (timers.has(key)) {
    clearTimeout(timers.get(key));
  }

  const timeoutId = setTimeout(async () => {
    timers.delete(key);
    await onExpire();
  }, delayMs);

  timers.set(key, timeoutId);
}

function cancelTimer(key) {
  if (!timers.has(key)) {
    return false;
  }

  clearTimeout(timers.get(key));
  timers.delete(key);
  return true;
}

module.exports = {
  startTimer,
  cancelTimer
};
