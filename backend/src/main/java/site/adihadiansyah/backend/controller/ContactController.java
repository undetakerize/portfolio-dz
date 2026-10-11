package site.adihadiansyah.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.adihadiansyah.backend.dto.request.CreateContactCommand;
import site.adihadiansyah.backend.dto.response.ApiResponse;
import site.adihadiansyah.backend.dto.response.ContactResponse;
import site.adihadiansyah.backend.service.ContactCommandService;
import site.adihadiansyah.backend.service.ContactQueryService;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    private final ContactCommandService commandService;
    private final ContactQueryService queryService;

    public ContactController(ContactCommandService commandService, ContactQueryService queryService) {
        this.commandService = commandService;
        this.queryService = queryService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContactResponse>> submitContact(
            @Valid @RequestBody CreateContactCommand command,
            HttpServletRequest request
    ) {
        String clientIp = extractClientIp(request);
        ContactResponse response = commandService.handle(command, clientIp);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Message submitted successfully", response));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<ContactResponse>>> getRecent(
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<ContactResponse> list = queryService.getRecentMessages(limit);
        return ResponseEntity.ok(ApiResponse.ok("Recent messages retrieved", list));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.ok("Service healthy", "OK"));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
