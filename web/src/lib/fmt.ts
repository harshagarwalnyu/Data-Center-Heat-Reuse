const nf = (d = 0) => new Intl.NumberFormat("en-US", { maximumFractionDigits: d, minimumFractionDigits: d });

export const round = (x: number, to: number) => Math.round(x / to) * to;
export const num = (x: number, d = 0) => nf(d).format(x);
export const usd = (x: number, d = 0) => `$${nf(d).format(x)}`;
export const musd = (x: number) => `$${nf(x >= 10 ? 0 : 1).format(x)}M`;
export const pct = (x: number, d = 0) => `${nf(d).format(x * 100)}%`;
export const gwh = (mwh: number) => `${nf(mwh >= 10000 ? 0 : 1).format(mwh / 1000)} GWh`;
export const perMWh = (x: number) => `$${nf(0).format(x)}/MWh`;
