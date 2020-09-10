import { UserData, Allocation } from "../models/user";
import { Stock, StockSymbol } from "../models/stock";
import {
  Transaction,
  TransactionRequest,
  TransactionResponse,
} from "../models/transaction";

function getenv(key: string): string {
  const value = process.env[key];
  if (typeof value !== "undefined") return value;
  throw new Error(`Required environment variable not found: ${key}`);
}

export const API_BASE_URL: string = getenv("REACT_APP_API_BASE");
export const WS_URL = API_BASE_URL.replace(/^https:/, "wss:");

const userId = getenv("REACT_APP_API_USER");
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
