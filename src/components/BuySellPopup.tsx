import React, { useState, ChangeEventHandler, useEffect, useContext } from 'react';
import { PopupProps, Popup } from './Popup';
import { Stock, StockSymbol } from '../models/stock';
import { AppStateContext } from '../AppState';
import { TransactionSide } from '../models/transaction';
import api from '../services/api';

export const BuySellPopup: React.FC<PopupProps & {
    operation: 'buy' | 'sell',
    stock: Stock
}> = (props) => {
    const { state, dispatch } = useContext(AppStateContext);
    const { stock, operation, children, ...popupProps } = props;

    const label = {
        buy: 'Buy',
        sell: 'Sell'
    }[operation];

    const sideByOperation: Record<typeof operation, TransactionSide> = {
        buy: 'BUY',
        sell: 'SELL'
    };

    const side = sideByOperation[operation];

    const ownedAmount = state.allocationBySymbol?.[stock.symbol];

    const [amount, setAmount] = useState(0);

    const disabled = !(stock && amount > 0);

    useEffect(() => {
        if (ownedAmount && amount > ownedAmount)
            setAmount(ownedAmount)
    }, [ownedAmount, amount])

    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
        let newAmount = Math.max(0, e.target.valueAsNumber);
        if (operation === 'sell' && typeof ownedAmount !== 'undefined')
            newAmount = Math.min(newAmount, ownedAmount);
        setAmount(newAmount);
    }

    const handleClick = () => {
        addTransaction(stock.symbol, amount, side);
        popupProps.setVisible(false);
    };

    async function addTransaction(symbol: StockSymbol, amount: number, side: TransactionSide) {
        const result = await api.postTransaction({ symbol, amount, side });
        dispatch({ type: 'setAllocations', allocations: result.allocations });
        dispatch({ type: 'addTransaction', transaction: result.transaction });
    }

    return (
        <Popup {...popupProps}>
            <h2 className="modal__h2">{label} stock</h2>

            {stock.name}

            <input
                className="modal__number-box"
                type="number"
                name="quantity"
                placeholder="enter amount"
                min="0"
                max={ownedAmount}
                value={amount}
                onChange={handleChange}
            />

            <button className="modal__btn" disabled={disabled} onClick={handleClick}>
                {label}
            </button>
        </Popup>
    );
}
