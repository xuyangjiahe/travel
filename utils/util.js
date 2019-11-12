const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const moreLineEllipsis =  (name, len)=> {
  // 多行文字省略
  /**
   * @param {name} 传入字符串；
   * @param {len} 对应字符串需要截取的长度
  */
  console.log(name.length);
  let newNam = name.slice(0, len - 3) + '...';
  return newNam;
}
module.exports = {
  formatTime: formatTime,
  moreLineEllipsis: moreLineEllipsis
}
