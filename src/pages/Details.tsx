import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import StockDetails from '../components/StockDetails';
import StockGraph from '../components/StockGraph';
import TransactionGrid from '../components/TransactionGrid';
import { Transaction } from '../models/transaction';
import api from '../services/api';
import { allocationsToLookup } from '../models/user';
import { StocksProvider } from '../services/dataProviders';

function Details() {
    const { symbol: selectedSymbol } = useParams();

    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.getAllocations().then(as => setAllocations(allocationsToLookup(as)))
    }, []);

    useEffect(() => {
        api.getTransactions().then(setTransactions);
    }, [])

    const amount = allocations[selectedSymbol];

    return (
        <StocksProvider>
            <section className="stock-list">
                <div style={{ display: 'table-row' }} >
                    <StockDetails symbol={selectedSymbol} amount={amount} showUnfollow={false}
                        setTransactions={setTransactions} setAllocations={setAllocations} />
                </div>
            </section>
            <StockGraph symbol={selectedSymbol} showDetailsButton={false} />
            <TransactionGrid transactions={transactions} filterSymbol={selectedSymbol} />
        </StocksProvider>
    );
}

export default Details;
