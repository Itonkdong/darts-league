package mk.ukim.finki.mk.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import mk.ukim.finki.mk.backend.model.DartGame;
import mk.ukim.finki.mk.backend.service.DartGameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class DartGameController
{

    private final DartGameService dartGameService;
    private final ObjectMapper objectMapper;

    public DartGameController(DartGameService dartGameService, ObjectMapper objectMapper)
    {
        this.dartGameService = dartGameService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<DartGame>> getAllGames()
    {
        List<DartGame> games = dartGameService.findAllSortedByDateAndId();
        return ResponseEntity.ok(games);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DartGame> getGameById(@PathVariable String id)
    {
        return dartGameService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<DartGame> createGame(@RequestBody DartGame game)
    {
        // Save the game and update player stats
        DartGame savedGame = dartGameService.save(game);
        return new ResponseEntity<>(savedGame, HttpStatus.CREATED);
    }

    @PostMapping(value = "/withPhoto", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<DartGame> createGameWithPhoto(
            @RequestParam(value = "winnerPhoto", required = false) MultipartFile winnerPhoto,
            @RequestParam("gameData") String gameDataJson) throws IOException {


        // Convert the JSON string to a DartGame object
        DartGame game = objectMapper.readValue(gameDataJson, DartGame.class);

        // Save the game with photo
        DartGame savedGame = dartGameService.saveWithPhoto(game, winnerPhoto);
        return new ResponseEntity<>(savedGame, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DartGame> updateGame(@PathVariable String id, @RequestBody DartGame game)
    {
        // Update the game and adjust player stats accordingly
        DartGame updatedGame = dartGameService.update(id, game);
        return ResponseEntity.ok(updatedGame);
    }

    @PutMapping(value = "/{id}/withPhoto", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<DartGame> updateGameWithPhoto(
            @PathVariable String id,
            @RequestParam(value = "winnerPhoto", required = false) MultipartFile winnerPhoto,
            @RequestParam("gameData") String gameDataJson) throws IOException {

        // Convert the JSON string to a DartGame object
        DartGame game = objectMapper.readValue(gameDataJson, DartGame.class);

        // Update the game with photo
        DartGame updatedGame = dartGameService.updateWithPhoto(id, game, winnerPhoto);
        return ResponseEntity.ok(updatedGame);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable String id)
    {
        // Delete the game and adjust player stats
        dartGameService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
