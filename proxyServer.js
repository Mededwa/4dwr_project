var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();

app.use(cors());
//Modifiez la clé d'API Riot Games ici
const API_KEY = "RGAPI-8c9a95a8-8a29-4fdb-97eb-723564e3fe10"

// On récupère le PUUID du joueur grâce à son pseudo. Cette information est nécessaire pour récupérer son historique de partie.
function getPlayerPUUID(playerName) {
    return axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
        .then(response => {
            return response.data.puuid;
        }).catch(err => err);
}

// On récupère l'ID encrypté du joueur grâce à son pseudo. Cette information est nécessaire pour récupérer ses champions les plus joués.
function getEncryptedSummonerId(playerName) {
    return axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
        .then(response => {
            return response.data.id;
        }).catch(err => err);
}

// Requête vers l'API MATCH-V5 pour récupérer l'historique du joueur et donc les ID de chaque matchs. On utilise en plus le PUUID et la clé d'API.
app.get('/past5Games', async(req, res) => {
    const playerName = req.query.username;

    const PUUID = await getPlayerPUUID(playerName);
    const API_CALL = "https://europe.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids?api_key=" + API_KEY;

    const gameIDs = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)
    // On créé ensuite un array avec les informations des match que nous récupérons grâce à leur ID
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
// Requête à CHAMPION-MASTERY-V4 pour récupérer les 3 champions les plus joués du joueur. On utilise l'ID encrypté du joueur ainsi que la clé d'API.
app.get('/mostPlayed', async(req, res) => {
    const playerName = req.query.username;
    const EncryptedSummonerId = await getEncryptedSummonerId(playerName);
    const API_CALL = "https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + EncryptedSummonerId + "/top?count=3&api_key=" + API_KEY;

    const mostPlayed = await axios.get(API_CALL)
        .then(response => response.data)
        .catch(err => err)
    res.json(mostPlayed);
})

// On fait une requête à l'API SUMMONER-V4 pour récupérer le profile du joueur. On utilise son pseudo et la clé d'API.
app.get('/playerProfile', async(req, res) => {
    const playerName = req.query.username;
    const playerDatas = await axios.get("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + API_KEY)
        .then(response => response.data)
        .catch(err => err);
    res.json(playerDatas);
})

// Ecoute du port 4000 pour le proxy
app.listen(4000, function(){
    console.log("server started");
})