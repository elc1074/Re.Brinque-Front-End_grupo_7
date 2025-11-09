export async function moderarTexto(texto: string): Promise<boolean> {
  try {
    const response = await fetch("https://back-rebrinque.onrender.com/api/moderar-texto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });

    if (!response.ok) throw new Error("Erro ao comunicar com moderação");

    const data = await response.json();
    return !data.bloqueado; // true se aprovado
  } catch (error) {
    console.error("Erro na moderação:", error);
    return false; // bloqueia por segurança
  }
}