package mg.asanai.controller;

import mg.asanai.model.JwtUtil;
import mg.asanai.model.LoginRequest;
import mg.asanai.model.LoginResponse;
import mg.asanai.model.User;
import mg.asanai.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(
            UserService userService,
            JwtUtil jwtUtil
    ) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllUser(
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Token invalide ou manquant");
        }

        List<User> userList =
                userService.getAllUser();

        return ResponseEntity.ok(userList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Token invalide ou manquant");
        }

        User user =
                userService.getUserById(id);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Utilisateur introuvable");
        }

        return ResponseEntity.ok(user);
    }

    /**
     * MODIFICATION D'UN UTILISATEUR
     *
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User user,
            HttpServletRequest request
    ) {

        System.out.println("=================================");
        System.out.println("MODIFICATION UTILISATEUR");
        System.out.println("ID : " + id);
        System.out.println("=================================");

        if (!jwtUtil.verifyToken(request)) {

            System.out.println(
                    "ERREUR : Token invalide ou manquant"
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Token invalide ou manquant");
        }

        try {

            User existingUser =
                    userService.getUserById(id);

            if (existingUser == null) {

                System.out.println(
                        "ERREUR : Utilisateur introuvable"
                );

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Utilisateur introuvable");
            }

            User updatedUser =
                    userService.updateUserWithPassword(
                            id,
                            user
                    );

            if (updatedUser == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Utilisateur introuvable");
            }

            System.out.println(
                    "Utilisateur modifié avec succès"
            );

            return ResponseEntity.ok(updatedUser);

        } catch (org.springframework.dao.DuplicateKeyException e) {

            System.out.println(
                    "ERREUR DUPLICATE KEY MODIFICATION"
            );

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email ou CIN déjà utilisé");

        } catch (Exception e) {

            System.out.println(
                    "ERREUR MODIFICATION UTILISATEUR"
            );

            System.out.println(
                    "Type : "
                    + e.getClass().getName()
            );

            System.out.println(
                    "Message : "
                    + e.getMessage()
            );

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Erreur lors de la modification de l'utilisateur : "
                            + e.getMessage()
                    );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest
    ) {

        LoginResponse response =
                userService.login(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                );

        if (response == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Email ou mot de passe incorrect");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody User user
    ) {

        try {

            User createdUser =
                    userService.signup(user);

            String token =
                    jwtUtil.generateToken(createdUser);

            java.util.Map<String, Object> response =
                    new java.util.HashMap<>();

            response.put(
                    "token",
                    token
            );

            response.put(
                    "user",
                    createdUser
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (
                org.springframework.dao.DuplicateKeyException e
        ) {

            System.out.println(
                    "================================="
            );

            System.out.println(
                    "ERREUR DUPLICATE KEY SIGNUP"
            );

            System.out.println(
                    "================================="
            );

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            "Email ou CIN déjà utilisé"
                    );

        } catch (Exception e) {

            System.out.println(
                    "================================="
            );

            System.out.println(
                    "ERREUR SIGNUP"
            );

            System.out.println(
                    "Type : "
                    + e.getClass().getName()
            );

            System.out.println(
                    "Message : "
                    + e.getMessage()
            );

            System.out.println(
                    "================================="
            );

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            e.getClass().getSimpleName()
                            + " : "
                            + e.getMessage()
                    );
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestBody User user,
            HttpServletRequest request
    ) {

        if (!jwtUtil.verifyToken(request)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Token invalide ou manquant");
        }

        try {

            User createdUser =
                    userService.createUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdUser);

        } catch (
                org.springframework.dao.DuplicateKeyException e
        ) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            "Email ou CIN déjà utilisé"
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Erreur lors de la création de l'utilisateur"
                    );
        }
    }
}