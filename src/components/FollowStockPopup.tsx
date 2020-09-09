import React, { useState, ChangeEventHandler, useEffect } from 'react';
import { PopupProps, Popup } from './Popup';
import { Allocation } from '../models/user';
import { groupBy1 } from '../utils';
import { StockSymbol, Stock } from '../models/stock';

const FollowStockPopup: React.FC<PopupProps & {
    watchList: Allocation[],
    unfollowedStocks: Stock[],
    onFollow: (s: StockSymbol) => void
}> = (props) => {
    const { unfollowedStocks } = props;
    const watchListBySymbol = groupBy1(props.watchList, a => a.symbol);

    const [symbol, setSymbol] = useState<StockSymbol | undefined>();

    useEffect(() => {
        const invalidSymbol = !symbol || symbol in watchListBySymbol;
        if (invalidSymbol) {
            if (unfollowedStocks?.length > 0)
                setSymbol(unfollowedStocks[0].symbol);
            else setSymbol(undefined);
        }
    }, [symbol, unfollowedStocks, watchListBySymbol]);

    const handleChange: ChangeEventHandler<HTMLSelectElement> = event => setSymbol(event.target.value)

    const onAddClick = () => {
        if (symbol)
            props.onFollow(symbol);
        props.setVisible(false);
    }

    return (
        <Popup {...props}>
            <h2 className="modal__h2">Select a new stock to follow</h2>
            <select className="modal__dropdown" value={symbol} onChange={handleChange}>
                {unfollowedStocks.map(stock =>
                    <option value={stock.symbol} key={stock.symbol}>{stock.name}</option>
                )}
            </select>
            <button disabled={!symbol} className="modal__btn" onClick={onAddClick}>Add</button>
        </Popup>
    );
}

export default FollowStockPopup;
