export const log = (msg: string) => {
  // Có thể tích hợp winston/morgan tuỳ nhu cầu
  console.log(`[LOG]: ${msg}`);
};