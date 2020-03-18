import React, { Component } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Excel_Filters from "../../components/Excel_Filters";
import { uploadData, hideUP } from "../../actions";
import LoadingHeader from "../../components/LoadingHeader";

const baseStyle = {
  width: 200,
  height: 200,
  borderWidth: 2,
  borderColor: "#666",
  borderStyle: "solid",
  borderRadius: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
const activeStyle = {
  borderStyle: "solid",
  borderColor: "#6c6",
  backgroundColor: "#eee"
};
const rejectStyle = {
  borderStyle: "solid",
  borderColor: "#c66",
  backgroundColor: "#eee"
};

class ExcelUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      csvCategory: "",
      upType: "",
      apiLoading: false,
      categoryError: false
    };
    this.onDrop = this.onDrop.bind(this);
    this.submitCategory = this.submitCategory.bind(this);
  }

  async componentDidMount() {
    //this.showSuccess('inserted');
    const res = await fetch("https://swapi.co/api/people/1/");
    const json = res.json();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      apiLoading: newProps.browser.apiLoading,
      showUP: newProps.files.showUP
    });
  }

  onDrop(files) {
    this.setState({
      files: files
    });
  }

  submitCategory(data) {
    console.log(data);
    this.setState({
      csvCategory: data.csvCategory,
      upType: data.upType
    });

    if (
      this.state.files.length &&
      data.csvCategory.length &&
      data.upType.length
    ) {
      this.setState({
        categoryError: false
      });

      let formData = new FormData();
      formData.append("sheet", this.state.files[0]);

      this.props.uploadData(data, formData);
    }
  }

  renderErrorMsg() {
    if (this.state.categoryError) {
      return (
        <div className="error-container">
          <span className="error-msg">
            Please select categories for upload and a file for upload
          </span>
        </div>
      );
    }
  }

  showUP(uploadState) {
    console.log("should show toast");
    //const UPtoast = ()=><div className="toast-up">Successfully loaded documents!</div>

    toast.success("Successfully loaded documents!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: false,
      onClose: this.props.hideUP()
    });
  }

  render() {
    return (
      <div className="section-flow">
        <div className="filter-container">
          <Excel_Filters submitCategory={this.submitCategory} />
          {this.renderErrorMsg()}
        </div>
        <div className="csv-container">
          {
            <LoadingHeader
              dataLength={this.state.files.length}
              apiLoading={this.state.apiLoading}
              showInstructions={false}
            />
          }
          <h1>Excel upload</h1>
          <Dropzone onDrop={this.onDrop}>
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
              acceptedFiles,
              rejectedFiles
            }) => {
              return (
                <div {...getRootProps()} style={baseStyle}>
                  <input {...getInputProps()} />
                  <div>{isDragAccept ? "Drop" : "Drag"} files here...</div>
                  {isDragReject && <div>Unsupported file type...</div>}
                </div>
              );
            }}
          </Dropzone>
          <aside>
            <ul className="filelist">
              {this.state.files.map(f => (
                <li key={f.name}>
                  {f.name} - {f.size} bytes
                </li>
              ))}
            </ul>
          </aside>
          {this.state.showUP ? this.showUP() : ""}
          <ToastContainer autoClose={8000} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  browser: state.browser,
  files: state.files
});

export default connect(
  mapStateToProps,
  { uploadData, hideUP }
)(ExcelUpload);
