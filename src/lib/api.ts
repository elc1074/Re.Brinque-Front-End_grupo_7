import axios from "axios";

const URL_API = process.env.NEXT_PUBLIC_API_URL;

// Função para obter o token dos cookies
export function getTokenFromCookies(): string | undefined {
	if (typeof document !== "undefined") {
		const match = document.cookie.match(/token=([^;]+)/);
		return match ? match[1] : undefined;
	}
	return undefined;
}

// Instância do axios com header Authorization
export const api = axios.create({
	baseURL: URL_API,
});

export function setAuthHeader(token?: string) {
	if (token) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.common["Authorization"];
	}
}
