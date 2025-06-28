package mk.ukim.finki.mk.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "dartsPlayers")
public class DartsPlayer {
    @Id
    private String id;
    private String name;
    private String surname;
    private String index;
    private String gender;
    private LocalDate dateOfBirth;
    private String zodiacSign;
    private String photoPath;
    private Integer points = 0;
    private Integer wins = 0;
    private Integer highestScore = 0;
    private Integer gamesWonByClearing = 0;
    private Integer gamesWonByEndOfRounds = 0;

    public DartsPlayer() {
    }

    public DartsPlayer(String name, String surname, String index, String gender,
                        LocalDate dateOfBirth, String zodiacSign, String photoPath) {
        this.name = name;
        this.surname = surname;
        this.index = index;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.zodiacSign = zodiacSign;
        this.photoPath = photoPath;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getZodiacSign() {
        return zodiacSign;
    }

    public void setZodiacSign(String zodiacSign) {
        this.zodiacSign = zodiacSign;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Integer getWins() {
        return wins;
    }

    public void setWins(Integer wins) {
        this.wins = wins;
    }

    public Integer getHighestScore() {
        return highestScore;
    }

    public void setHighestScore(Integer highestScore) {
        this.highestScore = highestScore;
    }

    public Integer getGamesWonByClearing() {
        return gamesWonByClearing;
    }

    public void setGamesWonByClearing(Integer gamesWonByClearing) {
        this.gamesWonByClearing = gamesWonByClearing;
    }

    public Integer getGamesWonByEndOfRounds() {
        return gamesWonByEndOfRounds;
    }

    public void setGamesWonByEndOfRounds(Integer gamesWonByEndOfRounds) {
        this.gamesWonByEndOfRounds = gamesWonByEndOfRounds;
    }

    @Override
    public String toString() {
        return String.format("%s %s (%s)", name, surname, index);
    }
}
