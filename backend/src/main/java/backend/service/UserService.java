package backend.service;

import backend.entity.User;
import backend.repository.UserRepository;
import backend.dto.UserRequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public User saveUser(User user) {

        return userRepository.save(user);

    }

    public List<User> getAllUsers() {

        return userRepository.findAll();

    }
    public User saveUser(UserRequestDTO dto) {

    User user = new User();

    user.setName(dto.getName());
    user.setEmail(dto.getEmail());
    user.setPassword(dto.getPassword());
    user.setPhone(dto.getPhone());
    user.setRole(dto.getRole());

    return userRepository.save(user);
}

}