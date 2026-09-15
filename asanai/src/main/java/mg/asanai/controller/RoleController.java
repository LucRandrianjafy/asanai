package mg.asanai.controller;

import mg.asanai.model.Role;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.RoleService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
public class RoleController {

    private final RoleService roleService;
    private final JwtUtil jwtUtil;

    public RoleController(RoleService roleService, JwtUtil jwtUtil) {
        this.roleService = roleService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllRole(HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Role> roleList = roleService.getAllRole();

        return ResponseEntity.ok(roleList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Role role = roleService.getRoleById(id);

        return ResponseEntity.ok(role);
    }
}