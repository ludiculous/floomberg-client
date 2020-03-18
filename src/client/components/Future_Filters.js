import React, { Component } from 'react';
import Select from 'react-select';
import { AggregationLevels, CategoryNames } from './Future_models';
import {SelectStyles} from '../constants/styles';

export default class Future_Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      fromDate: '',
      toDate: '',
      futuresCategory: '',
      expirationDate: '',
      expirationDates: [],
      aggregation: '',
      aggregations: [],
      categoryName: '',
      categoryNames: [],
    };

    this.handleFuturesCategory = this.handleFuturesCategory.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleExpiration = this.handleExpiration.bind(this);
    this.handleContractChange = this.handleContractChange.bind(this);
    this.handleSummationChange = this.handleSummationChange.bind(this);
    this.handleAggregationChange = this.handleAggregationChange.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  componentDidMount() {
    this.setState({
      categoryNames: CategoryNames.map((cat)=>{
        return {
          'value': cat,
          'label': cat
        }
      }),
      aggregations: AggregationLevels.map((agg)=>{
        return {
          'value': agg,
          'label': agg
        }
      })
    })
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps)
    this.setState({
      expirationDates: newProps.expirationDates.map((exp)=>{
        let date = new Date(exp);
        let exprDateStr = `${date.getMonth() + 1}/` + `${date.getFullYear()}`;
        return {
          'value': exp,
          'label': exprDateStr
        };
      })
    },console.log(this.state))
  }

  handleFuturesCategory(value, {action, removedValue}) {
    console.log(value);
    this.setState({futuresCategory: value.value})
  }

  handleCategoryChange(value, {action, removedValue}) {
    console.log(value)
    let cat = '';
    this.state.futuresCategory === 'contract' ? cat = value.value : cat = value.map((v)=> v.value);
    this.setState({
      category: cat
    })
    this.props.getExpList(cat);
  }

  handleFromDateChange(event) {
    console.log(event.target.value)
    this.setState({ fromDate: event.target.value });
  }

  handleToDateChange(event) {
    console.log(event.target.value)
    this.setState({ toDate: event.target.value });
  }

  handleExpiration(value, {action, removedValue}) {
    console.log(value)
    let e = value.map((v)=> v.value)
    this.setState({expirationDate: e});
  }

  handleContractChange(value, {action, removedValue}) {
    let c = value.value
    this.setState({contract: c});
  }

  handleSummationChange(value, {action, removedValue}) {
    let s = value.map((v)=> v.value)
    this.setState({summation: s})
  }

  handleAggregationChange(value, {action, removedValue}) {
    console.log(value)
    console.log("removed value", removedValue)
    let a = value.map((v)=> v.value)
    this.setState({aggregation: a});
  }

  handleSubmitSearch() {
    const {category, fromDate, toDate, futuresCategory, expirationDate, aggregation} = this.state
    let data = {
      futuresCategory,
      category,
      expirationDate,
      aggregation,
      fromDate,
      toDate,
    }
    this.props.handleSearch(data);
  }

  render() {
    return (
      <div>
        <div className="filter-col">
            <label className='filter-label'>Category</label>
            <Select
              className="select-input"
              isSearchable
              options={
                [
                  {label:'Contract level', value: 'contract'},
                  {label:'Summation of contract', value: 'summation'},
                  {label:'Aggregation level', value: 'aggregation'},
                ]
              }
              styles={SelectStyles}
              closeMenuOnSelect={true}
              onChange={this.handleFuturesCategory}
            >
            </Select>
          </div>
          {this.state.futuresCategory.length > 1 ? getFilter(this) : ''}
          {this.state.futuresCategory.length > 1 ?
            <div className="filter-col">
              <div className='filter-row'>
                <label className="filter-label">From</label>
                <input className="filter-date" type='date' name='from' onChange={ this.handleFromDateChange }/>
              </div>
              <div className='filter-row'>
                <label className="filter-label">To</label>
                <input className="filter-date" type='date' name='to' onChange={ this.handleToDateChange }/>
              </div>
            </div> : ''
          }
          {this.state.futuresCategory.length > 1 ? <input type='button' value='Search' onClick={ this.handleSubmitSearch } className="btn-submit"/> : ''}
        </div>
    );
  }
}


const getFilter = (self)=>{
  let category = self.state.futuresCategory;

  const filterCol = (category, catOptions, fnName)=> {
    return (
      <div className="filter-col">
        <label className="filter-label">Name</label>
        {
          category !== "aggregation" ?
          <Select
            className="select-input"
            isSearchable
            isMulti={category !== 'contract' ? true: false}
            styles={SelectStyles}
            options={self.state.categoryNames}
            onChange={self.handleCategoryChange}
          >
          </Select>
          : ''
        }

        {
          category === "aggregation" ?
          <Select
            className="select-input"
            isSearchable
            isMulti
            styles={SelectStyles}
            options={self.state.aggregations}
            onChange={self.handleAggregationChange}
          >
          </Select>
          : ''
        }

        {category === "contract" ?
          <div className="filter-col">
            <label className="filter-label">Contract</label>
            <Select
              className="select-input"
              isSearchable
              isMulti
              styles={SelectStyles}
              options={self.state["expirationDates"]}
              onChange={self.handleExpiration}
            >
            </Select>
          </div> : ''
        }
      </div>
    )
  }

  switch(category) {
    case 'contract':
      return filterCol(category, 'contract', 'handleContractChange')
      break;
    case 'summation':
      return filterCol(category, 'summation', 'handleSummationChange')
      break;
    case 'aggregation':
      return filterCol(category, 'aggregation', 'handleAggregationChange')
      break;
    default:
      return ''
  }
}
