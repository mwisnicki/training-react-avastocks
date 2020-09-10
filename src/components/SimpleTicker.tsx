import React, { useEffect, useState, useContext } from 'react';

import { Client } from '@hapi/nes/lib/client';
import { WS_URL } from '../services/api';
import { AppStateContext } from '../AppState';

const nesClient = new Client(WS_URL);

// TODO connect on first usage / disconnect on last
nesClient.connect().then(() => {
    console.log("nesClient connected");
})


export function SimpleTicker(props: { symbol: string; }) {
    const { state, dispatch } = useContext(AppStateContext);

    const { symbol } = props;

    const stock = state.stocks?.find(s => s.symbol === symbol);

    const [tick, setTick] = useState(stock?.lastTick);

    // this is soo ugly
    useEffect(() => {
        if (!tick) setTick(stock?.lastTick);
    }, [stock, tick])

    useEffect(() => {
        const path = `/livestream/${symbol}`;
        nesClient.subscribe(path, setTick);
        return () => {
            nesClient.unsubscribe(path, setTick);
        }
    }, [symbol])

    if (tick)
        return <span>{tick.price.toFixed(2)}</span>;

    return <></>;
}
