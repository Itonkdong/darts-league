package mk.ukim.finki.mk.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Document(collection = "dartGames")
public class DartGame
{
    @Id
    private String id;
    private String gameType;
    private Integer numPlayers;

    @DBRef
    private List<DartsPlayer> players;

    private Map<String, Integer> scores;  // player_id: score

    @DBRef
    private DartsPlayer winner;

    private Boolean wonByClearing;
    private LocalDate datePlayed;
    private String description;
    private String winnerPhotoPath;
    private Integer highestScore;

    @DBRef
    private DartsPlayer highestScorePlayer;

    public DartGame()
    {
    }

    public DartGame(String gameType, Integer numPlayers, List<DartsPlayer> players,
                    Map<String, Integer> scores, DartsPlayer winner, Boolean wonByClearing,
                    LocalDate datePlayed, String description, String winnerPhotoPath,
                    Integer highestScore, DartsPlayer highestScorePlayer)
    {
        this.gameType = gameType;
        this.numPlayers = numPlayers;
        this.players = players;
        this.scores = scores;
        this.winner = winner;
        this.wonByClearing = wonByClearing;
        this.datePlayed = datePlayed;
        this.description = description;
        this.winnerPhotoPath = winnerPhotoPath;
        this.highestScore = highestScore;
        this.highestScorePlayer = highestScorePlayer;
    }

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getGameType()
    {
        return gameType;
    }

    public void setGameType(String gameType)
    {
        this.gameType = gameType;
    }

    public Integer getNumPlayers()
    {
        return numPlayers;
    }

    public void setNumPlayers(Integer numPlayers)
    {
        this.numPlayers = numPlayers;
    }

    public List<DartsPlayer> getPlayers()
    {
        return players;
    }

    public void setPlayers(List<DartsPlayer> players)
    {
        this.players = players;
    }

    public Map<String, Integer> getScores()
    {
        return scores;
    }

    public void setScores(Map<String, Integer> scores)
    {
        this.scores = scores;
    }

    public DartsPlayer getWinner()
    {
        return winner;
    }

    public void setWinner(DartsPlayer winner)
    {
        this.winner = winner;
    }

    public Boolean getWonByClearing()
    {
        return wonByClearing;
    }

    public void setWonByClearing(Boolean wonByClearing)
    {
        this.wonByClearing = wonByClearing;
    }

    public LocalDate getDatePlayed()
    {
        return datePlayed;
    }

    public void setDatePlayed(LocalDate datePlayed)
    {
        this.datePlayed = datePlayed;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getWinnerPhotoPath()
    {
        return winnerPhotoPath;
    }

    public void setWinnerPhotoPath(String winnerPhotoPath)
    {
        this.winnerPhotoPath = winnerPhotoPath;
    }

    public Integer getHighestScore()
    {
        return highestScore;
    }

    public void setHighestScore(Integer highestScore)
    {
        this.highestScore = highestScore;
    }

    public DartsPlayer getHighestScorePlayer()
    {
        return highestScorePlayer;
    }

    public void setHighestScorePlayer(DartsPlayer highestScorePlayer)
    {
        this.highestScorePlayer = highestScorePlayer;
    }

    @Override
    public String toString()
    {
        return String.format("%s on %s", gameType, datePlayed.toString());
    }
}
