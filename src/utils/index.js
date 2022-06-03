const shrinkString = (originStr, maxChars = 15, trailingCharCount = 3) => {
  let shrinkedStr = originStr;
  const shrinkedLength = maxChars - trailingCharCount - 3;
  if (originStr.length > shrinkedLength) {
    const front = originStr.substr(0, shrinkedLength);
    const mid = '...';
    const end = originStr.substr(-trailingCharCount);
    shrinkedStr = front + mid + end;
  }
  return shrinkedStr;
}

exports.shrinkString = shrinkString;