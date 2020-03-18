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

export const intEtfColumns = {
  columns: [
    {
      Header: "Int Etf Category Level",
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
          Header: "Flow/Tna",
          id: "Flow/Tna",
          accessor: f =>
            f.flow_tna_ratio ? valPercent(f.flow_tna_ratio.toFixed(2)) : 0
        }
      ]
    }
  ]
};

export const Asset_Categories = [
  "Equity",
  "Fixed Income",
  "Alternative",
  "Specialty",
  "Mixed Allocation",
  "Commodity",
  "Money Market",
  "Real Estate"
];
export const Domicile_Categories = [
  "CANADA",
  "LUXEMBOURG",
  "IRELAND",
  "NETHERLANDS",
  "SOUTH KOREA",
  "SOUTH AFRICA",
  "FRANCE",
  "GERMANY",
  "CHINA",
  "AUSTRALIA",
  "TAIWAN",
  "ISRAEL",
  "NEW ZEALAND",
  "HONG KONG",
  "JAPAN",
  "JERSEY",
  "SWITZERLAND",
  "SWEDEN",
  "INDIA",
  "THAILAND",
  "MALAYSIA",
  "TURKEY",
  "NORWAY",
  "BRITAIN",
  "QATAR",
  "INDONESIA",
  "BRAZIL",
  "UAE",
  "SINGAPORE",
  "MEXICO",
  "PHILIPPINES",
  "SAUDI ARABIA",
  "CHILE",
  "NIGERIA",
  "BULGARIA",
  "ICELAND",
  "COLOMBIA",
  "FINLAND",
  "MAURITIUS",
  "EGYPT",
  "HUNGARY",
  "SPAIN",
  "GREECE",
  "VIETNAM",
  "ROMANIA"
];
export const Strategy_Categories = [
  "Blend",
  "Growth",
  "Value",
  "Corporate",
  "Aggregate",
  "Equity Hedge",
  "Government",
  "Convertible",
  "Derivative",
  "Bank Loans",
  "Aggressive Allocation",
  "Inflation Protected",
  "Energy",
  "Precious Metals",
  "Preferred",
  "Currency",
  "Moderate Allocation",
  "Global Allocation",
  "Bear Market",
  "Specialty",
  "Dynamic Allocation",
  "Multi-Strategy",
  "Fixed Income Directional",
  "Currency Focused",
  "Conservative Allocation",
  "CTA/Managed Futures",
  "Broad Based",
  "Agriculture",
  "Industrial Metals",
  "Livestock",
  "Mortgage-Backed",
  "General MMKT",
  "Government and Agency",
  "Enhanced MMKT",
  "Global",
  "Physical Assets and Securities"
];
export const Geo_Categories = [
  "Global",
  "European Region",
  "International",
  "Canada",
  "Russia",
  "U.S.",
  "Eurozone",
  "Latin American Region",
  "Asian Pacific Region",
  "China",
  "Multi",
  "South Korea",
  "India",
  "Asian Pacific Region ex Japan",
  "North American Region",
  "Hong Kong",
  "Japan",
  "Australia",
  "France",
  "Germany",
  "Sweden",
  "South Africa",
  "Turkey",
  "Israel",
  "Qatar",
  "U.K.",
  "Indonesia",
  "European Reg. ex UK",
  "Nordic Region",
  "Brazil",
  "U.A.E.",
  "Switzerland",
  "Mexico",
  "European Union",
  "Italy",
  "Philippines",
  "Saudi Arabia",
  "Thailand",
  "Malaysia",
  "Spain",
  "Netherlands",
  "Chile",
  "African Region",
  "Taiwan",
  "Greater China",
  "Vietnam",
  "GCC",
  "Norway",
  "Ireland",
  "Nigeria",
  "New Zealand",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Romania",
  "Portugal",
  "Poland",
  "Eastern European Region",
  "Macedonia",
  "BRIC",
  "Iceland",
  "Colombia",
  "Greece",
  "Finland",
  "Egypt",
  "Croatia",
  "Czech Republic",
  "Hungary",
  "Bulgaria",
  "Belgium",
  "Austria",
  "ASEAN Countries",
  "Serbia",
  "Bangladesh",
  "Pakistan",
  "South East Asia Region"
];
export const Mkt_Cap_Categoriees = [
  "Broad Market",
  "Large-cap",
  "Small-cap",
  "Mid-cap"
];
