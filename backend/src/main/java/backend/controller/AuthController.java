package backend.controller;

import backend.dto.LoginResponseDTO;
import backend.dto.LoginRequestDTO;
import backend.entity.User;
import backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService) {

        this.authService = authService;
    }

    @PostMapping("/login")
   public LoginResponseDTO login(
        @RequestBody LoginRequestDTO dto) {

        return authService.login(dto);
    }
}