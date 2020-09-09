import React, { useState, ChangeEventHandler } from 'react';
import { PopupProps, Popup } from './Popup';
import { Stock } from '../models/stock';

export const BuySellPopup: React.FC<PopupProps & {
    operation: 'buy' | 'sell',
    stock: Stock,
    owned?: number,
    onPerform: (stock: Stock, amount: number) => void
}> = (props) => {
    const { stock, operation, owned, children, onPerform, ...popupProps } = props;

    const label = {
        buy: 'Buy',
        sell: 'Sell'
    }[operation];

    const [amount, setAmount] = useState(0);

    const disabled = !(stock && amount > 0);

    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
        let newAmount = Math.max(0, e.target.valueAsNumber);
        if (operation === 'sell' && typeof owned !== 'undefined')
            newAmount = Math.min(newAmount, owned);
        setAmount(newAmount);
    }

    const handleClick = () => {
        onPerform(stock, amount);
        popupProps.setVisible(false);
    };

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
                max="owned"
                value={amount}
                onChange={handleChange}
            />

            <button className="modal__btn" disabled={disabled} onClick={handleClick}>
                {label}
            </button>
        </Popup>
    );
}
