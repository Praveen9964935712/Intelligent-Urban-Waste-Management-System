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

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {

                User admin = new User();

                admin.setName("Administrator");
                admin.setEmail("admin@gmail.com");
                admin.setPhone("9999999999");
                admin.setPassword(
                        passwordEncoder.encode("admin123"));

                admin.setRole("ADMIN");

                userRepository.save(admin);

                System.out.println("=================================");
                System.out.println("ADMIN USER CREATED SUCCESSFULLY");
                System.out.println("Email: admin@gmail.com");
                System.out.println("Password: admin123");
                System.out.println("=================================");
            }
        };
    }
}