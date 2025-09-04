import ILogin from "@/interface/ILogin";
import { useMutation } from "@tanstack/react-query";

const URL_API = process.env.NEXT_PUBLIC_API_URL;

async function loginRequest(data: ILogin): Promise<any> {
	try {
		const response = await fetch(`${URL_API}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			return await response.json();
		} else {
			const error = await response.text();
			return { error };
		}
	} catch (error: any) {
		return { error: error.message };
	}
}

export function useLogin() {
	const mutation = useMutation<any, Error, ILogin>({
		mutationFn: loginRequest,
	});

	return {
		login: mutation.mutateAsync,
		isPending: mutation.status === "pending",
		isSuccess: mutation.status === "success",
		isError: mutation.status === "error",
		error: mutation.error,
		data: mutation.data,
	};
}
