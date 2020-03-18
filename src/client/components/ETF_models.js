import { valPercent, valThousand } from "../utils";

export const Columns = {
  columns: [
    {
      Header: "Ticker Level",
      columns: [
        {
          Header: "Date",
          id: "Date",
          accessor: f => {
            let date = new Date(f.date);
            return (
              date.getMonth() +
              1 +
              "/" +
              date.getDate() +
              "/" +
              date.getFullYear()
            );
          },
          sortMethod: (a, b) => {
            a = new Date(a).getTime();
            b = new Date(b).getTime();
            return b > a ? 1 : -1;
          }
        },
        {
          Header: "Flow",
          id: "Flow",
          accessor: f => (f.flow ? valThousand(f.flow.toFixed(0)) : 0)
        },
        {
          Header: "TNA",
          id: "TNA",
          accessor: f => (f.tna ? valThousand(f.tna.toFixed(0)) : 0)
        },
        {
          Header: "Nav Change",
          id: "NavChange",
          accessor: f => (f.nav_prcnt ? valPercent(f.nav_prcnt.toFixed(2)) : 0)
        },
        {
          Header: "Flow/TNA",
          id: "Flow/TNA",
          accessor: f => (f.flowTna ? valPercent(f.flowTna.toFixed(2)) : 0)
        }
      ]
    }
  ]
};

export const msColumns = {
  columns: [
    {
      Header: "Etf Category Level",
      columns: [
        {
          Header: "Date",
          id: "Date",
          accessor: f => {
            let date = new Date(f.date);
            return (
              date.getMonth() +
              1 +
              "/" +
              date.getDate() +
              "/" +
              date.getFullYear()
            );
          },
          sortMethod: (a, b) => {
            a = new Date(a).getTime();
            b = new Date(b).getTime();
            return b > a ? 1 : -1;
          }
        },
        {
          Header: "FlowSum",
          id: "FlowSum",
          accessor: f => (f.flowSum ? valThousand(f.flowSum.toFixed(0)) : 0)
        },
        // flow over TNA
        {
          Header: "TnaSum",
          id: "TnaSum",
          accessor: f => (f.tnaSum ? valThousand(f.tnaSum.toFixed(0)) : 0)
        },
        {
          Header: "Nav %",
          id: "Nav%",
          accessor: f =>
            f.nav_prcntAvg ? valPercent(f.nav_prcntAvg.toFixed(2)) : 0
        },
        {
          Header: "Flow/TNA",
          id: "Flow/TNA",
          accessor: f =>
            f.flow_tna_ratio ? valPercent(f.flow_tna_ratio.toFixed(2)) : 0
        }
      ]
    }
  ]
};
export let ETF_Categories = ["Ticker", "Morning Star", "Asset"];

export let Asset_Categories = [
  "Commodity",
  "Equity",
  "Fixed Income",
  "US Equity",
  "Global Equity",
  "Alternative",
  "Mixed Allocation",
  "Specialty"
];

export let MS_Categories = [
  "Aggressive Allocation",
  "Allocation--50% to 70% Equity",
  "Alternative",
  "Asset Allocation",
  "Bank Loan",
  "Bear Market",
  "China Region",
  "Commodities",
  "Commodities Agriculture",
  "Commodities Broad Basket",
  "Commodities Energy",
  "Commodities Industrial Metals",
  "Commodities Miscellaneous",
  "Commodities Precious Metals",
  "Communications",
  "Conservative Allocation",
  "Consumer Cyclical",
  "Consumer Defensive",
  "Convertibles",
  "Corporate Bond",
  "Developed International Equity",
  "Diversified Emerging Markets",
  "Diversified Pacific Asia",
  "Diversified US Equity",
  "Emerging Markets Bond",
  "Emerging Markets Equity",
  "Energy Limited Partnership",
  "Equity Energy",
  "Equity Precious Metals",
  "Europe Stock",
  "Financial",
  "Foreign Debt",
  "Foreign Large Blend",
  "Foreign Large Growth",
  "Foreign Large Value",
  "Foreign Small Mid Blend",
  "Foreign Small Mid Value",
  "Foreign Small/Mid Blend",
  "Foreign Small/Mid Growth",
  "Foreign Small/Mid Value",
  "Global Real Estate",
  "Health",
  "High Yield Bond",
  "High Yield Muni",
  "India Equity",
  "Industrials",
  "Inflation-Protected Bond",
  "Intermediate Government",
  "Intermediate-Term Bond",
  "Japan Stock",
  "Large Blend",
  "Large Growth",
  "Large Value",
  "Latin America Stock",
  "Long Government",
  "Long Short Equity",
  "Long-Term Bond",
  "Long/Short Equity",
  "Managed Futures",
  "Market Neutral",
  "Mid-Cap Blend",
  "Mid-Cap Growth",
  "Mid-Cap Value",
  "Miscellaneous Region",
  "Miscellaneous Sector",
  "Moderate Allocation",
  "Multialternative",
  "Multicurrency",
  "Multisector Bond",
  "Muni California Intermediate",
  "Muni California Long",
  "Muni National Interm",
  "Muni National Long",
  "Muni National Short",
  "Muni New York Intermediate",
  "Muni New York Long",
  "Muni Target Maturity",
  "Municipal Bond",
  "Natural Resources",
  "Nontraditional Bond",
  "Options-based",
  "Pacific Asia ex-Japan Stk",
  "Preferred Stock",
  "Real Estate",
  "Short",
  "Short Government",
  "Short term corporate",
  "Short-Term Bond",
  "Single Currency",
  "Small Blend",
  "Small Growth",
  "Small Value",
  "Tactical Allocation",
  "Target Maturity",
  "Technology",
  "Trading-Inverse Commodities",
  "Trading-Inverse Debt",
  "Trading-Inverse Equity",
  "Trading-Leveraged Commodities",
  "Trading-Leveraged Debt",
  "Trading-Leveraged Equity",
  "Trading-Miscellaneous",
  "Treasury Bond",
  "US Sector Equity",
  "Ultrashort Bond",
  "Utilities",
  "Volatility",
  "World Allocation",
  "World Bond",
  "World Large Stock",
  "World Stock"
];
