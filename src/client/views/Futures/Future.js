import React, { Component } from 'react'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Filters from '../../components/Filters.js';
import { Columns } from '../../components/Future_models.js';

class Future extends Component {
      constructor(props) {
        super(props);
        this.state = { futures: [] };
        this.addCategory = this.addCategory.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
      }

      addCategory(category) {
        this.state['category'] = category;
      }

      addFilter(filter) {
        Object.assign(this.state, filter);
      }

      handleSearch() {
        let queryString = `/api/getFutureFlow/contract?`;
        switch (this.state.category) {
          case 'contract':
            this.handleContractsSearch.call(this);
            break;
          case 'summation':
            this.handleSummationSearch.call(this);
            break;
          case 'aggregation':
            this.handleAggregationSearch.call(this);
            break;
        }
      }

      handleContractsSearch() {
        let queryString = `/api/getFutureFlow/contract?`
            + `category=${this.state.category}&`;
        if (this.state.name) {
          queryString += `name=${this.state.name}&`;
        }
        if (this.state.from_date) {
          queryString += `from_date=${this.state.from_date}&`;
        }
        if (this.state.to_date) {
          queryString += `to_date=${this.state.to_date}&`;
        }
        if (this.state.contracts && this.state.contracts.length) {
          queryString += this.state.contracts.map(
              contract => `&contracts[]=${contract}`)
                  .join('');
        }
        fetch(queryString)
            .then(res => res.json())
            .then(json => {
              // Build out the data to fit the react-table's format
              let futures = {};
              this.state.contracts.forEach(c =>
                futures[c] = {
                  Header: c,
                  data: [],
                }
              );
              json.forEach(doc => {
                futures[doc.expiration_date].data.push(doc)
              });
              let res = [];
              Object.values(futures).forEach(val => res.push(val));
              this.setState({ futures: res });
            });
      }

      handleSummationSearch() {
        let queryString = `/api/getFutureFlow/summation?`
            + (this.state.from_date ?
                `from_date=${this.state.from_date}&` : ``)
            + (this.state.to_date ?
                `to_date=${this.state.to_date}&` : ``)
            + this.state.categories.map(c => `&categories[]=${c}`)
                .join('');
        fetch(queryString)
            .then(res => res.json())
            .then(json => {
              // Build out the data to fit the react-table's format
              let futures = {};
              this.state.categories.forEach(c =>
                futures[c] = {
                  Header: c,
                  data: [],
                }
              );
              json.forEach(doc => {
                futures[doc._id.category].data.push({
                  flow: doc.flow,
                  notional: doc.notional,
                  price_change: doc.price_change,
                  date: doc._id.date
                });
              });
              let res = [];
              Object.values(futures).forEach(val => res.push(val));
              this.setState({ futures: res });
            });
      }

      handleAggregationSearch() {
        let queryString = `/api/getFutureFlow/aggregation?`
            + (this.state.from_date ?
                `from_date=${this.state.from_date}&` : ``)
            + (this.state.to_date ?
                `to_date=${this.state.to_date}&` : ``)
            + this.state.aggregations.map(agg => `&aggregations[]=${agg}`)
                .join('');
        fetch(queryString)
            .then(res => res.json())
            .then(json => {
              // Build out the data to fit the react-table's format
              let futures = {};
              this.state.aggregations.forEach(a =>
                futures[a] = {
                  Header: a,
                  data: [],
                }
              );
              json.forEach(doc => {
                futures[doc._id.aggregation_level].data.push({
                  flow: doc.flow,
                  notional: doc.notional,
                  price_change: doc.price_change,
                  date: doc._id.date
                });
              });
              let res = [];
              Object.values(futures).forEach(val => res.push(val));
              this.setState({ futures: res });
            });
      }

      render() {
        return (
          <div className="section-flow">
              <div className='filter-container'>
                <Filters addCategory={ this.addCategory }
                    addFilter={ this.addFilter }/>
                <input type='button' value='Search' onClick={ this.handleSearch } className="btn-submit"/>
              </div>
              <div className='table-container'>
              { this.state.futures.map(
                  f => {
                    let columns = [Object.assign({}, Columns[this.state.category])];
                    if (this.state.category === 'aggregation'
                        || this.state.category === 'summation') {
                      columns[0].Header = f.Header;
                    } else {
                      let date = new Date(f.Header);
                      let dateStr = `${date.getMonth() + 1}/${date.getFullYear()}`;
                      columns[0].Header = dateStr;
                    }
                    return (<ReactTable data={ f.data } key={ columns[0].Header }
                        columns={ columns }/>);
                  }) }
              </div>
          </div>
        );
      }
}

export default Future
