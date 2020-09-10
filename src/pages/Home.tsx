import React, { useEffect, useState } from 'react';
import FollowStocks from '../components/FollowStocks';
import StockGraph from '../components/StockGraph';
import TransactionGrid from '../components/TransactionGrid';
import { StocksProvider } from '../services/dataProviders';
import { Transaction } from '../models/transaction';
import api from '../services/api';
import { StockSymbol, Stock } from '../models/stock';


function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedSymbol, setSelectedSymbol] = useState<StockSymbol>();

    useEffect(() => {
        api.getTransactions().then(setTransactions);
    }, [])

    const handleStocksLoaded = (stocks: Stock[]) => {
        if (!selectedSymbol && stocks?.length > 0)
            setSelectedSymbol(stocks[0].symbol)
    }

    return (
        <StocksProvider onLoaded={handleStocksLoaded}>
            <FollowStocks setTransactions={setTransactions} onSymbolClicked={setSelectedSymbol} />
            {selectedSymbol && <StockGraph symbol={selectedSymbol} />}
            <TransactionGrid transactions={transactions} />
        </StocksProvider>
    );
}

export default Home;
