import React, { Component } from 'react';
import Select from 'react-select';
import { CategoryNames } from './Future_models.js';
const styles = {
  option: (provided, state) => ({
    color: 'rgb(123, 127, 139)',
    padding: '5px'
  })
}

export default class ContractFilters extends Component {

  constructor(props) {
    super(props);
    this.state = {
      category_names: CategoryNames,
      contracts: [],
      category: ''
    };
    const { addFilter } = this.props;
    this.addFilter = addFilter;

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleContractsChange = this.handleContractsChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  handleCategoryChange(event) {
    this.setState({
      category: event.target.value,
      contracts: []
    });
    this.addFilter({ name: event.target.value });
    fetch(`/api/getFutureFlow/getContracts?category=${event.target.value}`)
      .then(res => res.json())
      .then(json => {
        json.sort();
        this.setState({
          contracts: json.map((val => {
            console.log(val)
            let exprDate = val;
            let date = new Date(val);
            let exprDateStr = `${date.getMonth() + 1}/` // Month is 0 index
                + `${date.getFullYear()}`;
            return {
              'value': exprDate,
              'label': exprDateStr
            };
          }))
        });
      });
  }

  handleContractsChange(contracts) {
    this.addFilter({ contracts: contracts.map(c => c.value) });
  }

  handleFromDateChange(event) {
    this.addFilter({ from_date: event.target.value });
  }

  handleToDateChange(event) {
    this.addFilter({ to_date: event.target.value });
  }

  render() {
    return (
      <div>
        <div className='filter-row'>
          <div className='filter-label'>Name</div>
          <select value={ this.state.category }
              onChange={ this.handleCategoryChange }>
            <option value='' disabled>Pick a contract</option>
            { this.state.category_names.map(
                (categoryName) =>
                    <option key={ categoryName }>{ categoryName }</option>) }
          </select>
        </div>
        <div className='filter-row'>
          <div className='filter-label'>Contract</div>
        </div>
        <Select
            isMulti isSearchable
            styles = {styles}
            options={ this.state.contracts }
            closeMenuOnSelect={ false }
            onChange={ this.handleContractsChange }>
        </Select>
        <div className='filter-row'>
          <div className='filter-label'>Date range</div>
        </div>
        <div className='filter-row'>
          <div className='filter-label'>From</div>
          <input type='date' name='from'
              onChange={ this.handleFromDateChange }/>
        </div>
        <div className='filter-row'>
          <div className='filter-label'>To</div>
          <input type='date' name='to' onChange={ this.handleToDateChange }/>
        </div>
      </div>
    );
  }
}
