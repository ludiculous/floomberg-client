import React, { Component } from 'react'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Future_Filters from '../../components/Future_Filters.js';
import { connect } from 'react-redux';
import {
  getFuturesExpList,
  getFuturesCatList,
  getFuturesContract,
  getFuturesAggregation,
  getFuturesSummation,
  exportData,
  hideDL
} from '../../actions';
import { Columns } from '../../components/Future_models.js';
import LoadingHeader from '../../components/LoadingHeader';
import { withRouter } from "react-router-dom";
import {ToastContainer, toast } from 'react-toastify';

class Futures extends Component {
  constructor(props) {
    super(props);

    this.state = {
      futures: [],
      futuresCategory: '',
      expirationList: [],
      categoryList: [],
      apiLoading: false,
      showDL: false,
      redirectMsg: '',
      redirected: false,
      tableData: {}
    }
    this.addCategory = this.addCategory.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  componentDidMount() {
    console.log(this.props.getFuturesExpList)
    console.log(this.props)
    if(this.props.history.action === "REPLACE") {
      this.setState({redirectMsg: this.props.history.location.state.login_msg},()=>console.log(this.state))
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      futures: newProps.futures.futureData,
      apiLoading: newProps.browser.apiLoading,
      filename: newProps.files.filename,
      showDL: newProps.files.showDL
    },()=>console.log(this.state))
  }

  componentWillMount(newProps) {

  }

  addCategory(category) {
    this.state['category'] = category;
  }

  addFilter(filter) {
    Object.assign(this.state, filter);
  }

  handleSearch(data) {
    console.log(data)
    if(data) {
      let tableData = {};
      switch (data.futuresCategory) {
        case 'contract':
          console.log("getting contract")
          if(data.category.length) {
            tableData.header = data.contract;
            this.props.getFuturesContract(data)
          }
          break;
        case 'summation':
          if(data.category.length) {
            tableData.header = data.category;
            this.props.getFuturesSummation(data);
          }
          break;
        case 'aggregation':
          if(data.aggregation.length) {
            tableData.header = data.aggregation;
            this.props.getFuturesAggregation(data)
          }
          break;
      }
      this.setState({
        futuresCategory: data.futuresCategory,
        tableData: tableData
      })
    }
  }

  handleExport() {
    console.log('exporting data')
    let data = this.state.futures;
    let category = this.state.futuresCategory;
    this.props.exportData(data, category);
    // grab the current states etf and send to a specific route
  }

  showDL() {
    console.log("showing dl")
    console.log(this.props.fileurl)
    const base_url = window.location.origin
    const url = `${base_url}/api/downloadExcel?filename=${this.state.filename}`
    const DLtoast = ()=><div className="toast-dl"><a href={url} download>Download Excel File</a></div>

    const options = {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT,
      onClose: this.props.hideDL()
    }

    toast(<DLtoast />, options)
  }

  showRM() {
    const RMtoast = ()=> {
      return (
        <div className="toast-rm">
          <p>{this.state.redirectMsg}</p>
        </div>
      )
    }
    const options = {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT,
    }

    this.setState({redirected: true})
    toast(<RMtoast />, options)
  }

  renderTable() {
    {
      return this.state.futures.length > 0 && this.state.tableData.hasOwnProperty('header') ? this.state.futures.map((documents, i)=>{
        let docData = documents.docs
        let cols = {}
        if(this.state.futuresCategory === "contract") {
          let exp_date = () => {
            let date = new Date(docData[i].exp_d);
            return (date.getMonth() + 1)
              + '/' + date.getDate()
              + '/' +  date.getFullYear();
          }

          cols = Object.assign({},  Columns[this.state.futuresCategory]['columns'][0] , {Header: exp_date});
        } else {
          let title = this.state.futuresCategory
          cols = Object.assign({},  Columns[this.state.futuresCategory]['columns'][0] , {Header: this.state.tableData.header[i]});
        }

        return (
          <ReactTable
            data={docData}
            key={i}
            columns={[cols]}
          />
        )
      }) : ''
    }
  }

  render() {
    return (
      <div className="section-flow">
          <div className='filter-container'>
            <Future_Filters
              expirationDates={this.props.futures.futureExpirationList}
              getExpList={this.props.getFuturesExpList}
              handleSearch={this.handleSearch}
            />

            {this.state.futures.length ? <button className="btn-export" onClick={this.handleExport}>Export data to excel</button> : ''}
          </div>

          <div className='table-container'>
          {<LoadingHeader apiLoading={this.state.apiLoading} dataLength={this.state.futures.length} showInstructions={true}/>}
          {this.renderTable()}
          {this.state.showDL ? this.showDL() : ''}
          {this.state.redirectMsg && !this.state.redirected ? this.showRM() : ''}
          <ToastContainer/>
          </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  futures: state.futures,
  browser: state.browser,
  files: state.files,
  auth: state.auth
})

export default withRouter(connect(mapStateToProps, {
  getFuturesExpList,
  getFuturesCatList,
  getFuturesContract,
  getFuturesAggregation,
  getFuturesSummation,
  exportData,
  hideDL
})(Futures));
