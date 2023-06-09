import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [gameList, setGameList] = useState([]);
  const [playerData, setPlayerData] = useState({});
  const [mostPlayedData, setMostPlayedData] = useState({});

  // Récupération des parties du joueur grâce au proxy
  function getPlayerGames(event) {
    axios
      .get("http://localhost:4000/past5Games", {
        params: { username: searchText },
      })
      .then(function (response) {
        setGameList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Récupération du profil du joueur grâce au proxy
  function getPlayerDatas(event) {
    axios
      .get("http://localhost:4000/playerProfile", {
        params: { username: searchText },
      })
      .then(function (response) {
        setPlayerData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Récupération des champions les plus joués grâce au proxy
  function getMostPlayed(event) {
    axios
      .get("http://localhost:4000/mostPlayed", {
        params: { username: searchText },
      })
      .then(function (response) {
        setMostPlayedData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Affichage de toutes les informations
  return (
    <div className="App">
      <h2>Welcome to our proxy</h2>
      <input
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
      ></input>
      <button
        onClick={() => {
          // On lance les fonctions quand on clique sur le bouton de recherche
          getPlayerDatas();
          getPlayerGames();
          getMostPlayed();
        }}
      >
        Search
      </button>
      <>
        <h2>Profil</h2>
        <div class="profile">
          {JSON.stringify(playerData) !== "{}" ? (
            // Affichage des informations de profile. L'icone est récupéré grâce à la banque de donnée de riot games sur l'url ddragon.
            // La version la plus récente est 13.10.1. Si jamais le jeu est mis à jour, certaines images risquent de ne pas bien s'afficher.
            <>
              <p>{playerData.name}</p>
              <img
                width="100"
                height="100"
                src={
                  "http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/" +
                  playerData.profileIconId +
                  ".png"
                }
                alt="player profil pic"
              ></img>
              <p>Player level: {playerData.summonerLevel}</p>
            </>
          ) : (
            <>
              <p>no data</p>
            </>
          )}
          {JSON.stringify(mostPlayedData) !== "{}" ? (
            // Affichage des champions les plus joués et de leurs icones.
            <>
              <h2>Top 3 most played:</h2>
              <div className="champions-icons">
                <div className="podium">
                  <div className="first-place">
                    <p>1st Place</p>
                    <img
                      width="100"
                      height="100"
                      className="champ"
                      id="1"
                      src={
                        "https://cdn.communitydragon.org/13.10.1/champion/" +
                        mostPlayedData[0].championId +
                        "/square"
                      }
                      alt="First Place"
                    ></img>
                  </div>
                  <div className="second-place">
                    <p>2nd Place</p>
                    <img
                      width="100"
                      height="100"
                      className="champ"
                      id="2"
                      src={
                        "https://cdn.communitydragon.org/13.10.1/champion/" +
                        mostPlayedData[1].championId +
                        "/square"
                      }
                      alt="Second Place"
                    ></img>
                  </div>
                  <div className="third-place">
                    <p>3rd Place</p>
                    <img
                      width="100"
                      height="100"
                      className="champ"
                      id="3"
                      src={
                        "https://cdn.communitydragon.org/13.10.1/champion/" +
                        mostPlayedData[2].championId +
                        "/square"
                      }
                      alt="Third Place"
                    ></img>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </>
      {gameList.length !== 0 ? (
        // Affichage des matchs
        <>
          {gameList.map((gameData, index) => (
            <>
              <h2>Game {index + 1}</h2>
              <div class="teamContainer">
                <div id="blue">
                  <p class="blueside">BLUE TEAM</p>
                  <ul class="blueplayers">
                    {gameData.info.participants
                      .slice(0, 5)
                      .map((data, participantIndex) => (
                        // Les 5 premiers joueurs sont dans l'équipe bleu et les 5 derniers dans la rouge
                        <li class="player" key={participantIndex}>       
                          <img
                            width="50"
                            height="50"
                            class="player-image"
                            src={
                              "https://cdn.communitydragon.org/13.10.1/champion/" +
                              data.championId +
                              "/square"
                            }
                            alt="champ played"
                          ></img>
                          {data.summonerName}, KDA: {data.kills} / {data.deaths}{" "}
                          / {data.assists}
                        </li>
                      ))}
                  </ul>
                </div>
                <div id="red">
                  <p class="redside">RED TEAM</p>
                  <ul class="redplayers">
                    {gameData.info.participants
                      .slice(5)
                      .map((data, participantIndex) => (
                        <li class="player" key={participantIndex}>       
                          <img
                            width="50"
                            height="50"
                            class="player-image"
                            src={
                              "https://cdn.communitydragon.org/13.10.1/champion/" +
                              data.championId +
                              "/square"
                            }
                            alt="champ played"
                          ></img>
                          {data.summonerName}, KDA: {data.kills} / {data.deaths}{" "}
                          / {data.assists}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </>
          ))}
        </>
      ) : (
        <>
          <p>We have no data!</p>
        </>
      )}
    </div>
  );
}

export default App;