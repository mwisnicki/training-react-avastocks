/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import { SimpleTicker } from './SimpleTicker';
import { BuySellPopup } from './BuySellPopup';
import { StockSymbol } from '../models/stock';
import { usePopupState } from './Popup';
import api from '../services/api';
import { AppStateContext } from '../AppState';

// TODO is passing initial value in props a good design?

function StockDetails(initProps: {
    symbol: string,
    showUnfollow?: boolean
}) {
    const { state, dispatch } = useContext(AppStateContext);

    const props = {
        showUnfollow: true,
        ...initProps
    }
    const { symbol, showUnfollow } = props;

    const amount = state.allocationBySymbol?.[symbol] || -1;
    const stock = state.stocks?.find(s => s.symbol === symbol);

    const buyPopupState = usePopupState();
    const sellPopupState = usePopupState();

    const handleFollowClick = () => unfollow(symbol);
    const handleSymbolClicked = () => dispatch({ type: 'setSelectedSymbol', symbol });

    async function unfollow(symbol: StockSymbol) {
        await api.postWatch({ symbol, action: 'REMOVE' });
        dispatch({ type: 'removeWatchListEntry', symbol });
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
                <BuySellPopup stock={stock} operation="buy" {...buyPopupState} />
                <BuySellPopup stock={stock} operation="sell" {...sellPopupState} />
            </>}
        </>
    );
}

export default StockDetails;
