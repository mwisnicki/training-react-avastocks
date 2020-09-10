import { groupBy1 } from "../utils";

export interface UserData {
  userId: string;
  liquidity: number;
  allocations: Allocation[];
  watchList: WatchlistEntry[];
}

export interface Allocation {
  symbol: string;
  amount: number;
}

export interface WatchlistEntry {
  symbol: string;
}

export function allocationsToLookup(allocations: Allocation[]) {
  return groupBy1(
    allocations,
    (a) => a.symbol,
    (a) => a.amount
  );
}
