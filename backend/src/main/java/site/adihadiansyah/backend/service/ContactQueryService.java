package site.adihadiansyah.backend.service;

import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.adihadiansyah.backend.dto.response.ContactResponse;
import site.adihadiansyah.backend.repository.ContactMessageRepository;

@Service
@Transactional(readOnly = true)
public class ContactQueryService {

    private final ContactMessageRepository repository;

    public ContactQueryService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    public List<ContactResponse> getRecentMessages(int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 50);
        return repository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, safeLimit))
                .stream()
                .map(ContactResponse::fromEntity)
                .toList();
    }

    public long getTotalMessageCount() {
        return repository.count();
    }
}
