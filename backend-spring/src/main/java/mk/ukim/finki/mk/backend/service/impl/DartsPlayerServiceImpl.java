package mk.ukim.finki.mk.backend.service.impl;

import mk.ukim.finki.mk.backend.model.DartsPlayer;
import mk.ukim.finki.mk.backend.repository.DartsPlayerRepository;
import mk.ukim.finki.mk.backend.service.DartsPlayerService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DartsPlayerServiceImpl implements DartsPlayerService {

    private final DartsPlayerRepository dartsPlayerRepository;

    public DartsPlayerServiceImpl(DartsPlayerRepository dartsPlayerRepository) {
        this.dartsPlayerRepository = dartsPlayerRepository;
    }

    @Override
    public List<DartsPlayer> findAll() {
        return dartsPlayerRepository.findAll();
    }

    @Override
    public Optional<DartsPlayer> findById(String id) {
        return dartsPlayerRepository.findById(id);
    }

    @Override
    public DartsPlayer save(DartsPlayer player) {
        return dartsPlayerRepository.save(player);
    }

    @Override
    public void delete(String id) {
        dartsPlayerRepository.deleteById(id);
    }

    @Override
    public void incrementWins(DartsPlayer player) {
        player.setWins(player.getWins() + 1);
        player.setPoints(player.getPoints() + 10); // Add points for winning
        dartsPlayerRepository.save(player);
    }

    @Override
    public void decrementWins(DartsPlayer player) {
        player.setWins(Math.max(0, player.getWins() - 1));
        dartsPlayerRepository.save(player);
    }

    @Override
    public void incrementGamesWonByClearing(DartsPlayer player) {
        player.setGamesWonByClearing(player.getGamesWonByClearing() + 1);
        dartsPlayerRepository.save(player);
    }

    @Override
    public void decrementGamesWonByClearing(DartsPlayer player) {
        player.setGamesWonByClearing(Math.max(0, player.getGamesWonByClearing() - 1));
        dartsPlayerRepository.save(player);
    }

    @Override
    public void incrementGamesWonByEndOfRounds(DartsPlayer player) {
        player.setGamesWonByEndOfRounds(player.getGamesWonByEndOfRounds() + 1);
        dartsPlayerRepository.save(player);
    }

    @Override
    public void decrementGamesWonByEndOfRounds(DartsPlayer player) {
        player.setGamesWonByEndOfRounds(Math.max(0, player.getGamesWonByEndOfRounds() - 1));
        dartsPlayerRepository.save(player);
    }

    @Override
    public void updatePlayerStats(DartsPlayer player) {
        dartsPlayerRepository.save(player);
    }
}
