import React, { Component } from 'react';
import Select from 'react-select';
import { AggregationLevels } from './Future_models.js';

export default class AggregationFilters extends Component {

  constructor(props) {
    super(props);
    this.state = { aggregations: AggregationLevels.map(a => {
        return { value: a, label: a };
      })
    };
    const { addFilter } = this.props;
    this.addFilter = addFilter

    this.handleAggregationChange = this.handleAggregationChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  handleAggregationChange(aggregations) {
    this.addFilter({ aggregations: aggregations.map(c => c.value) });
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
          <div>Aggregation level</div>
        </div>
        <Select isMulti isSearchable options={ this.state.aggregations }
            closeMenuOnSelect={ false }
            onChange={ this.handleAggregationChange }>
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
