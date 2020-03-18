import React, { Component } from 'react'
import {PulseLoader} from 'halogenium';

class LoadingHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apiLoading: this.props.apiLoading,
      dataLength: this.props.dataLength
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      apiLoading: newProps.apiLoading,
      dataLength: newProps.dataLength
    },()=>{
      console.log(this.state)
    })
  }

  renderInstructions() {
    return (
      <p className="view-instructions">

        {this.props.showInstructions && "Select an option from the category drop down to start a data query"}
      </p>
    )
  }

  render () {
    return (
      <div>
        {this.state.apiLoading && <PulseLoader color="#7B7F8B" size="16px" margin="4px"/> }
        {this.state.dataLength < 1 && this.renderInstructions()}
      </div>
    )
  }
}

export default LoadingHeader