/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { SimpleTicker } from './SimpleTicker';
import { BuySellPopup } from './BuySellPopup';
import { StockSymbol, Stock } from '../models/stock';
import { usePopupState } from './Popup';
import { useStock } from '../services/dataProviders';
import { TransactionSide, Transaction } from '../models/transaction';
import { groupBy1 } from '../utils';
import api from '../services/api';

// TODO is passing initial value in props a good design?

function StockDetails(props: {
    symbol: string,
    amount: number,
    onUnfollow: (symbol: StockSymbol) => void,
    onSymbolClicked: (symbol: StockSymbol) => void,
    setAllocations: (records: Record<string, number>) => void,
    setTransactions: (fn: (oldTransactions: Transaction[]) => Transaction[]) => void
}) {
    const { symbol, amount } = props
    const showUnfollow = true;

    const stock = useStock(symbol);

    const buyPopupState = usePopupState();
    const sellPopupState = usePopupState();

    const handleFollowClick = () => props.onUnfollow(symbol);
    const handleSymbolClicked = () => props.onSymbolClicked(symbol);

    const handleBuy = (stock: Stock, amount: number) => addTransaction(stock.symbol, amount, 'BUY');
    const handleSell = (stock: Stock, amount: number) => addTransaction(stock.symbol, amount, 'SELL');

    async function addTransaction(symbol: StockSymbol, amount: number, side: TransactionSide) {
        const result = await api.postTransaction({ symbol, amount, side });
        const allocationsBySymbol = groupBy1(result.allocations, a => a.symbol, a => a.amount);
        props.setAllocations(allocationsBySymbol)
        props.setTransactions(old => old.concat(result.transaction));
    }

    return (
        <>
            {showUnfollow && <div className="stock-list__grid-cell">
                <a onClick={handleFollowClick}><span className="stock-list__btn stock-list__btn--remove">&ndash;</span></a>
            </div>}
            <div className="stock-list__grid-cell" onClick={handleSymbolClicked}>{symbol}</div>
            <div className="stock-list__grid-cell stock-list__grid-cell--txt-blue wide">
                <SimpleTicker symbol={symbol} />
            </div>
            <div className="stock-list__grid-cell">
                <a onClick={buyPopupState.show}><span className="btn-transaction btn-transaction--buy">buy</span></a>
            </div>

            {amount > 0 && <>
                <div className="stock-list__grid-cell">
                    <a onClick={sellPopupState.show}><span className="btn-transaction btn-transaction--sell">sell</span></a>
                </div>
                <div className="stock-list__grid-cell">{amount}</div>
            </>}

            {stock && <>
                <BuySellPopup stock={stock} operation="buy" onPerform={handleBuy} {...buyPopupState} />
                <BuySellPopup stock={stock} operation="sell" owned={amount} onPerform={handleSell} {...sellPopupState} />
            </>}
        </>
    );
}

export default StockDetails;
