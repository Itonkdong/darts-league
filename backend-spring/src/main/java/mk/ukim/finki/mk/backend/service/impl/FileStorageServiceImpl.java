package mk.ukim.finki.mk.backend.service.impl;

import jakarta.annotation.PostConstruct;
import mk.ukim.finki.mk.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService
{

    @Value("${file.upload-dir:${user.home}/darts-league/uploads}")
    private String uploadDir;

    public FileStorageServiceImpl()
    {
    }

    @PostConstruct
    public void init()
    {
        createUploadDirectories();
    }

    @Override
    public String storeFile(MultipartFile file, String folder) throws IOException
    {
        if (file == null || file.isEmpty())
        {
            throw new IOException("Cannot store empty file");
        }

        // Create a unique filename to avoid collisions
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains("."))
        {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uniqueFilename = timestamp + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;

        // Create full path
        Path folderPath = Paths.get(uploadDir, folder);
        if (!Files.exists(folderPath))
        {
            Files.createDirectories(folderPath);
        }

        Path targetPath = folderPath.resolve(uniqueFilename);

        // Copy file to the target location
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return the relative path to be stored in the database
        return "/uploads/" + folder + "/" + uniqueFilename;
    }

    @Override
    public Path getFilePath(String relativePath)
    {
        if (relativePath.startsWith("/uploads/"))
        {
            relativePath = relativePath.substring("/uploads/".length());
        }
        return Paths.get(uploadDir, relativePath);
    }

    @Override
    public void deleteFile(String relativePath) throws IOException
    {
        if (relativePath == null || relativePath.isEmpty())
        {
            return;
        }

        Path filePath = getFilePath(relativePath);
        Files.deleteIfExists(filePath);
    }

    private void createUploadDirectories()
    {
        try
        {
            // Create main uploads directory
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath))
            {
                Files.createDirectories(uploadPath);
            }

            // Create subdirectories for different types of uploads
            String[] folders = {"winner_photos", "player_photos"};
            for (String folder : folders)
            {
                Path folderPath = uploadPath.resolve(folder);
                if (!Files.exists(folderPath))
                {
                    Files.createDirectories(folderPath);
                }
            }
        } catch (IOException e)
        {
            throw new RuntimeException("Could not create upload directories", e);
        }
    }
}
