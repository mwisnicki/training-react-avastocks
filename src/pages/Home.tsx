import React from 'react';
import FollowStocks from '../components/FollowStocks';
import StockGraph from '../components/StockGraph';
import TransactionGrid from '../components/TransactionGrid';
import { StocksProvider } from '../services/StocksService';


function Home() {
    return (
        <StocksProvider>
            <React.Fragment>
                <FollowStocks />
                <StockGraph />
                <TransactionGrid />
            </React.Fragment>
        </StocksProvider>
    );
}

export default Home;
