import React, { Component } from 'react';
import ContractFilters from './ContractFilters.js';
import SummationFilters from './SummationFilters.js';
import Select from 'react-select';
import AggregationFilters from './AggregationFilters.js';
const styles = {
  option: (provided, state) => ({
    color: 'rgb(123, 127, 139)',
    padding: '5px',
    width: '100%'
  }),
  marginTop: '5px'
}

export default class Future_Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      futuresCategory: ''
    };
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleFuturesCategory = this.handleFuturesCategory.bind(this)
    this.addFilter = this.addFilter.bind(this);
  }

  componentDidMount() {
  }

  handleCategoryChange(event) {
    const { addCategory } = this.props;
    addCategory(event.target.value);
    this.setState({ category: event.target.value });
  }

  handleFuturesCategory(futuresCategory) {
    console.log(futuresCategory);
    this.setState({futuresCategory})
  }

  addFilter(filter) {
    const { addFilter } = this.props;
    addFilter(filter);
  }

  render() {
    return (
      <div>
        <div className='filter-row'>
          <div className='filter-label'>Category</div>

          <select value={ this.state.category }
              onChange={ this.handleCategoryChange }>
            <option value='' disabled>Select your option</option>
            <option value='contract'>Contract level</option>
            <option value='summation'>Summation of contract</option>
            <option value='aggregation'>Aggregation level</option>
          </select>
        </div>

        {(function(that) {
          switch(that.state.category) {
            case 'contract':
              return <ContractFilters addFilter={ that.addFilter } />;
            case 'summation':
              return <SummationFilters addFilter={ that.addFilter }/>;
            case 'aggregation':
              return <AggregationFilters addFilter={ that.addFilter }/>;
            default:
              return;
          }
        }) (this)}
      </div>
    );
  }
}
