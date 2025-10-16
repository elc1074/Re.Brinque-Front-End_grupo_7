export interface Conversa {
  id: number;
  anuncio_titulo: string;
  anuncio_id: number;
  ultima_mensagem?: string;
  data_ultima_mensagem?: string;
  data_criacao: string;
  nome_anunciante: string;
}

export interface Mensagem {
  id: number;
  conversa_id: number;
  remetente_id: number;
  conteudo: string;
  data_envio: string;
}
