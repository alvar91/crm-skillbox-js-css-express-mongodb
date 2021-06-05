export function debounce(func, evt, ms, timer) {
  if (timer.timerId) {
    clearTimeout(timer.timerId);
  }

  timer.timerId = setTimeout(() => {
    func(evt);
  }, ms);
}
