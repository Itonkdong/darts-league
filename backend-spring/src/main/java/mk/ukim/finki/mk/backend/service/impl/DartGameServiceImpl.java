package mk.ukim.finki.mk.backend.service.impl;

import mk.ukim.finki.mk.backend.model.DartGame;
import mk.ukim.finki.mk.backend.model.DartsPlayer;
import mk.ukim.finki.mk.backend.repository.DartGameRepository;
import mk.ukim.finki.mk.backend.repository.DartsPlayerRepository;
import mk.ukim.finki.mk.backend.service.DartGameService;
import mk.ukim.finki.mk.backend.service.DartsPlayerService;
import mk.ukim.finki.mk.backend.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DartGameServiceImpl implements DartGameService {

    private final DartGameRepository dartGameRepository;
    private final DartsPlayerService dartsPlayerService;
    private final DartsPlayerRepository dartsPlayerRepository;
    private final FileStorageService fileStorageService;

    public DartGameServiceImpl(
            DartGameRepository dartGameRepository,
            DartsPlayerService dartsPlayerService,
            DartsPlayerRepository dartsPlayerRepository,
            FileStorageService fileStorageService) {
        this.dartGameRepository = dartGameRepository;
        this.dartsPlayerService = dartsPlayerService;
        this.dartsPlayerRepository = dartsPlayerRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public List<DartGame> findAll() {
        return dartGameRepository.findAll();
    }

    @Override
    public List<DartGame> findAllSortedByDateAndId() {
        return dartGameRepository.findAllByOrderByDatePlayedDescIdDesc();
    }

    @Override
    public Optional<DartGame> findById(String id) {
        return dartGameRepository.findById(id);
    }

    @Override
    public DartGame save(DartGame game) {
        // Replace player references with full player entities
        processPlayerReferences(game);

        // Save the game
        DartGame savedGame = dartGameRepository.save(game);

        // Update winner stats
        DartsPlayer winner = savedGame.getWinner();
        dartsPlayerService.incrementWins(winner);

        if (savedGame.getWonByClearing()) {
            dartsPlayerService.incrementGamesWonByClearing(winner);
        } else {
            dartsPlayerService.incrementGamesWonByEndOfRounds(winner);
        }

        return savedGame;
    }

    @Override
    public DartGame update(String id, DartGame game) {
        Optional<DartGame> existingGameOpt = dartGameRepository.findById(id);

        if (existingGameOpt.isPresent()) {
            DartGame existingGame = existingGameOpt.get();

            // Replace player references with full player entities
            processPlayerReferences(game);

            // If the winner changed, update both players' stats
            if (!existingGame.getWinner().getId().equals(game.getWinner().getId())) {
                // Decrement old winner's stats
                DartsPlayer oldWinner = existingGame.getWinner();
                dartsPlayerService.decrementWins(oldWinner);

                if (existingGame.getWonByClearing()) {
                    dartsPlayerService.decrementGamesWonByClearing(oldWinner);
                } else {
                    dartsPlayerService.decrementGamesWonByEndOfRounds(oldWinner);
                }

                // Increment new winner's stats
                DartsPlayer newWinner = game.getWinner();
                dartsPlayerService.incrementWins(newWinner);

                if (game.getWonByClearing()) {
                    dartsPlayerService.incrementGamesWonByClearing(newWinner);
                } else {
                    dartsPlayerService.incrementGamesWonByEndOfRounds(newWinner);
                }
            }
            // If winner is same but clearing status changed
            else if (existingGame.getWonByClearing() != game.getWonByClearing()) {
                DartsPlayer winner = game.getWinner();

                if (existingGame.getWonByClearing()) {
                    dartsPlayerService.decrementGamesWonByClearing(winner);
                    dartsPlayerService.incrementGamesWonByEndOfRounds(winner);
                } else {
                    dartsPlayerService.decrementGamesWonByEndOfRounds(winner);
                    dartsPlayerService.incrementGamesWonByClearing(winner);
                }
            }

            // Set the ID from the existing game to ensure we're updating not creating
            game.setId(id);
            return dartGameRepository.save(game);
        }

        // If the game doesn't exist, just save it as new
        return save(game);
    }

    @Override
    public void delete(String id) {
        Optional<DartGame> gameOpt = dartGameRepository.findById(id);

        if (gameOpt.isPresent()) {
            DartGame game = gameOpt.get();

            // Update winner's stats before deletion
            DartsPlayer winner = game.getWinner();
            dartsPlayerService.decrementWins(winner);

            if (game.getWonByClearing()) {
                dartsPlayerService.decrementGamesWonByClearing(winner);
            } else {
                dartsPlayerService.decrementGamesWonByEndOfRounds(winner);
            }

            // Delete the winner photo if it exists
            if (game.getWinnerPhotoPath() != null && !game.getWinnerPhotoPath().isEmpty()) {
                try {
                    fileStorageService.deleteFile(game.getWinnerPhotoPath());
                } catch (IOException e) {
                    // Log error but continue with the deletion
                    System.err.println("Error deleting winner photo: " + e.getMessage());
                }
            }

            // Delete the game
            dartGameRepository.deleteById(id);
        }
    }

    /**
     * Helper method to replace player references with full player entities
     * to prevent losing player data during save operations
     */
    private void processPlayerReferences(DartGame game) {
        // Process players list
        if (game.getPlayers() != null) {
            List<DartsPlayer> fullPlayers = new ArrayList<>();
            for (DartsPlayer playerRef : game.getPlayers()) {
                if (playerRef != null && playerRef.getId() != null) {
                    dartsPlayerRepository.findById(playerRef.getId())
                            .ifPresent(fullPlayers::add);
                }
            }
            game.setPlayers(fullPlayers);
        }

        // Process winner reference
        if (game.getWinner() != null && game.getWinner().getId() != null) {
            dartsPlayerRepository.findById(game.getWinner().getId())
                    .ifPresent(game::setWinner);
        }

        // Process highest score player reference
        if (game.getHighestScorePlayer() != null && game.getHighestScorePlayer().getId() != null) {
            dartsPlayerRepository.findById(game.getHighestScorePlayer().getId())
                    .ifPresent(game::setHighestScorePlayer);
        }
    }

    @Override
    public DartGame saveWithPhoto(DartGame game, MultipartFile photo) throws IOException {
        // Store the winner photo if provided
        if (photo != null && !photo.isEmpty()) {
            String photoPath = fileStorageService.storeFile(photo, "winner_photos");
            game.setWinnerPhotoPath(photoPath);
        }

        // Continue with normal save process
        return save(game);
    }

    @Override
    public DartGame updateWithPhoto(String id, DartGame game, MultipartFile photo) throws IOException {
        Optional<DartGame> existingGameOpt = dartGameRepository.findById(id);

        if (existingGameOpt.isPresent()) {
            DartGame existingGame = existingGameOpt.get();

            // Store the new winner photo if provided
            if (photo != null && !photo.isEmpty()) {
                // Delete the old photo if it exists
                if (existingGame.getWinnerPhotoPath() != null && !existingGame.getWinnerPhotoPath().isEmpty()) {
                    try {
                        fileStorageService.deleteFile(existingGame.getWinnerPhotoPath());
                    } catch (IOException e) {
                        // Log error but continue with the update
                        System.err.println("Error deleting old winner photo: " + e.getMessage());
                    }
                }

                // Store the new photo
                String photoPath = fileStorageService.storeFile(photo, "winner_photos");
                game.setWinnerPhotoPath(photoPath);
            } else {
                // If no new photo provided, keep the existing photo path
                game.setWinnerPhotoPath(existingGame.getWinnerPhotoPath());
            }

            // Continue with normal update process
            return update(id, game);
        }

        // If the game doesn't exist, just save it as new with the photo
        return saveWithPhoto(game, photo);
    }
}
