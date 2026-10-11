package site.adihadiansyah.backend.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contact_messages", indexes = {
    @Index(name = "idx_contact_created_at", columnList = "createdAt DESC"),
    @Index(name = "idx_contact_client_ip", columnList = "clientIpHash")
})
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(nullable = false, length = 3000)
    private String message;

    @Column(nullable = false, length = 64)
    private String clientIpHash;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected ContactMessage() {
        // JPA specification requirement
    }

    public ContactMessage(String name, String email, String subject, String message, String clientIpHash) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.clientIpHash = clientIpHash;
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getSubject() {
        return subject;
    }

    public String getMessage() {
        return message;
    }

    public String getClientIpHash() {
        return clientIpHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
