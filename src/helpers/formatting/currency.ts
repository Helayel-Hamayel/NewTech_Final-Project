export const currency = new Intl.NumberFormat("en-IL", {
  style: 'currency',
  currency: "ILS",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});