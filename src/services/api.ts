import { UserData, Allocation } from "../models/user";
import { Stock, StockSymbol } from "../models/stock";
import {
  Transaction,
  TransactionRequest,
  TransactionResponse,
} from "../models/transaction";

export const API_BASE_URL = "https://demomocktradingserver.azurewebsites.net";
export const WS_URL = API_BASE_URL.replace(/^https:/, "wss:");

const userId = "marcin.wisnicki";
const commonHeaders = {
  "Content-Type": "application/json",
  userid: userId,
};
const commonOptions = {
  headers: commonHeaders,
};

export async function apiGet<T>(path: string) {
  const resp = await fetch(`${API_BASE_URL}/${path}`, commonOptions);
  const json = await resp.json();
  return json as T;
}

export async function apiPost<T>(path: string, payload: any) {
  const resp = await fetch(`${API_BASE_URL}/${path}`, {
    ...commonOptions,
    method: "POST",
    body: JSON.stringify(payload),
  });
  const json = await resp.json();
  return json as T;
}

export default {
  getUserData: () => apiGet<UserData>("/userdata"),
  getAllocations: () => apiGet<Allocation[]>("/userdata/allocations"),
  postWatch: (data: { symbol: StockSymbol; action: "ADD" | "REMOVE" }) =>
    apiPost("/userdata/watchlist", data),
  getStocks: () => apiGet<Stock[]>("/stocks"),
  getTransactions: () => apiGet<Transaction[]>("/transactions"),
  postTransaction: (data: TransactionRequest) =>
    apiPost<TransactionResponse>("/transactions", data),
};