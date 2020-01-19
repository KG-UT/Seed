import React from "react";

import { AppBar, Tabs, Tab, Typography, Box } from "@material-ui/core";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCharities: false,
      showProgress: false,
      showSettings: false
    };
  }
  render() {
    return (
      <div>
        <AppBar position="fixed">
          <Tabs aria-label="simple tabs example" centered variant="fullWidth">
            <Tab
              label="Charities"
              onClick={() => {
                this.setState({
                  showCharities: true,
                  showProgress: false,
                  showSettings: false
                });
              }}
            />
            <Tab
              label="Progress"
              onClick={() => {
                this.setState({
                  showCharities: false,
                  showProgress: true,
                  showSettings: false
                });
              }}
            />
            <Tab
              label="Settings"
              onClick={() => {
                this.setState({
                  showCharities: false,
                  showProgress: false,
                  showSettings: true
                });
              }}
            />
          </Tabs>
        </AppBar>
        {this.state.showCharities && <h1>charities</h1>}
        {this.state.showProgress && <h1>progress</h1>}
        {this.state.showSettings && <h1>setting</h1>}
      </div>
    );
  }
}

export default Dashboard;
