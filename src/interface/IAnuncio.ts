export default interface IAnuncio {
  usuario_id: number;
  categoria_id: number;
  titulo: string;
  descricao: string;
  marca: string | null;
  endereco_completo?: string | null;
  tipo: "TROCA" | "DOACAO";
  condicao: "NOVO" | "SEMINOVO" | "USADO";
  status: "DISPONIVEL" | "NEGOCIANDO" | "FINALIZADO";
  imagens?: string[] | null;
}

export interface IAnuncioResponse {
  message?: string;
  error?: string;
}