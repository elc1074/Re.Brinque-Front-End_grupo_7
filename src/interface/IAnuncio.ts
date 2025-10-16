export interface IImagem {
  url_imagem: string;
}


export default interface IAnuncio {
  id?: number;
  usuario_id: number;
  nome_usuario?: string;
  categoria_id: number;
  titulo: string;
  descricao: string;
  marca: string | null;
  endereco_completo?: string | null;
  tipo: "TROCA" | "DOACAO";
  condicao: "NOVO" | "SEMINOVO" | "USADO";
  status: "DISPONIVEL" | "NEGOCIANDO" | "FINALIZADO";
  imagens?: (string | IImagem)[];
}

export interface IAnuncioResponse {
  message?: string;
  error?: string;
}