import React, { Component } from "react";
import Int_Etf_Filters from "../../components/Int_Etf_Filters";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Columns, intEtfColumns } from "../../components/Int_Etf_models";
import LoadingHeader from "../../components/LoadingHeader";
import { ToastContainer, toast } from "react-toastify";
import {
  getIntEtfFlow,
  exportData,
  hideDL,
  getIntEtfTickerList,
  getIntEtfCatList
} from "../../actions";

class IntETF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intEtfs: [],
      intetfCategory: "",
      apiLoading: false,
      showDL: false
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  async componentDidMount() {
    if (this.props.intetfs.intEtfTickerList.length < 1) {
      let intEtfList = await this.props.getIntEtfTickerList();
    }
    // if(this.props.intetfs.intEtfTickerList.length < 1 && !localStorage.hasOwnProperty('IntEtfTickerList')) {

    //   localStorage.setItem('IntEtfTickerList', intEtfList);
    //   console.log(intEtfList)
    // } else {
    //   let intEtfList = localStorage.getItem('intEtfList').split(',');
    //   this.setState({
    //     intEtfs: intEtfList,
    //     apiLoading: false
    //   })
    // }
    // console.log(this.props.intetfs)
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps.intetfs);

    this.setState({
      intEtfs: newProps.intetfs.intEtfData,
      apiLoading: newProps.browser.apiLoading,
      filename: newProps.files.filename,
      showDL: newProps.files.showDL
    });
  }

  handleSearch(data) {
    console.log(data);
    if (data) {
      this.props.getIntEtfFlow(data);
      this.setState({
        intetfCategory: data.intetfCategory,
        intEtfs: []
      });
    }
  }

  handleExport() {
    console.log("exporting data");
    let data = this.state.intEtfs;
    let category = this.state.intetfCategory;
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

    return toast(<DLtoast />, options);
  }

  renderTable() {
    return this.state.intEtfs.length > 0
      ? this.state.intEtfs.map((documents, i) => {
          console.log(documents);
          let docsData = documents.docs;
          let headerLabel = documents.category;
          console.log(headerLabel);
          let cols = [];

          if (
            this.state.intetfCategory !== "Ticker" &&
            this.state.intetfCategory !== ""
          ) {
            cols = Object.assign({}, intEtfColumns.columns[0], {
              Header: headerLabel
            });
          } else {
            cols = Object.assign({}, Columns.columns[0], {
              Header: headerLabel
            });
          }

          return <ReactTable data={docsData} key={i} columns={[cols]} />;
        })
      : "";
  }
  render() {
    return (
      <div className="section-flow">
        <div className="filter-container">
          {this.props.intetfs.intEtfTickerList.length > 1 && (
            <Int_Etf_Filters
              handleSearch={this.handleSearch}
              handleExport={this.handleExport}
              intEtfTickerList={this.props.intetfs.intEtfTickerList}
            />
          )}
          {this.state.intEtfs.length ? (
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
              apiLoading={this.state.apiLoading}
              dataLength={this.state.intEtfs.length}
              showInstructions={true}
            />
          }
          {this.renderTable()}
          {this.state.showDL ? this.showDL() : ""}
          <ToastContainer autoClose={8000} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  intetfs: state.intetfs,
  browser: state.browser,
  files: state.files
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      exportData,
      hideDL,
      getIntEtfFlow,
      getIntEtfTickerList,
      getIntEtfCatList
    }
  )(IntETF)
);
