package site.adihadiansyah.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.adihadiansyah.backend.domain.ContactMessage;
import site.adihadiansyah.backend.dto.request.CreateContactCommand;
import site.adihadiansyah.backend.dto.response.ContactResponse;
import site.adihadiansyah.backend.repository.ContactMessageRepository;

@Service
public class ContactCommandService {

    private final ContactMessageRepository repository;

    public ContactCommandService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ContactResponse handle(CreateContactCommand command, String clientIp) {
        String cleanName = sanitize(command.name().trim());
        String cleanEmail = command.email().trim().toLowerCase();
        String cleanSubject = sanitize(command.subject().trim());
        String cleanMessage = sanitize(command.message().trim());
        String hashedIp = hashIp(clientIp);

        ContactMessage entity = new ContactMessage(cleanName, cleanEmail, cleanSubject, cleanMessage, hashedIp);
        ContactMessage saved = repository.save(entity);

        return ContactResponse.fromEntity(saved);
    }

    private String sanitize(String input) {
        if (input == null) return "";
        return input.replace("<", "&lt;").replace(">", "&gt;");
    }

    private String hashIp(String ip) {
        if (ip == null || ip.isBlank()) return "unknown";
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(ip.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return "hash_error";
        }
    }
}
