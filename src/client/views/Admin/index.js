import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ExcelUpload from "../../views/ExcelUpload";

class Admin extends Component {
  renderTabs() {
    return (
      <Tabs forceRenderTabPanel defaultIndex={1}>
        <TabList>
          <Tab>Excel Upload</Tab>
          <Tab>Users</Tab>
        </TabList>
        <TabPanel>
          <ExcelUpload />
        </TabPanel>

        <TabPanel>
          <Tabs forceRenderTabPanel>Users</Tabs>
        </TabPanel>
      </Tabs>
    );
  }

  render() {
    return <div className="section-flow">{this.renderTabs()}</div>;
  }
}

export default Admin;
