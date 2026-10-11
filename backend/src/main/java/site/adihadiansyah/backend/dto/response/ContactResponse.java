package site.adihadiansyah.backend.dto.response;

import java.time.Instant;
import java.util.UUID;
import site.adihadiansyah.backend.domain.ContactMessage;

public record ContactResponse(
    UUID id,
    String name,
    String email,
    String subject,
    String message,
    Instant createdAt
) {
    public static ContactResponse fromEntity(ContactMessage entity) {
        return new ContactResponse(
            entity.getId(),
            entity.getName(),
            entity.getEmail(),
            entity.getSubject(),
            entity.getMessage(),
            entity.getCreatedAt()
        );
    }
}
