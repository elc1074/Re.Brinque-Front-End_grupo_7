export default interface IAnuncio {
  usuario_id: number;
  titulo: string;
  marca: string | null;
  descricao: string;
  tipo: "TROCA" | "DOACAO";
  condicao: "NOVO" | "USADO";
  categoria_id: number;
  status: "DISPONIVEL" | "NEGOCIANDO" | "FINALIZADO";
  endereco_id: number;
  imagens?: string[];
}

export interface IAnuncioResponse {
  message?: string;
  error?: string;
}