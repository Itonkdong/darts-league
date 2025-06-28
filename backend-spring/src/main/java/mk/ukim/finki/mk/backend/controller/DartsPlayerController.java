package mk.ukim.finki.mk.backend.controller;

import mk.ukim.finki.mk.backend.model.DartsPlayer;
import mk.ukim.finki.mk.backend.service.DartsPlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "*")
public class DartsPlayerController
{

    private final DartsPlayerService dartsPlayerService;

    public DartsPlayerController(DartsPlayerService dartsPlayerService)
    {
        this.dartsPlayerService = dartsPlayerService;
    }

    @GetMapping
    public ResponseEntity<List<DartsPlayer>> getAllPlayers()
    {
        List<DartsPlayer> players = dartsPlayerService.findAll();
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DartsPlayer> getPlayerById(@PathVariable String id)
    {
        return dartsPlayerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DartsPlayer> createPlayer(@RequestBody DartsPlayer player)
    {
        DartsPlayer savedPlayer = dartsPlayerService.save(player);
        return ResponseEntity.ok(savedPlayer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DartsPlayer> updatePlayer(@PathVariable String id, @RequestBody DartsPlayer player)
    {
        return dartsPlayerService.findById(id)
                .map(existingPlayer ->
                {
                    player.setId(id);
                    DartsPlayer updatedPlayer = dartsPlayerService.save(player);
                    return ResponseEntity.ok(updatedPlayer);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable String id)
    {
        if (dartsPlayerService.findById(id).isPresent())
        {
            dartsPlayerService.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
