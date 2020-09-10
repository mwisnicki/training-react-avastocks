import { ValueFormatterParams } from "ag-grid-community";
import moment from "moment";

export const dateFormatter = ({ value }: ValueFormatterParams) => moment(value).format('ddd, MMM D YYYY, h:mm:ss a'); // formatDate(value, 'short', 'en-US');

const nativeUsdFormatter = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const usdFormatter = ({ value }: ValueFormatterParams) => nativeUsdFormatter.format(value);
