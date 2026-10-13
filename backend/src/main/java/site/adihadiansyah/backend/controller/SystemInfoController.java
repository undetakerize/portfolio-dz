package site.adihadiansyah.backend.controller;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.adihadiansyah.backend.dto.response.ApiResponse;

@RestController
@RequestMapping("/api/v1/system")
public class SystemInfoController {

    private final DataSource dataSource;

    public SystemInfoController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/telemetry")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTelemetry() {
        Map<String, Object> telemetry = new LinkedHashMap<>();

        // Service & Runtime metadata
        telemetry.put("service", "diezaster-backend");
        telemetry.put("framework", "Spring Boot 3.4.3");
        telemetry.put("runtime", "Eclipse Temurin 17 JRE (Alpine Linux)");
        telemetry.put("architecture", "Pragmatic CQRS / Low-Memory Profile");

        // Real JVM Memory stats
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        long heapUsedBytes = memoryBean.getHeapMemoryUsage().getUsed();
        long heapMaxBytes = memoryBean.getHeapMemoryUsage().getMax();
        long heapCommittedBytes = memoryBean.getHeapMemoryUsage().getCommitted();

        Map<String, Object> jvm = new LinkedHashMap<>();
        jvm.put("heap_used_mb", Math.round(heapUsedBytes / (1024.0 * 1024.0)));
        jvm.put("heap_committed_mb", Math.round(heapCommittedBytes / (1024.0 * 1024.0)));
        jvm.put("heap_max_mb", Math.round(heapMaxBytes / (1024.0 * 1024.0)));
        jvm.put("garbage_collector", "G1GC (-XX:+UseG1GC)");
        jvm.put("oom_protection", "-XX:+ExitOnOutOfMemoryError");
        telemetry.put("jvm", jvm);

        // Database status check
        Map<String, Object> database = new LinkedHashMap<>();
        try {
            boolean isValid = dataSource.getConnection().isValid(2);
            database.put("engine", "PostgreSQL 16 Alpine");
            database.put("status", isValid ? "CONNECTED" : "DEGRADED");
            database.put("pool", "HikariCP (max-pool-size: 5)");
        } catch (Exception e) {
            database.put("engine", "PostgreSQL 16 Alpine");
            database.put("status", "UNREACHABLE");
            database.put("error", e.getMessage());
        }
        telemetry.put("database", database);

        // Host & Container constraints
        Map<String, Object> environment = new LinkedHashMap<>();
        environment.put("host", "Ubuntu 24.04 LTS (2GB RAM VPS)");
        environment.put("container_orchestration", "Docker Compose");
        environment.put("backend_ram_limit", "384 MB");
        environment.put("postgres_ram_limit", "256 MB");
        environment.put("total_stack_budget", "640 MB (~31% of host)");
        environment.put("reverse_proxy", "Host Nginx (TLS 1.3)");
        telemetry.put("infrastructure", environment);

        return ResponseEntity.ok(ApiResponse.ok("Telemetry retrieved successfully", telemetry));
    }
}
