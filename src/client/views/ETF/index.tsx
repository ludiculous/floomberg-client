import React, { Component, MouseEvent } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { connect } from "react-redux";
import ETF_Filters from "../../components/ETF_Filters";
import { Columns, msColumns } from "../../components/ETF_models";
import LoadingHeader from "../../components/LoadingHeader";
import { ToastContainer, toast } from "react-toastify";
import {
  getEtfFlowMScat,
  getEtfFlowTicker,
  getEtfFlowAsset,
  getEtfTickerList,
  getEtfAssetList,
  getEtfMsCatList,
  exportData,
  hideDL
} from "../../actions";

interface isState {
  etfs: any[];
  etfCategory: string;
  apiLoading: boolean;
  showDL: boolean;
  tableData: any;
}

interface IProps {}

class ETF extends Component<IProps, isState> {
  state: isState;

  constructor(props: any) {
    super(props);
    this.state = {
      etfs: [],
      etfCategory: "",
      apiLoading: false,
      showDL: false,
      tableData: {}
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  async componentDidMount() {
    // show toast
    if (this.props.etfs.etfTickerList.length < 1) {
      let etfList = await this.props.getEtfTickerList();
    }
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    let self = this;
    this.setState({
      etfs: newProps.etfs.etfData,
      apiLoading: newProps.browser.apiLoading,
      filename: newProps.files.filename,
      showDL: newProps.files.showDL
    });
  }

  handleSearch(data) {
    console.log("searching:", data);
    const base_url = "api/getEtfFlow";
    let qs = `${base_url}`;
    let self = this;
    if (data) {
      let tableData = {};

      switch (data.etfCategory) {
        case "Ticker":
          tableData.header = data.tickerSymbol;
          this.props.getEtfFlowTicker(data);
          break;

        case "Morning Star":
          tableData.header = data.msCategory;
          this.props.getEtfFlowMScat(data);
          break;

        case "Asset":
          tableData.header = data.assetCategory;
          this.props.getEtfFlowAsset(data);
          break;
      }

      this.setState({
        etfCategory: data.etfCategory,
        etfs: [],
        tableData: tableData
      });
    }
  }

  handleExport() {
    console.log("exporting data");
    let data = this.state.etfs;
    let category = this.state.etfCategory;
    this.props.exportData(data, category);
    // grab the current states etf and send to a specific route
  }

  showDL() {
    console.log("showing dl");
    console.log(this.props.fileurl);
    const base_url = window.location.origin;
    const url = `${base_url}/api/downloadExcel?filename=${this.state.filename}`;
    const DLtoast = () => (
      <div className="toast-dl">
        <a href={url} download>
          Download Excel File
        </a>
      </div>
    );

    const options = {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT,
      onClose: this.props.hideDL()
    };

    toast(<DLtoast />, options);
  }

  renderInstructions() {
    return (
      <p className="view-instructions">
        Select an option from ETF category drop down to start a data query
      </p>
    );
  }

  renderTable() {
    console.log(this.state.tableData);

    return this.state.etfs.length > 0 &&
      this.state.tableData.hasOwnProperty("header")
      ? this.state.etfs.map((documents, i) => {
          let docData = documents.docs;
          let headerLabel = documents.category;
          console.log(headerLabel);

          let cols = [];

          if (
            this.state.etfCategory !== "Ticker" &&
            this.state.etfCategory !== ""
          ) {
            cols = Object.assign({}, msColumns.columns[0], {
              Header: headerLabel
            });
          } else {
            cols = Object.assign({}, Columns.columns[0], {
              Header: headerLabel
            });
            console.log(this.state.tableData.header[i]);
          }
          console.log(cols);
          return <ReactTable data={docData} key={i} columns={[cols]} />;
        })
      : "";
  }

  render() {
    return (
      <div className="section-flow">
        <div className="filter-container">
          {this.props.etfs.etfTickerList.length > 0 && (
            <ETF_Filters
              handleSearch={this.handleSearch}
              etfTickerList={this.props.etfs.etfTickerList}
            />
          )}

          {this.state.etfs.length ? (
            <button className="btn-export" onClick={this.handleExport}>
              Export data to excel
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="table-container">
          {
            <LoadingHeader
              dataLength={this.state.etfs.length}
              apiLoading={this.state.apiLoading}
              showInstructions={true}
            />
          }
          {this.props.etfs.etfTickerList.length > 0 && this.renderTable()}
          {this.state.showDL ? this.showDL() : ""}
          <ToastContainer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authentication: state.auth,
  etfs: state.etfs,
  browser: state.browser,
  files: state.files
});

export default connect(
  mapStateToProps,
  {
    exportData,
    hideDL,
    getEtfFlowMScat,
    getEtfFlowTicker,
    getEtfFlowAsset,
    getEtfTickerList,
    getEtfAssetList,
    getEtfMsCatList
  }
)(ETF);
