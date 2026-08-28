package backend;

import backend.entity.User;
import backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
CommandLineRunner createAdmin(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder) {

    return args -> {

        User admin =
                userRepository
                        .findByEmail("admin@gmail.com")
                        .orElse(new User());

        admin.setName("Administrator");
        admin.setEmail("admin@gmail.com");
        admin.setPhone("9999999999");
        admin.setPassword(
                passwordEncoder.encode("admin123"));

        admin.setRole("ADMIN");

        userRepository.save(admin);

        System.out.println("=================================");
        System.out.println("ADMIN ROLE FORCED TO ADMIN");
        System.out.println("=================================");
    };
}
    }
