import React, { useState, useEffect } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { ColDef, GridReadyEvent, RowDataChangedEvent } from 'ag-grid-community';

import { Transaction } from '../models/transaction';
import { StockSymbol } from '../models/stock';
import { dateFormatter, usdFormatter } from '../services/formatters';

const directionToCssClass = (value: any) => {
    switch (value) {
        case 'BUY': return 'stock-transactions__grid-cell-buy';
        case 'SELL': return 'stock-transactions__grid-cell-sell';
        default: return '';
    }
};

interface TransactionRowData extends Transaction {
    dateObject: Date;
}

function TransactionGrid(props: {
    transactions: Transaction[],
    filterSymbol?: StockSymbol
}) {
    const columnDefs: ColDef[] = [
        {
            headerName: 'Date',
            field: 'dateObject',
            valueFormatter: dateFormatter,
            sort: 'desc',
        },
        { headerName: 'Stock', field: 'symbol', filter: true },
        { headerName: 'Amount', field: 'amount', type: 'numericColumn' },
        {
            headerName: 'Direction',
            field: 'side',
            cellClass: ({ value }) => directionToCssClass(value),
        },
        {
            headerName: 'Price',
            field: 'tickPrice',
            type: 'numericColumn',
            valueFormatter: usdFormatter,
        },
        {
            headerName: 'Total',
            field: 'cost',
            type: 'numericColumn',
            valueFormatter: usdFormatter,
        },
    ];

    const [rowData, setRowData] = useState<TransactionRowData[]>([]);

    useEffect(() => {
        function isTransactionVisible(tx: Transaction) {
            if (props.filterSymbol) return tx.symbol === props.filterSymbol;
            return true;
        }

        const toRow = (tx: Transaction) => ({ ...tx, dateObject: new Date(tx.date) });
        setRowData(props.transactions.filter((tx) => isTransactionVisible(tx)).map(toRow));
    }, [props.transactions, props.filterSymbol]);


    function handleGridReady(e: GridReadyEvent) {
        e.api.sizeColumnsToFit();
    }

    function handleRowDataChanged(e: RowDataChangedEvent) {
        e.api.sizeColumnsToFit();
    }

    // FIXME shows horizontal scroll on Assets and Details

    return (
        <section className="stock-transactions full-width">
            <div className="ag-theme-balham" style={{ height: '350px' }}>
                <AgGridReact rowData={rowData} columnDefs={columnDefs}
                    onGridReady={handleGridReady} onRowDataChanged={handleRowDataChanged}>
                </AgGridReact>
            </div>
        </section>
    );
}

export default TransactionGrid;
