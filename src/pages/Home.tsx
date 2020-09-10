import React, { useEffect, useContext } from 'react';
import FollowStocks from '../components/FollowStocks';
import StockGraph from '../components/StockGraph';
import TransactionGrid from '../components/TransactionGrid';
import api from '../services/api';
import { AppStateContext } from '../AppState';


function Home() {
    const { state, dispatch } = useContext(AppStateContext);
    const { selectedSymbol } = state;

    useEffect(() => {
        api.getStocks().then(stocks => dispatch({ type: 'setStocks', stocks }));
        api.getTransactions().then(transactions => dispatch({ type: 'setTransactions', transactions }));
    }, [dispatch])

    return (
        <>
            <FollowStocks />
            {selectedSymbol && <StockGraph symbol={selectedSymbol} />}
            <TransactionGrid />
        </>
    );
}

export default Home;
