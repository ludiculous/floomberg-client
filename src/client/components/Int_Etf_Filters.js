import React, { Component } from "react";
import Select from "react-select";
import {
  Asset_Categories,
  Domicile_Categories,
  Strategy_Categories,
  Geo_Categories,
  Mkt_Cap_Categoriees
} from "./Int_Etf_models";
import { valFull } from "../utils";
import { SelectStyles } from "../constants/styles";

class Int_Etf_Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      ticker: "",
      dom: "",
      asC: "",
      fStrat: "",
      geo: "",
      mcf: "",
      fromDate: "",
      toDate: ""
    };
    this.handleCategory = this.handleCategory.bind(this);
    this.handleTicker = this.handleTicker.bind(this);
    this.handleAsset = this.handleAsset.bind(this);
    this.handleGeo = this.handleGeo.bind(this);
    this.handleStrategy = this.handleStrategy.bind(this);
    this.handleMktCap = this.handleMktCap.bind(this);
    this.handleDomicile = this.handleDomicile.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  componentDidMount() {
    // to populate select options
    this.setState({
      tickers: this.props.intEtfTickerList.sort().map(ticker => ({
        value: ticker,
        label: ticker
      })),
      domiciles: Domicile_Categories.sort().map(cat => ({
        value: cat,
        label: valFull(cat)
      })),
      asset_classes: Asset_Categories.sort().map(cat => ({
        value: cat,
        label: valFull(cat)
      })),
      strategies: Strategy_Categories.sort().map(cat => ({
        value: cat,
        label: valFull(cat)
      })),
      geo_focuses: Geo_Categories.sort().map(cat => ({
        value: cat,
        label: valFull(cat)
      })),
      mkt_cap_focuses: Mkt_Cap_Categoriees.sort().map(cat => ({
        value: cat,
        label: valFull(cat)
      }))
    });
  }

  handleCategory(value, { action, removedValue }) {
    console.log(value);
    let prevState = this.state.category;

    this.setState({ category: value.value }, () => {
      if (this.state.category !== prevState) {
        // if the previous state is different from the current state delete
        this.setState({
          ticker: "",
          dom: "",
          asC: "",
          fStrat: "",
          geo: "",
          mcf: "",
          fromDate: "",
          toDate: ""
        });
      }
    });
    // check if value existed previously if the the category changes entirely then all of the other inputs should default
  }

  handleTicker(value, { action, removedValue }) {
    console.log("value: ", value);
    console.log("action: ", action);
    console.log("removed: ", removedValue);
    let t = value.map(v => v.value);
    this.setState({ ticker: t });
  }

  handleAsset(value, { action, removedValue }) {
    let aC = value.value;
    this.setState({ asC: aC });
  }

  handleGeo(value, { action, removedValue }) {
    let gF = value.value;
    this.setState({ geo: gF });
  }

  handleDomicile(value, { action, removedValue }) {
    let dC = value.value;
    this.setState({ dom: dC }, () => console.log(this.state));
  }

  handleStrategy(value, { action, removedValue }) {
    let fS = value.value;
    this.setState({ fStrat: fS });
  }

  handleMktCap(value, { action, removedValue }) {
    let mC = value.value;
    this.setState({ mcf: mC });
  }

  handleFromDateChange(event) {
    console.log(event.target.value);
    this.setState({ fromDate: event.target.value });
  }

  handleToDateChange(event) {
    console.log(event.target.value);
    this.setState({ toDate: event.target.value });
  }

  handleSubmitSearch() {
    let cats = ["ticker", "dom", "asC", "fStrat", "geo", "mcf"];
    let search = [];
    cats.forEach(cat => {
      if (this.state[cat].length > 0) {
        search.push({ category: cat, value: this.state[cat] });
      }
    });
    let searchData = {
      intetfCategory: this.state.category,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      cats: search
    };
    console.log("submitted search");
    console.log(searchData);

    this.props.handleSearch(searchData);
  }

  render() {
    return (
      <div>
        <div className="filter-col">
          <label className="filter-label">Category</label>
          <Select
            className="select-input"
            options={[
              {
                label: "Ticker level",
                value: "Ticker"
              },
              {
                label: "International Etf category level",
                value: "International Etf Categories"
              }
            ]}
            styles={SelectStyles}
            closeMenuOnSelect={true}
            onChange={this.handleCategory}
          ></Select>

          {this.state.category === "Ticker" ? (
            <div className="filter-col">
              <label className="filter-label">Ticker</label>
              <Select
                className="select-input"
                isSearchable
                isMulti
                options={this.state.tickers}
                styles={SelectStyles}
                closeMenuOnSelect={true}
                onChange={this.handleTicker}
              ></Select>
            </div>
          ) : (
            ""
          )}

          {this.state.category === "International Etf Categories" ? (
            <div className="filter-col">
              <label className="filter-label">Domiciles</label>
              <Select
                className="select-input"
                isSearchable
                options={this.state.domiciles}
                styles={SelectStyles}
                closeMenuOnSelect={true}
                onChange={this.handleDomicile}
              ></Select>

              <label className="filter-label">Geo Focus</label>
              <Select
                className="select-input"
                isSearchable
                options={this.state.geo_focuses}
                styles={SelectStyles}
                closeMenuOnSelect={true}
                onChange={this.handleGeo}
              ></Select>

              <label className="filter-label">Market Cap Focus</label>
              <Select
                className="select-input"
                isSearchable
                options={this.state.mkt_cap_focuses}
                styles={SelectStyles}
                closeMenuOnSelect={true}
                onChange={this.handleMktCap}
              ></Select>

              <label className="filter-label">Asset Class</label>
              <Select
                className="select-input"
                isSearchable
                options={this.state.asset_classes}
                styles={SelectStyles}
                closeMenuOnSelect={true}
                onChange={this.handleAsset}
              ></Select>

              <label className="filter-label">Fund Strategy</label>
              <Select
                className="select-input"
                isSearchable
                options={this.state.strategies}
                styles={SelectStyles}
                closeMenuOnSelect={true}
                onChange={this.handleStrategy}
              ></Select>
            </div>
          ) : (
            ""
          )}
        </div>
        {this.state.category !== "" ? (
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
            <input
              type="button"
              value="Search"
              onClick={this.handleSubmitSearch}
              className="btn-submit"
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Int_Etf_Filters;
