package mk.ukim.finki.mk.backend.service;

import mk.ukim.finki.mk.backend.model.DartGame;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface DartGameService {
    List<DartGame> findAll();
    List<DartGame> findAllSortedByDateAndId();
    Optional<DartGame> findById(String id);
    DartGame save(DartGame game);
    DartGame saveWithPhoto(DartGame game, MultipartFile photo) throws IOException;
    DartGame update(String id, DartGame game);
    DartGame updateWithPhoto(String id, DartGame game, MultipartFile photo) throws IOException;
    void delete(String id);
}
