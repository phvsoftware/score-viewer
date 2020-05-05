import React, { Component } from "react";
import "./App.css";
import axios from "axios";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      scores: [],
    };
    this.gameName = "SpaceInvaders";
    this.playerKey = "::SpaceInvaders::PlayerID";
    this.backURL = "https://phv-gamescoreserver.herokuapp.com";
    this.playerID = "";
  }

  componentDidMount() {
    this.playerID = this.loadPlayerID();
    this.loadScoresAsync().then((scores) => {
      this.setState({ scores: scores });
    });
  }

  loadPlayerID() {
    const id = localStorage.getItem(this.playerKey);
    if (id && id !== "undefined") {
      return id;
    } else {
      return "";
    }
  }

  loadScoresAsync() {
    return new Promise((resolve, reject) => {
      let url = this.backURL;
      if (this.playerID) {
        url += `/score?playerID=${this.playerID}&gameName=${this.gameName}&pageStart=0&pageLength=100`;
        axios
          .get(url)
          .then((response) => {
            const scores = response.data;
            if (scores) {
              console.log("nb scores", scores.length);
              resolve(scores);
            }
          })
          .catch((error) => {
            const message =
              error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error;
            reject(message);
          });
      }
    });
  }

  renderScoreLine(score, index, length) {
    return (
      <tr key={index} className="scores-center scores-full-width scores-height-cell text-color">
        <td className="scores-center scores-full-width scores-height-cell">{score.rank}</td>
        <td className="scores-center scores-full-width scores-height-cell">{score.playerName}</td>
        <td className="scores-center scores-full-width scores-height-cell">{score.highScore}</td>
        <td className="scores-center scores-full-width scores-height-cell">{score.highStage}</td>
        <td className="scores-center scores-full-width scores-height-cell scores-img-container">
          {score.screenshot && <img src={score.screenshot} alt="miniature" className="scores-img" />}
        </td>
      </tr>
    );
  }

  render() {
    return (
      <div className="app">
        {/* scores */}
        <div className="title text-color">Scores</div>
        {this.state.scores.length > 0 ? (
          <table className="scores-container">
            <thead className="scores-full-width">
              <tr className="scores-center scores-full-width scores-height-title text-color">
                <th className="scores-center scores-full-width scores-height-title">Rang</th>
                <th className="scores-center scores-full-width scores-height-title">Nom du joueur</th>
                <th className="scores-center scores-full-width scores-height-title">Meilleur score</th>
                <th className="scores-center scores-full-width scores-height-title">Niveau atteint</th>
                <th className="scores-center scores-full-width scores-height-title">Capture</th>
              </tr>
            </thead>
            {this.state.scores.map((value, index) => {
              return <>{this.renderScoreLine(value, index, this.state.scores.length)}</>;
            })}
          </table>
        ) : (
          <div className="text-color">Chargement en cours...</div>
        )}
        {/* badge */}
        <div className="title text-color">Badge</div>
        <div className="badge-container">
          <a href="https://phv-spaceinvaders.netlify.app/">
            <img
              border="0"
              alt="Space Invaders"
              src={`https://phv-gamescoreserver.herokuapp.com/get_badge?playerID=tGDIfkzc0PDK7Fl6&gameName=${this.gameName}`}
              width="350"
              height="140"
            />
          </a>
        </div>
      </div>
    );
  }
}
