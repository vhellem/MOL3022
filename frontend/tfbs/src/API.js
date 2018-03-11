import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';

export default class TestData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrices: [],
      selectedMatrix: '',
      inputValue: '',
      background: 0.25,
    };
    this.calculatePWMMatrix = this.calculatePWMMatrix.bind(this);
    this.setSelectedMatrix = this.setSelectedMatrix.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:5000/matrices', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(results => results.json())
      .then(data => {
        console.log('test');
        console.log(data);
        const matrices = data.map(matrix => {
          return { label: matrix };
        }); //.map(entry => entry.id);
        console.log(matrices);
        this.setState({ matrices });
      });
  }
  calculatePWMMatrix() {
    fetch('http://localhost:5000/calculate', {
      method: 'POST',
      body: JSON.stringify({
        sequence: this.state.inputValue,
        matrix: 'MA0004.1',
        background: this.state.background,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(results => results.json())
      .then(data => {
        console.log(data);
      });
  }
  setSelectedMatrix(value) {
    this.setState({
      selectedMatrix: value,
    });
  }
  handleChange(e) {
    this.setState({ inputValue: e.target.value });
  }
  handleBackgroundChange(e) {
    this.setState({ background: parseFloat(e.target.value) });
  }

  render() {
    console.log(this.state.selectedMatrix);
    return (
      <div>
        <Autocomplete
          items={this.state.matrices}
          renderItem={(item, isHighlighted) =>
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.label}
            </div>}
          getItemValue={item => item.label}
          value={this.state.selectedMatrix}
          onChange={e => this.setSelectedMatrix(e.target.value)}
          onSelect={val => this.setSelectedMatrix(val)}
        />
        <div>
          <label>Skriv inn gensekvenser, separert med semikolon (;)</label>
          <textarea
            rows={20}
            cols={50}
            type="text"
            value={this.state.inputValue}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label>Skriv inn bakgrunnsfordelingen for matrisen</label>
          <input
            type="number"
            value={this.state.background}
            onChange={this.handleBackgroundChange}
          />
        </div>

        <button onClick={this.calculatePWMMatrix}>Let etter sekvens</button>
      </div>
    );
  }
}
