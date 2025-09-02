// Função para aplicar máscara ao telefone no formato (99) 99999-9999
export function maskTelefone(value: string): string {
  value = value.replace(/\D/g, "");
  if (value.length > 2) {
    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  }
  if (value.length > 9) {
    value = `${value.slice(0, 10)}-${value.slice(10, 14)}`;
  }
  return value;
}
