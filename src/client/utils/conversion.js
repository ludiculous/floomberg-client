export function valPercent(val) {
  return val * 100 + "%";
}

export function valThousand(val) {
  return parseFloat(val).toLocaleString("en");
}

export function valFull(str) {
  str = str.replace("Stk", "Stock");
  str = str.replace("stk", "Stock");
  str = str.replace("Stks", "Stock");
  str = str.replace("stks", "Stock");
  str = str.replace("Mkt", "Market");
  str = str.replace("mkt", "Market");
  str = str.replace("Mkts", "Market");
  str = str.replace("mkts", "Market");

  return str;
}
