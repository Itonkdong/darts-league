package mk.ukim.finki.mk.backend.repository;

import mk.ukim.finki.mk.backend.model.DartsPlayer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DartsPlayerRepository extends MongoRepository<DartsPlayer, String> {
    DartsPlayer findByIndex(String index);
}
