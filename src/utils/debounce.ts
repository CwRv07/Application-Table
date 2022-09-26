export default function debounce(
  fn: any,
  delay: number,
  options: Record<string, any> = { callback: null, immediate: false }
) {
  // 记录定时器
  let timer: any = null
  // 记录当前执行状态
  let isInvoke = false
  // 记录上一次参数
  let lastArgs: any = null

  const _debounce = function (...args: any[]) {
    // 清除上一次定时器
    if (options.callback) {
      if (options.callback(lastArgs, args) && timer) {
        clearTimeout(timer)
      }
    } else {
      if (timer) clearTimeout(timer)
    }

    lastArgs = args
    if (!isInvoke && options.immediate) {
      // 开始立即实行
      fn.apply(window, args)
      isInvoke = true
    } else {
      // 延迟执行
      timer = setTimeout(() => {
        fn.apply(window, args)
        isInvoke = false
        timer = null
      }, delay)
    }
  }

  // 取消抖动功能
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer)
    isInvoke = false
    timer = null
  }

  return _debounce
}
