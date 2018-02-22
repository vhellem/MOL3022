import React, { Component } from 'react';

export default class TestData extends Component {
  constructor(props) {
    super(props);
    this.state = { matrices: [] };
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
          const matrices = data.map(entry => entry.id);
          this.setState( {matrices} );
        })
      }

    render() {
      return (
        <div>
          {this.state.matrices}
        </div>
      );
    }
}
