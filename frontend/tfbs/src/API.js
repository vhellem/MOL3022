import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';

export default class TestData extends Component {
  constructor(props) {
    super(props);
    this.state = { matrices: [],
                    selectedMatrix: ""};
    this.calculatePWMMatrix = this.calculatePWMMatrix.bind(this);
    this.setSelectedMatrix = this.setSelectedMatrix.bind(this);
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
          const matrices = data.map(matrix => {
              return {label: matrix}
          });//.map(entry => entry.id);
        console.log(matrices);
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
      setSelectedMatrix(value){
        this.setState({
            selectedMatrix: value,
        })
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
            </div>

  }
           getItemValue={(item) => item.label}
            value={this.state.selectedMatrix}
            onChange={(e) => this.setSelectedMatrix(e.target.value)}
            onSelect={(val) => this.setSelectedMatrix(val)}

          />



          <button onClick={this.calculatePWMMatrix}>
            Let etter sekvens
          </button>
        </div>
      );
    }
}
