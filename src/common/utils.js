export function _isProtos (obj, proterty) {
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
