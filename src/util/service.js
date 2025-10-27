const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NUMERIC = "0123456789_-";
const CHARS = ALPHA + NUMERIC;

export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}년${month}월${day}일 ${hours}:${minutes}`;
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