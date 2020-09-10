import React, { ChangeEvent, useState, useEffect } from 'react';

import Highcharts, { SeriesOptionsType } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { NavLink } from 'react-router-dom';
import api from '../services/api';
import { StockPriceHistory, StockSymbol } from '../models/stock';

const PERIODS = ['today', 'yearly'] as const;

type Period = typeof PERIODS[number];

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

    const [period, setPeriod] = useState<Period>('today');

    const detailsRoute = `/details/${symbol}`;


    useEffect(() => {
        console.log('StockGraph', {period, symbol});
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

    const handlePeriodChanged = (e: ChangeEvent<HTMLSelectElement>) => setPeriod(e.target.value as Period);

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
