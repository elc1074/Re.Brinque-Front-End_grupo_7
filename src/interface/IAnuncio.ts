export default interface IAnuncio {
  usuario_id: number;
  categoria_id: number;
  endereco_id: number;
  titulo: string;
  descricao: string;
  tipo: "TROCA" | "DOACAO";
  condicao: "NOVO" | "USADO";
  status: "DISPONIVEL" | "NEGOCIANDO" | "FINALIZADO";
  imagens?: string[];
}

export interface IAnuncioResponse {
  message?: string;
  error?: string;
}