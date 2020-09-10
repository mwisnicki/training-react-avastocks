/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridReadyEvent, ColDef, ICellRendererParams } from 'ag-grid-community';

import { BuySellPopup } from '../components/BuySellPopup';
import { usePopupState } from '../components/Popup';
import { Allocation } from '../models/user';
import { Stock } from '../models/stock';
import { groupBy1 } from '../utils';
import { usdFormatter } from '../services/formatters';
import api from '../services/api';
import { AppStateContext } from '../AppState';

interface AssetRowData extends Allocation {
    price: number;
    total: number;
    stock: Stock;
}

interface ICellRendererParamsTyped<T> extends ICellRendererParams {
    data: T
}

function Assets() {
    const { state, dispatch } = useContext(AppStateContext);
    const { userData, stocks } = state;
    const allocations = userData?.allocations;

    const columnDefs: ColDef[] = [
        { headerName: 'Stock', field: 'symbol' },
        { headerName: 'Amount', field: 'amount', type: 'numericColumn' },
        {
            headerName: 'Current Price',
            field: 'price',
            type: 'numericColumn',
            valueFormatter: usdFormatter,
        },
        {
            headerName: 'Total',
            field: 'total',
            type: 'numericColumn',
            valueFormatter: usdFormatter,
        },
        {
            headerName: 'Sell',
            cellRenderer: 'sellButtonRenderer',
        },
    ];

    const [rowData, setRowData] = useState<AssetRowData[]>([]);

    // state for sell dialog
    const sellPopupState = usePopupState();
    const [stock, setStock] = useState<Stock>();

    useEffect(() => {
        api.getAllocations().then(allocations => dispatch({ type: 'setAllocations', allocations }));
        api.getStocks().then(stocks => dispatch({ type: 'setStocks', stocks }));
    }, [dispatch]);

    useEffect(() => {
        if (allocations && stocks) {
            const stockBySymbol = groupBy1(stocks, (s) => s.symbol);
            const rows = allocations.map((a) => {
                const stock = stockBySymbol[a.symbol];
                const price = stock.lastTick.price;
                const rowData = {
                    ...a,
                    price,
                    total: a.amount * price,
                    stock
                };
                return rowData;
            });
            setRowData(rows);
        }
    }, [allocations, stocks])

    const handleGridReady = (e: GridReadyEvent) => {
        e.api.sizeColumnsToFit();
    }

    const frameworkComponents = {
        sellButtonRenderer: SellButtonRenderer
    }

    function SellButtonRenderer(props: ICellRendererParamsTyped<AssetRowData>) {
        const { data } = props;

        const handlePopupShowClick = () => {
            setStock(data.stock);
            sellPopupState.setVisible(true);
        }

        if (data.amount <= 0)
            return null;

        return (
            <div className="stock-list__grid-cell">
                <a onClick={handlePopupShowClick}>
                    <span className="btn-transaction btn-transaction--sell">sell</span>
                </a>
            </div>
        );
    }

    return (
        <section className="stock-transactions full-width">
            <div className="ag-theme-balham"
                style={{ height: '500px' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    frameworkComponents={frameworkComponents}
                    onGridReady={handleGridReady}
                >
                </AgGridReact>
            </div>

            {stock &&
                <BuySellPopup
                    stock={stock}
                    operation="sell"
                    {...sellPopupState}
                />
            }
        </section>

    );
}

export default Assets;
