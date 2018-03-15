import React, { Component } from "react";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import { Step, Stepper, StepLabel } from "material-ui/Stepper";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
import "react-select/dist/react-select.css";

export default class TestData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrices: [],
      selectedMatrix: "",
      inputValue: "",
      background: 0.25,
      stepIndex: 0,
      finished: false,
      loading: true,
      results: undefined,
      inputFieldHasError: undefined,
      backgroundFieldHasError: undefined
    };
    this.calculatePWMMatrix = this.calculatePWMMatrix.bind(this);
    this.setSelectedMatrix = this.setSelectedMatrix.bind(this);
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this);
    this.handleSequenceInputChange = this.handleSequenceInputChange.bind(this);
  }

  componentDidMount() {
    fetch("https://mol3022-backend.herokuapp.com/matrices", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(results => results.json())
      .then(data => {
        console.log("test");
        console.log(data);
        this.setState({ loading: false });
        const matrices = data.map(matrix => {
          return { label: matrix, value: matrix };
        }); //.map(entry => entry.id);
        console.log(matrices);
        this.setState({ matrices });
      });
  }

  calculatePWMMatrix() {
    this.setState({ loading: true });
    fetch("https://mol3022-backend.herokuapp.com/calculate", {
      method: "POST",
      body: JSON.stringify({
        sequence: this.state.inputValue,
        matrix: this.state.selectedMatrix.map(matrix => {
          return matrix.value;
        }),
        background: this.state.background
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(results => results.json())
      .then(data => {
        this.setState({ loading: false, results: data });
        console.log(data);
      });
  }

  setSelectedMatrix(selectedOption) {
    this.setState({ selectedMatrix: selectedOption });
  }

  handleBackgroundChange(e) {
    this.setState({
      background: e.target.value,
      backgroundFieldHasError: !/[+-]?([0-9]*[.])?[0-9]+$/.test(e.target.value)
    });
  }

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex < 2) {
      this.setState({
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2
      });
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1,
        results: undefined
      });
    }
  };

  handleSequenceInputChange(e) {
    this.setState({
      inputValue: e.target.value,
      inputFieldHasError: !/^[AaCcGgTtNn;]*$/.test(e.target.value)
    });
  }

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
                textAlign: "left"
              }}
              floatingLabelText="Skriv inn DNA-sekvens(er), separert med semikolon:"
              floatingLabelFixed={true}
              hintText=""
              multiLine={true}
              rows={1}
              rowsMax={10}
              value={this.state.inputValue}
              onChange={this.handleSequenceInputChange}
              fullWidth={true}
              errorText={
                this.state.inputFieldHasError && "Ugyldig tegn i sekvens."
              }
            />
          </div>
        );
      case 2:
        return (
          <TextField
            style={{
              textAlign: "left"
            }}
            floatingLabelText="Velg ønsket bakgrunnsfordeling:"
            floatingLabelFixed={true}
            value={this.state.background}
            onChange={this.handleBackgroundChange}
            errorText={
              this.state.backgroundFieldHasError &&
              "Ugyldig bakgrunnsfordeling."
            }
          />
        );
      default:
        return "-";
    }
  }

  render() {
    let sequences = this.state.inputValue;
    if (sequences.indexOf(";") !== -1) {
      sequences = sequences.split(";");
    } else {
      sequences = [sequences];
    }

    const graph = this.state.results
      ? Object.keys(this.state.results).map((key, index) => {
          return this.state.results[key].map((array, index) => {
            return (
              <div>
                <p>
                  Resultat for om binding "{key}" eksisterer i sekvens "{
                    sequences[index]
                  }"
                </p>
                <Bar
                  options={{
                    legend: {
                      display: true
                    },
                    scales: {
                      xAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Weeks"
                          }
                        }
                      ],
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Lalala"
                          }
                        }
                      ]
                    }
                  }}
                  data={{
                    labels: array.map((_, index) => index),
                    datasets: [
                      {
                        backgroundColor: "rgba(31,188,209,0.2)",
                        data: array
                      }
                    ]
                  }}
                  width={100}
                  height={100}
                  options={{
                    legend: {
                      display: false
                    },
                    maintainAspectRatio: false,
                    scales: {
                      xAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Posisjon"
                          }
                        }
                      ],
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "Verdi"
                          }
                        }
                      ]
                    }
                  }}
                />
              </div>
            );
          });
        })
      : null;

    const { finished, stepIndex } = this.state;
    const contentStyle = {
      margin: "0 16px"
    };
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          margin: "auto"
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
          {finished ? (
            <p>
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
          ) : (
            <div>
              {this.getStepContent(stepIndex)}
              <div
                style={{
                  marginTop: 12
                }}
              >
                <FlatButton
                  label="Tilbake"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={{
                    marginRight: 12
                  }}
                />
                <RaisedButton
                  label={stepIndex === 2 ? "Let etter sekvens" : "Neste"}
                  primary={true}
                  onClick={
                    stepIndex === 2 ? this.calculatePWMMatrix : this.handleNext
                  }
                />
              </div>
            </div>
          )}
        </div>
        <div>{graph}</div>
        <div>{graph}</div>
      </div>
    );
  }
}
