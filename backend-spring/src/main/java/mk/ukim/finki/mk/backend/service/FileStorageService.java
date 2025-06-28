package mk.ukim.finki.mk.backend.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Path;

public interface FileStorageService {
    String storeFile(MultipartFile file, String folder) throws IOException;
    Path getFilePath(String relativePath);
    void deleteFile(String relativePath) throws IOException;
}
