package mg.asanai.controller;

import mg.asanai.model.Campus;
import mg.asanai.service.CampusService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campus")
@CrossOrigin(origins = "http://localhost:5173")
public class CampusController {

    private final CampusService campusService;

    public CampusController(CampusService campusService) {
        this.campusService = campusService;
    }

    @GetMapping
    public ResponseEntity<List<Campus>> getAllCampus() {

        return ResponseEntity.ok(
            campusService.getAllCampus()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campus> getCampusById(
        @PathVariable Long id
    ) {

        Campus campus = campusService.getCampusById(id);

        if (campus == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(campus);
    }

    @PostMapping
    public ResponseEntity<Campus> createCampus(
        @RequestBody Campus campus
    ) {

        Campus created = campusService.createCampus(campus);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campus> updateCampus(
        @PathVariable Long id,
        @RequestBody Campus campus
    ) {

        Campus updated = campusService.updateCampus(id, campus);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampus(
        @PathVariable Long id
    ) {

        boolean deleted = campusService.deleteCampus(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}