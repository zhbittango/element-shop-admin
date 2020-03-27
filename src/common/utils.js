export function _isProtos(obj, proterty) {
  var self = []
  var protos = []
  for (var prop in obj) {
    if (Object.hasOwnProperty.call(obj, prop)) {
      self.push(prop)
    } else {
      protos.push(prop)
    }
  }
  console.log('self', self)
  console.log('protos', protos)
  return '原型上是否有该方法：' + protos.includes(proterty)
}

export function debounce(func, delay = 100) {
  // console.log('this', this);
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      // func()
    }, args[0] || delay)
  }
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
