import { Stock, StockSymbol } from "../models/stock";
import React, {
  useState,
  useEffect,
  FunctionComponent,
  useContext,
} from "react";
import { apiGet } from "./api";

// TODO what's the best way to provide singleton with async values?

function dataProvider<T>(path: string, defaultValue: T): [FunctionComponent<{}>, () => T, React.Context<T>] {

  const AContext = React.createContext<T>(defaultValue);

  const ADataProvider: FunctionComponent<{}> = ({ children }) => {
    const [value, setValue] = useState<T>(defaultValue);
    useEffect(() => {
      apiGet<T>(path).then(setValue);
    }, []);
    return (
      <AContext.Provider value={value}>{children}</AContext.Provider>
    );
  };

  ADataProvider.displayName = `DataProvider ${path}`

  function useAProvider() {
    return useContext(AContext);
  }

  useAProvider.displayName = `DataProvider ${path}`

  return [ADataProvider, useAProvider, AContext];
}


export const [StocksProvider, useStocks] = dataProvider<Stock[]>('/stocks', []);

// Probably not a good idea

export function useStock(symbol: StockSymbol) {
  const stocks = useStocks();
  return stocks.find(s => s.symbol === symbol);
}
