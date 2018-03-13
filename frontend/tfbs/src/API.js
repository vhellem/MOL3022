import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class TestData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrices: [],
      selectedMatrix: '',
      inputValue: '',
      background: 0.25,
      stepIndex: 0,
      finished: false,
      loading: true,
      results: null,
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
        this.setState({
          loading: false,
        });
        const matrices = data.map(matrix => {
          return { label: matrix, value: matrix };
        }); //.map(entry => entry.id);
        console.log(matrices);
        this.setState({ matrices });
      });
  }
  calculatePWMMatrix() {
    this.setState({
      loading: true,
    });
    fetch('http://localhost:5000/calculate', {
      method: 'POST',
      body: JSON.stringify({
        sequence: this.state.inputValue,
        matrix: this.state.selectedMatrix.map(matrix => {
          return matrix.value;
        }),
        background: this.state.background,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(results => results.json())
      .then(data => {
        this.setState({
          loading: false,
          results: data,
        });
        console.log(data);
      });
  }

  setSelectedMatrix(selectedOption) {
    this.setState({ selectedMatrix: selectedOption });
  }

  handleChange(e) {
    this.setState({
      inputValue: e.target.value,
    });
  }

  handleBackgroundChange(e) {
    this.setState({
      background: e.target.value,
    });
  }

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex < 2) {
      this.setState({
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      });
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1,
      });
    }
  };

  getStepContent(stepIndex) {
    if (this.state.loading) {
      return <h3>Laster inn data</h3>;
    }
    switch (stepIndex) {
      case 0:
        const { selectedMatrix } = this.state;
        return (
          <Select
            name="select matrix"
            value={selectedMatrix}
            onChange={this.setSelectedMatrix}
            options={this.state.matrices}
            multi={true}
          />
        );
      case 1:
        return (
          <div>
            <TextField
              style={{
                textAlign: 'left',
              }}
              floatingLabelText="Skriv inn DNA-sekvens(er):"
              floatingLabelFixed={true}
              hintText=""
              multiLine={true}
              rows={1}
              rowsMax={10}
              value={this.state.inputValue}
              onChange={this.handleChange}
            />
          </div>
        );
      case 2:
        return (
          <TextField
            style={{
              textAlign: 'left',
            }}
            floatingLabelText="Velg ønsket bakgrunnsfordeling:"
            floatingLabelFixed={true}
            value={this.state.background}
            onChange={this.handleBackgroundChange}
          />
        );
      default:
        return '-';
    }
  }

  render() {
    const { finished, stepIndex } = this.state;
    const contentStyle = {
      margin: '0 16px',
    };
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 700,
          margin: 'auto',
        }}
      >
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Matrise</StepLabel>
          </Step>
          <Step>
            <StepLabel>DNA-sekvens</StepLabel>
          </Step>
          <Step>
            <StepLabel>Bakgrunnsfordeling</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished
            ? <p>
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    this.setState({ stepIndex: 0, finished: false });
                  }}
                >
                  Click here
                </a>
                to reset the example.
              </p>
            : <div>
                {this.getStepContent(stepIndex)}
                <div
                  style={{
                    marginTop: 12,
                  }}
                >
                  <FlatButton
                    label="Tilbake"
                    disabled={stepIndex === 0}
                    onClick={this.handlePrev}
                    style={{
                      marginRight: 12,
                    }}
                  />
                  <RaisedButton
                    label={stepIndex === 2 ? 'Let etter sekvens' : 'Neste'}
                    primary={true}
                    onClick={
                      stepIndex === 2
                        ? this.calculatePWMMatrix
                        : this.handleNext
                    }
                  />
                </div>
              </div>}
        </div>
      </div>
    );
  }
}
