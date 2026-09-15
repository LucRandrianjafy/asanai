package mg.asanai.controller;

import mg.asanai.model.Region;
import mg.asanai.model.JwtUtil;
import mg.asanai.service.RegionService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/region")
public class RegionController {

    private final RegionService regionService;
    private final JwtUtil jwtUtil;

    public RegionController(
            RegionService regionService,
            JwtUtil jwtUtil) {

        this.regionService = regionService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllRegion(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Region> regionList = regionService.getAllRegion();

        return ResponseEntity.ok(regionList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRegionById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Region region = regionService.getRegionById(id);

        return ResponseEntity.ok(region);
    }
}