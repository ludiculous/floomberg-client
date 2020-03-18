import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currNode: ""
    };
  }

  componentDidMount() {
    this.selectActive(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.selectActive(newProps);
  }

  selectActive(props) {
    let location = props.location.pathname;
    let pathName = location.split("/")[1];
    let listItem = this.refs[pathName];

    if (this.state.currNode !== listItem && this.state.currNode !== "") {
      listItem.children[0].style.color = "white";
      this.state.currNode.children[0].style.color = "#7b7f8b";
      this.setState({ currNode: listItem });
    } else if (location === "/") {
      return;
    } else {
      listItem.children[0].style.color = "white";
      this.setState({ currNode: listItem });
    }
  }

  render() {
    return (
      <div>
        <header>
          <nav>
            <ul className="header-wrapper">
              <li className="header-item" ref="etf">
                <Link to="/etf">ETF Flows</Link>
              </li>
              <li className="header-item" ref="intetf">
                <Link to="/intetf">International ETF Flows</Link>
              </li>
              <li className="header-item" ref="excel">
                <Link to="/excel">Excel Upload</Link>
              </li>
              <li className="header-item header-auth" ref="login">
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    );
  }
}

export default Header;
