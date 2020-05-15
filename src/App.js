import React, { Component } from "react";
import "./App.css";
import axios from "axios";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      scores: [],
      isLoading: true,
    };
    this.gameName = "SpaceInvaders";
    this.gameTitle = "Space Invaders";
    this.backURL = "https://phv-gamescoreserver.herokuapp.com";
    this.playerID = "w2U0VHNTG4xGzugz";
  }

  componentDidMount() {
    this.loadScoresAsync().then((scores) => {
      this.setState({ scores: scores, isLoading: false });
    });
  }

  loadScoresAsync() {
    return new Promise((resolve, reject) => {
      let url = this.backURL;
      url += `/score?playerID=${this.playerID}&gameName=${this.gameName}&pageStart=0&pageLength=100`;
      axios
        .get(url)
        .then((response) => {
          const scores = response.data;
          if (scores) {
            resolve(scores);
          }
        })
        .catch((error) => {
          const message =
            error.response && error.response.data && error.response.data.message ? error.response.data.message : error;
          reject(message);
        });
    });
  }

  renderScoreLine(score, index, length) {
    if (score && score.highScore && score.rank && score.playerName && score.highStage) {
      const formatedScore = score.highScore
        .toString()
        .replace(/(\d)(?=(?:[0-9]{3})+\b)/g, "$1 ") // ajoute un espace tous les 3 caractères en partant de la fin
        .trim();
      return (
        <tr key={index} className="scores-center scores-full-width scores-height-cell text-color">
          <td className="scores-center scores-full-width scores-height-cell">{score.rank}</td>
          <td className="scores-center scores-full-width scores-height-cell">{score.playerName}</td>
          <td className="scores-center scores-full-width scores-height-cell">{formatedScore}</td>
          <td className="scores-center scores-full-width scores-height-cell">{score.highStage}</td>
          <td className="scores-center scores-full-width scores-height-cell scores-img-container">
            {score.screenshot && <img src={score.screenshot} alt="miniature" className="scores-img" />}
          </td>
        </tr>
      );
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="title text-color scores-hseparator">Scores {this.gameTitle}</div>
        {this.state.isLoading ? (
          <div className="anim-container">
            <div className="text-color">Chargement en cours...</div>
            <div className="anim-wrapper">
              <div className="anim-rotate alien1">
                <div className="anim-alienrotate">
                  <div className="anim-alien-sprite1"></div>
                </div>
              </div>
              <div className="anim-rotate alien2">
                <div className="anim-alienrotate">
                  <div className="anim-alien-sprite2"></div>
                </div>
              </div>
            </div>
          </div>
        ) : this.state.scores.length > 0 ? (
          <table className="scores-container">
            <thead className="scores-full-width">
              <tr className="scores-center scores-full-width scores-height-title text-color">
                <th className="scores-center scores-full-width scores-height-title">Classement</th>
                <th className="scores-center scores-full-width scores-height-title">Nom du joueur</th>
                <th className="scores-center scores-full-width scores-height-title">Meilleur score</th>
                <th className="scores-center scores-full-width scores-height-title">Niveau atteint</th>
                <th className="scores-center scores-full-width scores-height-title">Capture</th>
              </tr>
            </thead>
            <tbody className="scores-full-width">
              {this.state.scores.map((value, index) => {
                return this.renderScoreLine(value, index, this.state.scores.length);
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-color">Pas de scores :(</div>
        )}
      </div>
    );
  }
}
