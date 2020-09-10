import React, { useEffect, useState, useContext } from 'react';
import StockDetails from './StockDetails';
import FollowStockPopup from './FollowStockPopup';
import api from '../services/api';
import { groupBy1 } from '../utils';
import { AppStateContext } from '../AppState';

function FollowStocks(props: {
}) {
    const { state, dispatch } = useContext(AppStateContext);
    const { watchList = [] } = state;

    const watchListBySymbol = groupBy1(watchList, a => a.symbol);
    const unfollowedStocks = state.stocks?.filter(s => !(s.symbol in watchListBySymbol)) || [];
    const hasMore = unfollowedStocks.length > 0;

    useEffect(() => {
        api.getUserData().then(userData => dispatch({ type: 'setUserData', userData }))
    }, [dispatch]);

    const [followPopupVisible, setFollowPopupVisible] = useState(false);
    const handleAddClick = () => setFollowPopupVisible(true);

    return (
        <section className="stock-list">
            <h2 className="stock-list__title">
                Stocks that I follow
                {hasMore && <a href="#/">
                    <span className="stock-list__btn stock-list__btn--add" onClick={handleAddClick}>+</span>
                </a>}
            </h2>
            <div className="stock-list__grid">
                {watchList.map(watched =>
                    <div className="stock-list__grid-row" key={watched.symbol}>
                        <StockDetails symbol={watched.symbol} />
                    </div>
                )}
            </div>
            <FollowStockPopup unfollowedStocks={unfollowedStocks}
                visible={followPopupVisible} setVisible={setFollowPopupVisible as React.Dispatch<boolean>} />
        </section>
    );
}

export default FollowStocks;
