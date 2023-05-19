var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();

app.use(cors());

const API_KEY = "RGAPI-8c9a95a8-8a29-4fdb-97eb-723564e3fe10"

function getPlayerPUUID(playerName) {
    return axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
        .then(response => {
            console.log(response.data);
            return response.data.puuid;
        }).catch(err => err);
}

function getEncryptedSummonerId(playerName) {
    return axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
        .then(response => {
            console.log(response.data.id);
            return response.data.id;
        }).catch(err => err);
}

// GET past5Games
// GET localhost:4000/past5Games
app.get('/past5Games', async(req, res) => {
    const playerName = req.query.username;

    const PUUID = await getPlayerPUUID(playerName);
    const API_CALL = "https://europe.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids?api_key=" + API_KEY;

    const gameIDs = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)
    
    console.log(gameIDs);

    var matchDataArray = [];
    for(var i=0; i < gameIDs.length -15; i++) {
        const matchID = gameIDs[i];
        const matchData = await axios.get("https://europe.api.riotgames.com" + "/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
            .then(response => response.data)
            .catch(err => err)
        matchDataArray.push(matchData);
    }

    res.json(matchDataArray);

})

app.get('/mostPlayed', async(req, res) => {
    const playerName = req.query.username;
    const EncryptedSummonerId = await getEncryptedSummonerId(playerName);
    const API_CALL = "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + EncryptedSummonerId + "/top?count=3&api_key=" + API_KEY;

    const mostPlayed = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)
    res.json(mostPlayed);
})

app.get('/playerProfile', async(req, res) => {
    const playerName = req.query.username;
    const playerDatas = await axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
        .then(response => response.data)
        .catch(err => err);
    res.json(playerDatas);
})
app.listen(4000, function(){
    console.log("server started");
})