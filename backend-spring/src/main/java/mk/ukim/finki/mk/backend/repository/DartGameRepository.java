package mk.ukim.finki.mk.backend.repository;

import mk.ukim.finki.mk.backend.model.DartGame;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DartGameRepository extends MongoRepository<DartGame, String> {
    List<DartGame> findAllByOrderByDatePlayedDescIdDesc();
}
