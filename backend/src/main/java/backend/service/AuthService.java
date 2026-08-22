package backend.service;


import backend.dto.LoginResponseDTO;
import backend.util.JwtUtil;

import backend.dto.LoginRequestDTO;
import backend.dto.UserRequestDTO;
import backend.entity.User;
import backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(
        LoginRequestDTO dto) {

    User user = userRepository
            .findByEmail(dto.getEmail())
            .orElseThrow(() ->
                    new RuntimeException(
                            "User not found"));

    boolean matches =
            passwordEncoder.matches(
                    dto.getPassword(),
                    user.getPassword());

    if (!matches) {

        throw new RuntimeException(
                "Invalid password");
    }

    String token =
            JwtUtil.generateToken(
                    user.getEmail());

    return new LoginResponseDTO(
            token,
            user.getName(),
            user.getRole());
}

        public void registerCitizen(UserRequestDTO dto) {
                if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
                        throw new RuntimeException("An account with this email already exists");
                }

                User user = new User();
                user.setName(dto.getName());
                user.setEmail(dto.getEmail());
                user.setPhone(dto.getPhone());
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
                String requestedRole = dto.getRole() == null ? "CITIZEN" : dto.getRole().trim().toUpperCase();
                user.setRole("STAFF".equals(requestedRole) ? "STAFF" : "CITIZEN");
                userRepository.save(user);
        }
}