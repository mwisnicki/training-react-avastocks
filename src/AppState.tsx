import { StockSymbol, Stock } from "./models/stock";
import React, { Dispatch, useReducer } from "react";
import { Transaction } from "./models/transaction";
import { Allocation, allocationsToLookup, UserData } from "./models/user";

export default interface AppState {
  selectedSymbol?: StockSymbol;
  stocks?: Stock[];
  watchList?: Allocation[];
  userData?: UserData;
  allocationBySymbol?: Record<StockSymbol, number>,
  transactions?: Transaction[];
}

export const initialState: AppState = {
  // TODO how to deal with lazy state?
};

export type Action =
  | { type: "setSelectedSymbol"; symbol: StockSymbol }
  | { type: "setStocks"; stocks: Stock[] }
  | { type: "setAllocations"; allocations: Allocation[] }
  | { type: "setUserData", userData: UserData }
  | { type: "addWatchListEntry", symbol: StockSymbol }
  | { type: "removeWatchListEntry", symbol: StockSymbol }
  | { type: "addTransaction"; transaction: Transaction }
  | { type: "setTransactions"; transactions: Transaction[] }
  ;

export function appStateReducer(state: AppState, action: Action): AppState {
  console.log('appStateReducer', action, state);
  switch (action.type) {
    case "setSelectedSymbol": {
      return { ...state, selectedSymbol: action.symbol };
    }
    case "setStocks": {
      const { stocks } = action;
      let { selectedSymbol } = state;
      if (!selectedSymbol && stocks?.length > 0)
        selectedSymbol = stocks[0].symbol;
      return { ...state, stocks, selectedSymbol };
    }
    case "setUserData": {
      const { userData } = action;
      const allocationBySymbol = allocationsToLookup(userData.allocations);
      const watchList = userData.watchList.map((w) => ({
        ...w,
        amount: allocationBySymbol[w.symbol],
      }))
      return { ...state, allocationBySymbol, userData, watchList };
    }
    case "addWatchListEntry": {
      const { symbol } = action;
      let { userData, watchList } = state;
      if (userData) {
        userData = { ...userData, watchList: [...userData.watchList, { symbol }] }
        watchList = userData.watchList.map((w) => ({
          ...w,
          amount: state.allocationBySymbol?.[w.symbol] || -1,
        }))
      }
      return { ...state, userData, watchList };
    }
    case "removeWatchListEntry": {
      const { symbol } = action;
      let { userData, watchList } = state;
      if (userData && watchList) {
        userData = { ...userData, watchList: userData.watchList.filter(e => e.symbol !== symbol) }
        watchList = watchList.filter(e => e.symbol !== symbol)
      }
      return { ...state, userData, watchList };
    }
    case "setAllocations": {
      const allocationBySymbol = allocationsToLookup(action.allocations);
      let { userData, watchList } = state;
      if (userData) {
        userData = { ...userData, allocations: action.allocations }
        watchList = userData.watchList.map((w) => ({
          ...w,
          amount: allocationBySymbol[w.symbol],
        }))
      }
      return { ...state, allocationBySymbol, userData, watchList };
    }
    case "addTransaction":
      return {
        ...state,
        transactions: [...state.transactions || [], action.transaction],
      };
    case "setTransactions":
      return {
        ...state,
        transactions: action.transactions
      };
    default:
      console.warn("unknown action:", action);
      return state;
  }
}

export const AppStateContext = React.createContext<{
  state: AppState,
  dispatch: Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null
});
export const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}
