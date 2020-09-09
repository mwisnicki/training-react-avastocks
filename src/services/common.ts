export const API_BASE_URL = "https://demomocktradingserver.azurewebsites.net";

export const WS_URL = API_BASE_URL.replace(/^https:/, "wss:");

const userId = "marcin.wisnicki";

export async function apiGet<T>(path: string) {
  const resp = await fetch(`${API_BASE_URL}/${path}`, {
    headers: {
      "Content-Type": "application/json",
      userid: userId,
    },
  });
  const json = await resp.json();
  return json as T;
}

export async function apiPost<T>(path: string, payload: any) {
  const resp = await fetch(`${API_BASE_URL}/${path}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      userid: userId,
    },
  });
  const json = await resp.json();
  return json as T;
}
