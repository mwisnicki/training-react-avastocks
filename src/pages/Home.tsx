import React, { useEffect, useState } from 'react';
import FollowStocks from '../components/FollowStocks';
import StockGraph from '../components/StockGraph';
import TransactionGrid from '../components/TransactionGrid';
import { StocksProvider } from '../services/dataProviders';
import { Transaction } from '../models/transaction';
import api from '../services/api';


function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.getTransactions().then(setTransactions);
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
