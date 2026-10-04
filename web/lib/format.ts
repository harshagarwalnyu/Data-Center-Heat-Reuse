export const int = (n: number) => Math.round(n).toLocaleString("en-US");
export const dec = (n: number, d = 1) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const usd = (n: number) => `${n < 0 ? "-" : ""}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
export const gwh = (mwh: number) => `${dec(mwh / 1000, mwh >= 100000 ? 0 : 1)} GWh`;
/** 24,500 -> "24,500"; 1,000,000 -> "1.0 million" for headline use */
export const compact = (n: number) => (n >= 1e6 ? `${dec(n / 1e6, 1)} million` : int(n));
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
