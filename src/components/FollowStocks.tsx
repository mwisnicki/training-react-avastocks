import React, { useEffect, useState } from 'react';
import StockDetails from './StockDetails';
import FollowStockPopup from './FollowStockPopup';
import api from '../services/api';
import { UserData, Allocation } from '../models/user';
import { groupBy1 } from '../utils';
import { StockSymbol } from '../models/stock';
import { useStocks } from '../services/dataProviders';
import { Transaction } from '../models/transaction';

function FollowStocks(props: {
    setTransactions: (fn: (oldTransactions: Transaction[]) => Transaction[]) => void,
    onSymbolClicked: (symbol: StockSymbol) => void
}) {
    const [userData, setUserData] = useState<UserData>();
    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [watchList, setWatchList] = useState<Allocation[]>([])

    const stocks = useStocks();
    const watchListBySymbol = groupBy1(watchList, a => a.symbol);
    const unfollowedStocks = stocks.filter(s => !(s.symbol in watchListBySymbol));

    const hasMore = unfollowedStocks.length > 0;

    useEffect(() => {
        api.getUserData().then(ud => {
            const allocations = groupBy1(
                ud.allocations,
                (a) => a.symbol,
                (a) => a.amount
            );
            setAllocations(allocations);
            setUserData(ud);
        })
    }, []);

    useEffect(() => {
        if (userData) {
            const watchList = userData.watchList.map((w) => ({
                ...w,
                amount: allocations[w.symbol],
            }));
            setWatchList(watchList);
        }
    }, [userData, allocations]);

    const [followPopupVisible, setFollowPopupVisible] = useState(false);
    const handleAddClick = () => setFollowPopupVisible(true);

    async function follow(symbol: StockSymbol) {
        if (watchList.find(w => w.symbol === symbol)) return;
        await api.postWatch({ symbol, action: 'ADD' });
        setWatchList(wl => [...wl, { symbol, amount: allocations[symbol] }]);
    }

    async function unfollow(symbol: StockSymbol) {
        await api.postWatch({ symbol, action: 'REMOVE' });
        setWatchList(wl => wl.filter(w => w.symbol !== symbol));
    }

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
                        <StockDetails symbol={watched.symbol} amount={watched.amount}
                            onUnfollow={unfollow} onSymbolClicked={props.onSymbolClicked}
                            setAllocations={setAllocations} setTransactions={props.setTransactions} />
                    </div>
                )}
            </div>
            <FollowStockPopup watchList={watchList} unfollowedStocks={unfollowedStocks} onFollow={follow}
                visible={followPopupVisible} setVisible={setFollowPopupVisible as React.Dispatch<boolean>} />
        </section>
    );
}

export default FollowStocks;
