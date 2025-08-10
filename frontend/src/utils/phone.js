// src/utils/phone.js

export function onlyDigits(value) {
  return (value || '').replace(/\D/g, '');
}

export function formatPhoneBr(value) {
  const digits = onlyDigits(value).slice(0, 11); // limita a 11 dígitos
  if (digits.length <= 10) {
    // Formato fixo (10 dígitos): (XX) XXXX-XXXX
    const d = digits;
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  // Formato celular (11 dígitos): (XX) XXXXX-XXXX
  const d = digits;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function isValidPhoneBr(value) {
  const digits = onlyDigits(value);
  // Aceita 10 (fixo) ou 11 (celular) dígitos e DDD não iniciado por 0
  if (!(digits.length === 10 || digits.length === 11)) return false;
  if (digits[0] === '0' || digits[1] === '0') return false;
  // Se celular (11), o primeiro dígito do número (após DDD) deve ser 9
  if (digits.length === 11 && digits[2] !== '9') return false;
  return true;
}