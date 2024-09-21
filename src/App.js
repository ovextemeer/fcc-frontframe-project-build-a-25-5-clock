import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpLong,
  faDownLong,
  faPlay,
  faPause,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerRunning: true,
      timerId: undefined,
      timerType: true,
      timer: 1500,
    };

    this.beepRef = React.createRef();

    this.reset = this.reset.bind(this);
    this.decreaseBreak = this.decreaseBreak.bind(this);
    this.increaseBreak = this.increaseBreak.bind(this);
    this.decreaseSession = this.decreaseSession.bind(this);
    this.increaseSession = this.increaseSession.bind(this);
    this.startStop = this.startStop.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timerRunning !== this.state.timerRunning) {
      if (this.state.timerRunning) {
        clearInterval(this.state.timerId);

        this.setState((state) => ({ ...state, timerId: undefined }));
      } else {
        const intervalId = setInterval(() => {
          this.setState((state) => ({ ...state, timer: state.timer - 1 }));
        }, 1000);

        this.setState((state) => ({ ...state, timerId: intervalId }));
      }
    }

    if (
      this.state.timer === 0 &&
      prevState.timerRunning === this.state.timerRunning
    ) {
      this.setState((state) => ({
        ...state,
        timerRunning: !state.timerRunning,
      }));
    }

    if (
      this.state.timer === 0 &&
      prevState.timerRunning !== this.state.timerRunning
    ) {
      this.setState((state) => ({
        ...state,
        timerRunning: !state.timerRunning,
        timerType: !state.timerType,
        timer: state.timerType
          ? state.breakLength * 60
          : state.sessionLength * 60,
      }));
      this.beepRef.current.play();
    }
  }

  reset() {
    this.setState((state) => ({
      ...state,
      breakLength: 5,
      sessionLength: 25,
      timerType: true,
      timer: 1500,
      timerRunning: true,
    }));

    setTimeout(
      () => {
        this.beepRef.current.pause();
        this.beepRef.current.currentTime = 0;
      },
      this.beepRef.current.currentTime >= 1
        ? 0
        : 1000 - this.beepRef.current.currentTime * 1000
    );
  }

  decreaseBreak() {
    this.setState((state) => ({
      ...state,
      breakLength: state.breakLength - 1 <= 0 ? 1 : state.breakLength - 1,
      timer:
        state.timerId !== undefined
          ? state.timer
          : state.timerType
          ? state.sessionLength * 60
          : (state.breakLength - 1 <= 0 ? 1 : state.breakLength - 1) * 60,
    }));
  }

  increaseBreak() {
    this.setState((state) => ({
      ...state,
      breakLength: state.breakLength + 1 > 60 ? 60 : state.breakLength + 1,
      timer:
        state.timerId !== undefined
          ? state.timer
          : state.timerType
          ? state.sessionLength * 60
          : (state.breakLength + 1 > 60 ? 60 : state.breakLength + 1) * 60,
    }));
  }

  decreaseSession() {
    this.setState((state) => ({
      ...state,
      sessionLength: state.sessionLength - 1 <= 0 ? 1 : state.sessionLength - 1,
      timer:
        state.timerId !== undefined
          ? state.timer
          : state.timerType
          ? (state.sessionLength - 1 <= 0 ? 1 : state.sessionLength - 1) * 60
          : state.breakLength * 60,
    }));
  }

  increaseSession() {
    this.setState((state) => ({
      ...state,
      sessionLength:
        state.sessionLength + 1 > 60 ? 60 : state.sessionLength + 1,
      timer:
        state.timerId !== undefined
          ? state.timer
          : state.timerType
          ? (state.sessionLength + 1 > 60 ? 60 : state.sessionLength + 1) * 60
          : state.breakLength * 60,
    }));
  }

  startStop() {
    this.setState((state) => ({ ...state, timerRunning: !state.timerRunning }));
  }

  render() {
    return (
      <div className="App">
        <div className="LengthSetting">
          <div className="Break">
            <div id="break-label">Break Length</div>
            <div className="LengthControls">
              <FontAwesomeIcon
                icon={faDownLong}
                id="break-decrement"
                onClick={this.decreaseBreak}
              />
              <span id="break-length">{this.state.breakLength}</span>
              <FontAwesomeIcon
                icon={faUpLong}
                id="break-increment"
                onClick={this.increaseBreak}
              />
            </div>
          </div>
          <div className="Session">
            <div id="session-label">Session Length</div>
            <div className="LengthControls">
              <FontAwesomeIcon
                icon={faDownLong}
                id="session-decrement"
                onClick={this.decreaseSession}
              />
              <span id="session-length">{this.state.sessionLength}</span>
              <FontAwesomeIcon
                icon={faUpLong}
                id="session-increment"
                onClick={this.increaseSession}
              />
            </div>
          </div>
        </div>
        <div className="Timer">
          <div id="timer-label">
            {this.state.timerType ? "Session" : "Break"}
          </div>
          <div id="time-left">{`${(
            "0" +
            (this.state.timer - (this.state.timer % 60)) / 60
          ).slice(-2)}:${("0" + (this.state.timer % 60)).slice(-2)}`}</div>
          <audio
            ref={this.beepRef}
            id="beep"
            preload="auto"
            src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
        <div className="Controls">
          <FontAwesomeIcon
            icon={this.state.timerId === undefined ? faPlay : faPause}
            id="start_stop"
            onClick={this.startStop}
          />
          <FontAwesomeIcon icon={faRotate} id="reset" onClick={this.reset} />
        </div>
      </div>
    );
  }
}
