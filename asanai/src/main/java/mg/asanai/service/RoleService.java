package mg.asanai.service;

import mg.asanai.model.Role;
import mg.asanai.repository.RoleRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRole() {
        return roleRepository.getAllRole();
    }

    public Role getRoleById(Long id) {
        return roleRepository.getRoleById(id);
    }
}