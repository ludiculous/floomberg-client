import React, { Component } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/lib/Async";
import { ETF_Categories, MS_Categories, Asset_Categories } from "./ETF_models";
import { valFull } from "../utils";
import { getETFTicker } from "../actions";
import { SelectStyles } from "../constants/styles";

class ETF_Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      etfCategory: "",
      etfCategories: [],
      msCategories: [],
      msCategory: "",
      fromDate: "",
      toDate: "",
      default: ""
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleTickerChange = this.handleTickerChange.bind(this);
    this.handleAssetChange = this.handleAssetChange.bind(this);
    this.handleEtfCategory = this.handleEtfCategory.bind(this);
    this.handleMsChange = this.handleMsChange.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.getFilter = this.getFilter.bind(this);
  }

  componentDidMount() {
    this.setState({
      etfCategory: "",
      etfCategories: ETF_Categories.map(cat => {
        return {
          value: cat,
          label: `${cat} level`
        };
      }),
      msCategories: MS_Categories.sort().map(name => {
        return {
          value: name,
          label: valFull(name)
        };
      }),
      msCategory: [],
      assetCategories: Asset_Categories.sort().map(asset => {
        return {
          value: asset,
          label: valFull(asset)
        };
      }),
      assetCategory: [],
      tickerSymbols: this.props.etfTickerList.sort().map(ticker => {
        return {
          value: ticker,
          label: ticker
        };
      }),
      tickerSymbol: [],
      fromDate: "",
      toDate: ""
    });
  }

  handleEtfCategory(value, { action, removedValue }) {
    let etfCat = value.value;
    console.log(etfCat);
    if (etfCat !== this.state.etfCategory) {
      this.setState({ etfCategory: etfCat });
      // clear inputs on category change if etf category value changed
      if (this.refs.hasOwnProperty("category_select")) {
        this.refs.category_select.select.clearValue();
      }
      console.log(this.refs.category_select);
      this.clearInput();
    }
  }

  handleFromDateChange(event) {
    console.log(event.target.value);
    this.setState({ fromDate: event.target.value });
  }

  handleToDateChange(event) {
    console.log(event.target.value);
    this.setState({ toDate: event.target.value });
  }

  handleMsChange(value, { action, removedValue }) {
    let msC = value.map(v => v.value);
    this.setState({ msCategory: msC });
  }

  handleAssetChange(value, { action, removedValue }) {
    let aC = value.map(v => v.value);
    this.setState({ assetCategory: aC });
  }

  handleTickerChange(value, { action, removedValue }) {
    console.log(action);
    console.log(value);
    console.log("removed value", removedValue);
    let tS = value.map(v => v.value);
    this.setState({ tickerSymbol: tS });
  }

  clearInput() {
    const inputList = ["msCategory", "assetCategory", "tickerSymbol"];

    inputList.forEach(item => {
      this.setState({
        [item]: null
      });
    });
  }

  getFilter() {
    let category = this.state.etfCategory;
    const filterCol = (category, catOptions, catValue, fnName) => {
      return this.state[catOptions].length > 0 ? (
        <div className="filter-col">
          <label className="filter-label">{category}</label>
          <Select
            className="select-input"
            isSearchable
            isMulti
            styles={SelectStyles}
            options={this.state[catOptions]}
            defaultOptions={this.state[catOptions]}
            onChange={this[fnName]}
            ref="category_select"
          ></Select>
        </div>
      ) : (
        ""
      );
    };

    switch (category) {
      case "Ticker":
        return filterCol(
          category,
          "tickerSymbols",
          "tickerSymbol",
          "handleTickerChange"
        );
        break;
      case "Morning Star":
        return filterCol(
          category,
          "msCategories",
          "msCategory",
          "handleMsChange"
        );
        break;
      case "Asset":
        return filterCol(
          category,
          "assetCategories",
          "assetCategory",
          "handleAssetChange"
        );
        break;
      default:
        return "";
    }
  }

  handleSubmitSearch() {
    const {
      etfCategory,
      msCategory,
      tickerSymbol,
      assetCategory,
      fromDate,
      toDate
    } = this.state;
    let data = {
      etfCategory,
      msCategory,
      assetCategory,
      tickerSymbol,
      fromDate,
      toDate
    };
    this.props.handleSearch(data);
  }

  render() {
    return (
      <div>
        <div className="filter-col">
          <label className="filter-label">Category</label>
          <Select
            className="select-input"
            value={this.state[this.state.etfCategory]}
            options={this.state.etfCategories}
            styles={SelectStyles}
            closeMenuOnSelect={true}
            onChange={this.handleEtfCategory}
          >
            {this.state.etfCategories}
          </Select>
        </div>
        {this.state.etfCategory.length > 1 ? this.getFilter() : ""}
        {this.state.etfCategory.length > 1 ? (
          <div className="filter-col">
            <div className="filter-row">
              <label className="filter-label">From</label>
              <input
                className="filter-date"
                type="date"
                name="from"
                onChange={this.handleFromDateChange}
              />
            </div>
            <div className="filter-row">
              <label className="filter-label">To</label>
              <input
                className="filter-date"
                type="date"
                name="to"
                onChange={this.handleToDateChange}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.etfCategory.length > 1 ? (
          <input
            type="button"
            value="Search"
            onClick={this.handleSubmitSearch}
            className="btn-submit"
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default ETF_Filters;
