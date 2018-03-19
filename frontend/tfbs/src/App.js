import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./App.css";
import API from "./API";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">SimpleTFBS</h1>
        </header>
        <div className="content">
          <MuiThemeProvider>
            <API />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default App;
