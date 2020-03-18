import React, { Component } from 'react'
import Select from 'react-select';
import {SelectStyles} from '../constants/styles';

const upTypeOptions = [
  {label:'daily upload', value:'daily'},
  {label:'category/ticker upload', value:'category'}
]

class Excel_Filters extends Component {
  constructor(props){
    super(props)
    this.state = {
      csvCategory: "",
      upType: 'daily',
      csvCategories: [
        {
          label:"US ETF",
          value:"US ETF"
        },
        {
          label:"International ETF",
          value:"International ETF",
        },
        {
          label: "Futures",
          value: "Futures"
        }
      ]
    }

    this.handleCategory = this.handleCategory.bind(this);
    this.handleUpCategory = this.handleUpCategory.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCategory(value, {action, removedValue}) {
    console.log(value)
    this.setState({csvCategory: value.value})
  }

  handleUpCategory(value, {action, removedValue}) {
    console.log(value);
    this.setState({upType: value.value})
  }

  handleSubmit() {
    console.log('handling uptype & csvSubmit')
    this.props.submitCategory(
      {
        csvCategory: this.state.csvCategory,
        upType: this.state.upType
      }
    )
  }

  render () {
    return (
      <div className="filter-col">
          <div className="filter-row">
            <label className="filter-label">Category</label>
            <Select
              className="select-input"
              isSearchable
              styles={SelectStyles}
              options={this.state.csvCategories}
              onChange={this.handleCategory}
            >
            </Select>
          </div>
          <div className="filter-row">
            <label className="filter-label">Upload Type</label>
            <Select
              className="select-input"
              styles={SelectStyles}
              defaultValue={upTypeOptions[0]}
              options={upTypeOptions}
              onChange={this.handleUpCategory}
            >
            </Select>
          </div>

          <div className="filter-row">
            {this.state.csvCategory.length > 0 && this.state.upType.length > 0 ? <input type='button' value='Upload' onClick={ this.handleSubmit } className="btn-submit"/> : ''}
          </div>
      </div>
    )
  }
}

export default Excel_Filters