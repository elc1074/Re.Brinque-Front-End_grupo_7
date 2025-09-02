export default interface ICadastro {
    nome_completo: string;
    email: string;
    senha: string;
    telefone: string;
    confirmPassword?: string;
}

export interface ICadastroResponse {
    message?: string;
    error?: string;
}