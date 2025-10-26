const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NUMERIC = "0123456789_-";
const CHARS = ALPHA + NUMERIC;

export function readRecentPayments() {
  return ["이것은 최근 결제 자료 (최대)3건입니다."];
}

export default function getOrderIdPrefix(length) {
  // Use crypto.getRandomValues for better security in browsers
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  let result = '';

  // 첫 문자는 알파벳에서 임의 선택
  const randomIndex = array[0] % ALPHA.length;
  result += ALPHA.charAt(randomIndex);

  for (let i = 1; i < length; i++) {
    const randomIndex = array[i] % CHARS.length;
    result += CHARS.charAt(randomIndex);
  }
  return result;
}