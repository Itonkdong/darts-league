// MongoDB initialization script

// Create the players collection if it doesn't exist and add initial players
db = db.getSiblingDB('darts_league');

// Clear existing data if any
db.dartsPlayers.drop();
db.dartGames.drop();

// Insert initial players
const jakeId = ObjectId();
const bradId = ObjectId();
const leaId = ObjectId();

db.dartsPlayers.insertMany([
  {
    _id: jakeId,
    name: "Jake",
    surname: "Gyllenhaal",
    index: "226009",
    gender: "Male",
    dateOfBirth: new Date("1980-12-19"),
    zodiacSign: "Sagittarius",
    photoPath: "/uploads/player_photos/jake.png",
    points: 10,
    wins: 1,
    highestScore: 90,
    gamesWonByClearing: 1,
    gamesWonByEndOfRounds: 0,
    _class: "mk.ukim.finki.mk.backend.model.DartsPlayer"
  },
  {
    _id: bradId,
    name: "Brad",
    surname: "Pitt",
    index: "223070",
    gender: "Male",
    dateOfBirth: new Date("1963-12-18"),
    zodiacSign: "Sagittarius",
    photoPath: "/uploads/player_photos/brad.png",
    points: 0,
    wins: 0,
    highestScore: 0,
    gamesWonByClearing: 0,
    gamesWonByEndOfRounds: 0,
    _class: "mk.ukim.finki.mk.backend.model.DartsPlayer"
  },
  {
    _id: leaId,
    name: "Lea",
    surname: "Saydox",
    index: "226001",
    gender: "Female",
    dateOfBirth: new Date("1995-07-02"),
    zodiacSign: "Cancer",
    photoPath: "/uploads/player_photos/lea.png",
    points: 0,
    wins: 0,
    highestScore: 130,
    gamesWonByClearing: 0,
    gamesWonByEndOfRounds: 0,
    _class: "mk.ukim.finki.mk.backend.model.DartsPlayer"
  }
]);

// Insert initial game
db.dartGames.insertOne({
  gameType: "301",
  numPlayers: 2,
  players: [
    {
      $ref: "dartsPlayers",
      $id: jakeId
    },
    {
      $ref: "dartsPlayers",
      $id: leaId
    }
  ],
  scores: {
    [jakeId.toString()]: 0,
    [leaId.toString()]: 12
  },
  winner: {
    $ref: "dartsPlayers",
    $id: jakeId
  },
  wonByClearing: true,
  datePlayed: new Date("2025-06-22T22:00:00.000Z"),
  description: "Fun game",
  winnerPhotoPath: "/uploads/winner_photos/win1.png",
  highestScore: 130,
  highestScorePlayer: {
    $ref: "dartsPlayers",
    $id: leaId
  },
  _class: "mk.ukim.finki.mk.backend.model.DartGame"
});

print("Database initialization completed successfully!");
