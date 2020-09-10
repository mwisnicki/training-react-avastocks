import React, { ChangeEvent, useState, useEffect, useContext } from 'react';

import Highcharts, { SeriesOptionsType } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { NavLink } from 'react-router-dom';
import api from '../services/api';
import { StockPriceHistory, StockSymbol } from '../models/stock';
import { Period, AppStateContext } from '../AppState';

function getPrices(period: Period, symbol: StockSymbol): Promise<StockPriceHistory> {
    return {
        today: api.getPriceToday,
        yearly: api.getPriceYearly
    }[period](symbol);
}

function StockGraph(initProps: {
    symbol: StockSymbol
    showDetailsButton?: boolean
}) {
    const { state, dispatch } = useContext(AppStateContext);
    const { chartPeriod: period } = state;

    const props = {
        showDetailsButton: true,
        ...initProps
    }
    const { symbol, showDetailsButton } = props;

    const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
        title: undefined,
        xAxis: {
            type: 'datetime',
        },
        yAxis: {
            title: {
                text: 'Price',
            },
        },
        series: [
            {
                name: 'detailed',
                type: 'line',
                data: [],
            },
            {
                name: 'aggregated',
                type: 'line',
                data: [],
            },
        ],
    });

    const detailsRoute = `/details/${symbol}`;


    useEffect(() => {
        getPrices(period, symbol).then(history => {
            const series: SeriesOptionsType[] = [
                {
                    name: 'detailed',
                    type: 'line',
                    data: history.detailed.map((p) => [Date.parse(p.date), p.price]),
                },
                {
                    name: 'aggregated',
                    type: 'line',
                    data: history.aggregated.map((p) => [Date.parse(p.date), p.price]),
                },
            ];
            setChartOptions(opts => ({ ...opts, series }))
        });
    }, [period, symbol])

    const handlePeriodChanged = (e: ChangeEvent<HTMLSelectElement>) =>
        dispatch({ type: "setChartPeriod", period: e.target.value as Period });

    const chartCallback = (chart: Highcharts.Chart) => {
        //chart.reflow();
    }

    return (
        <section className="stock-graph">
            <h2 className="stock-list__title">
                Symbol: <i>{symbol}</i> Period:
                <select className="modal__dropdown" value={period} onChange={handlePeriodChanged}>
                    <option value="today">today</option>
                    <option value="yearly">yearly</option>
                </select>
                {showDetailsButton &&
                    <NavLink to={detailsRoute} className="stock-graph__link">details</NavLink>
                }
            </h2>
            {/* FIXME has fixed size 600x400 */}
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                callback={chartCallback}
                className="stock-graph__container"
            >
            </HighchartsReact>
        </section>

    );
}

export default StockGraph;
