/**
 * File to store static data for the frontend.
 * In this file:
 * - Columns
 * - Category names
 * - Aggregation levels
 */
export const Columns = {
  contract: {
    columns: [
      {
        Header: "",
        columns: [
          {
            id: 'Date',
            Header: 'Date',
            accessor: f => {
              let date = new Date(f.date);
              return (date.getMonth() + 1)
                + '/' + date.getDate()
                + '/' +  date.getFullYear();
            },
            sortMethod: (a,b) => {
              a = new Date(a).getTime();
              b = new Date(b).getTime();
                return b > a ? 1 : -1;
            }
          }, {
            Header: 'Flow',
            accessor: 'flow'
          }, {
            Header: 'Notional',
            accessor: 'notional'
          }, {
            id: 'Price change',
            Header: 'Price change',
            accessor: f => f.price_change ?
                f.price_change.toFixed(2) : 0
          }, {
            id: 'Flow/Notional',
            Header: 'Flow/Notional',
            accessor: f => f.notional ?
                (f.flow / f.notional).toFixed(2) : 0
          }
        ]
      }
    ]
  },
  summation: {
      columns: [
        {
          Header: '',
          columns: [
            {
              id: 'Date',
              Header: 'Date',
              accessor: f => {
                let date = new Date(f._id.date);
                return (date.getMonth() + 1)
                    + '/' + date.getDate()
                    + '/' +  date.getFullYear();
              },
              sortMethod: (a,b) => {
                a = new Date(a).getTime();
                b = new Date(b).getTime();
                  return b > a ? 1 : -1;
              }
            }, {
              Header: 'Flow sum',
              accessor: 'flow'
            }, {
              Header: 'Notional sum',
              accessor: 'notional'
            }, {
              id: 'Average price change',
              Header: 'Average price change',
              accessor: f => f.price_change ?
              f.price_change.toFixed(2) : 0
            }, {
              id: 'Flow/Notional sum',
              Header: 'Flow/Notional',
              accessor: f => {
                if (!f.notional) {
                  return f.flow;
                }
                return (f.flow / f.notional).toFixed(2);
              }
            }
          ]
        }
      ]
  },
  aggregation: {
    columns: [
      {
        Header: '',
        columns:  [
          {
            id: 'Date',
            Header: 'Date',
            accessor: f => {
              let date = new Date(f._id.date);
              return (date.getMonth() + 1)
                  + '/' + date.getDate()
                  + '/' +  date.getFullYear();
            },
            sortMethod: (a,b) => {
              a = new Date(a).getTime();
              b = new Date(b).getTime();
                return b > a ? 1 : -1;
            }
          }, {
            Header: 'Flow sum',
            accessor: 'flow'
          }, {
            Header: 'Notional sum',
            accessor: 'notional'
          }, {
            id: 'Average price change',
            Header: 'Price change',
            accessor: f => f.price_change ?
            f.price_change.toFixed(2) : 0
          }, {
            id: 'Flow/Notional sum',
            Header: 'Flow/Notional',
            accessor: f => {
              if (!f.notional) {
                return f.flow;
              }
              return (f.flow / f.notional).toFixed(2);
            }
          }
        ]
      }
    ]
  },
};

export const CategoryNames = [
  'Australian dollar',
  'British pound',
  'Canadian',
  'Euro',
  'Japanese yen',
  'Mexican peso',
  'Swiss franc',
  'US Dollar Index',
  'Brent crude oil',
  'Natural gas',
  'Rbob gasoline',
  'WTI crude oil',
  'Euro dollars',
  'Fed funds',
  'T-Note 10yr',
  'T-Note 5yr',
  'T-Notes 2yr',
  'Corn',
  'Oats',
  'Rough rice',
  'Soybean meal',
  'Soybean oil',
  'Soybeans',
  'Wheat',
  'Feeder cattle',
  'Live cattle',
  'Live hogs',
  'Milk III',
  'Copper',
  'Gold',
  'Palladium',
  'Platinum',
  'Silver',
  'Cocoa',
  'Coffee',
  'Cotton#2',
  'Lumber',
  'Orange juice',
  'Sugar#11'
];

export const AggregationLevels = [
  'Soft',
  'Grain',
  'Meat',
  'Metal',
  'Currency',
  'Energy',
  'Financial'
];
