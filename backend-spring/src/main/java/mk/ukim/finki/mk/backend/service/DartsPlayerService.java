package mk.ukim.finki.mk.backend.service;

import mk.ukim.finki.mk.backend.model.DartsPlayer;
import java.util.List;
import java.util.Optional;

public interface DartsPlayerService {
    List<DartsPlayer> findAll();
    Optional<DartsPlayer> findById(String id);
    DartsPlayer save(DartsPlayer player);
    void delete(String id);

    // Methods for updating player statistics
    void incrementWins(DartsPlayer player);
    void decrementWins(DartsPlayer player);
    void incrementGamesWonByClearing(DartsPlayer player);
    void decrementGamesWonByClearing(DartsPlayer player);
    void incrementGamesWonByEndOfRounds(DartsPlayer player);
    void decrementGamesWonByEndOfRounds(DartsPlayer player);
    void updatePlayerStats(DartsPlayer player);
}
