import React, { useEffect, useState } from 'react';
import FollowStocks from '../components/FollowStocks';
import StockGraph from '../components/StockGraph';
import TransactionGrid from '../components/TransactionGrid';
import { StocksProvider } from '../services/StocksService';
import { apiGet } from '../services/common';
import { Transaction } from '../models/transaction';


function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        apiGet<Transaction[]>('/transactions').then(setTransactions);
    }, [])

    return (
        <StocksProvider>
            <React.Fragment>
                <FollowStocks setTransactions={setTransactions} />
                <StockGraph />
                <TransactionGrid transactions={transactions} />
            </React.Fragment>
        </StocksProvider>
    );
}

export default Home;
