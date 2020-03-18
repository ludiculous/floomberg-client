import React, { Component } from 'react';
import Select from 'react-select';
import { CategoryNames } from './Future_Models.js';

export default class SummationFilters extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contracts: [],
      category_names: CategoryNames.map(c => {
        return {
          value: c,
          label: c
        };
      }),
      category: '',
    };
    const { addFilter } = this.props;
    this.addFilter = addFilter;

    this.handleContractsChange = this.handleContractsChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  handleContractsChange(contracts) {
    this.addFilter({ contracts: contracts.map(c => c.value) });
  }

  handleCategoryChange(categories) {
    this.addFilter({ categories: categories.map(c => c.value) });
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
        </div>
        <Select isMulti isSearchable options={ this.state.category_names }
            onChange={ this.handleCategoryChange } closeMenuOnSelect={ false }>
        </Select>
        <div className='filter-row'>
          <div>Date range</div>
        </div>
        <div className='filter-row'>From
          <input type='date' name='from'
              onChange={ this.handleFromDateChange }/>
        </div>
        <div className='filter-row'>To
          <input type='date' name='to' onChange={ this.handleToDateChange }/>
        </div>
      </div>
    );
  }
}
