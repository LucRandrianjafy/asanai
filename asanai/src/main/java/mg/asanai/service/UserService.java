package mg.asanai.service;

import mg.asanai.model.LoginResponse;
import mg.asanai.model.User;
import mg.asanai.model.JwtUtil;
import mg.asanai.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            JdbcTemplate jdbcTemplate
    ) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public List<User> getAllUser() {
        return userRepository.getAllUser();
    }

    public User getUserById(Long id) {
        return userRepository.getUserById(id);
    }

    public LoginResponse login(
            String email,
            String password
    ) {

        User user = userRepository.login(email);

        if (user == null) {
            return null;
        }

        if (!passwordEncoder.matches(
                password,
                user.getPassword()
        )) {
            return null;
        }

        String role = jdbcTemplate.queryForObject(
                "SELECT nom FROM role WHERE id = ?",
                String.class,
                user.getRoleId()
        );

        String token = jwtUtil.generateToken(user);

        return new LoginResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getNom(),
                user.getPrenom(),
                user.getRoleId(),
                role
        );
    }

    public User signup(User user) {

        user.setRoleId(2L);

        String hashedPassword =
                passwordEncoder.encode(
                        user.getPassword()
                );

        user.setPassword(hashedPassword);

        return userRepository.createUser(user);
    }

    public User createUser(User user) {

        String hashedPassword =
                passwordEncoder.encode(
                        user.getPassword()
                );

        user.setPassword(hashedPassword);

        return userRepository.createUser(user);
    }

    /**
     * Modification d'un utilisateur
     */
    public User updateUser(Long id, User user) {

        User existingUser =
                userRepository.getUserById(id);

        if (existingUser == null) {
            return null;
        }

        /*
         * Si aucun nouveau mot de passe n'est envoyé,
         * on conserve l'ancien.
         */
        user.setPassword(
                existingUser.getPassword()
        );

        return userRepository.updateUser(
                id,
                user
        );
    }

    /**
     * Modification avec nouveau mot de passe
     */
    public User updateUserWithPassword(
            Long id,
            User user
    ) {

        User existingUser =
                userRepository.getUserById(id);

        if (existingUser == null) {
            return null;
        }

        if (user.getPassword() != null
                && !user.getPassword().trim().isEmpty()) {

            String hashedPassword =
                    passwordEncoder.encode(
                            user.getPassword()
                    );

            user.setPassword(
                    hashedPassword
            );

        } else {

            user.setPassword(
                    existingUser.getPassword()
            );
        }

        return userRepository.updateUser(
                id,
                user
        );
    }
}