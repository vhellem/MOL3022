import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import API from './API';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <input 
        type='text' 
        value={this.state.inputValue}
        onChange={this.handleChange.bind(this)} />
        <API></API>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ inputValue: e.target.value },
    () => console.log(this.state.inputValue)
  );
  }
}

export default App;
