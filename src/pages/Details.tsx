import React, { useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import StockDetails from '../components/StockDetails';
import StockGraph from '../components/StockGraph';
import TransactionGrid from '../components/TransactionGrid';
import api from '../services/api';
import { AppStateContext } from '../AppState';

function Details() {
    const { state, dispatch } = useContext(AppStateContext);
    const { symbol: selectedSymbol } = useParams();

    useEffect(() => {
        api.getStocks().then(stocks => dispatch({ type: 'setStocks', stocks }));
        api.getAllocations().then(allocations => dispatch({ type: 'setAllocations', allocations }));
        api.getTransactions().then(transactions => dispatch({ type: 'setTransactions', transactions }));
    }, [dispatch]);

    return (
        <>
            <section className="stock-list">
                <div style={{ display: 'table-row' }} >
                    <StockDetails symbol={selectedSymbol} showUnfollow={false} />
                </div>
            </section>
            <StockGraph symbol={selectedSymbol} showDetailsButton={false} />
            <TransactionGrid filterSymbol={selectedSymbol} />
        </>
    );
}

export default Details;
