export function toNumber(value: unknown): number {
  return Number(value ?? 0);
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function createOrderNo(prefix = 'UM'): string {
  const random = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0');
  return `${prefix}${Date.now()}${random}`;
}

export function createPaymentNo(prefix = 'PAY'): string {
  const random = Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0');
  return `${prefix}${Date.now()}${random}`;
}
