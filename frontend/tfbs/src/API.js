import React, { Component } from 'react';

export default class TestData extends Component {
  constructor(props) {
    super(props);
    this.state = { matrices: [] };
    this.calculatePWMMatrix = this.calculatePWMMatrix.bind(this);
  }

    componentDidMount() {
      fetch('http://localhost:5000/matrices', {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      })
        .then(results => results.json())
        .then(data => {
          console.log('test');
          console.log(data);
          const matrices = data;//.map(entry => entry.id);
          this.setState( {matrices} );
        })
      }
      calculatePWMMatrix() {
        fetch('http://localhost:5000/calculate', {
          method: "POST",
          body: JSON.stringify({
            sequence: "agtCACGTGttcc",
            matrix: 'MA0004.1',
          }),
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            }
        }).then(results=>results.json())
            .then(data=>{
              console.log(data);
            })
      }

    render() {
    console.log(this.state.matrices);
      return (
        <div>
          {this.state.matrices}
          <button onClick={this.calculatePWMMatrix}>
            Let etter sekvens
          </button>
        </div>
      );
    }
}
