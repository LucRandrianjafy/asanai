package mg.asanai.controller;

import mg.asanai.model.JwtUtil;
import mg.asanai.model.Notification;
import mg.asanai.service.NotificationService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    public NotificationController(
            NotificationService notificationService,
            JwtUtil jwtUtil) {

        this.notificationService = notificationService;
        this.jwtUtil = jwtUtil;
    }
    
    @GetMapping
    public ResponseEntity<?> getAllNotifications(
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Notification> notificationList =
                notificationService
                        .getAllNotifications();

        return ResponseEntity.ok(notificationList);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getNotificationById(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Notification notification =
                notificationService
                        .getNotificationById(id);

        return ResponseEntity.ok(notification);
    }
    
    @GetMapping("/user/{idUser}")
    public ResponseEntity<?> getNotificationsByUserId(
            @PathVariable Long idUser,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Notification> notificationList =
                notificationService
                        .getNotificationsByUserId(idUser);

        return ResponseEntity.ok(notificationList);
    }
    
    @GetMapping("/user/{idUser}/non-vues")
    public ResponseEntity<?> getNotificationsNonVuesByUserId(
            @PathVariable Long idUser,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        List<Notification> notificationList =
                notificationService
                        .getNotificationsNonVuesByUserId(idUser);

        return ResponseEntity.ok(notificationList);
    }
    
    @GetMapping("/user/{idUser}/non-vues/count")
    public ResponseEntity<?> countNotificationsNonVuesByUserId(
            @PathVariable Long idUser,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        int count =
                notificationService
                        .countNotificationsNonVuesByUserId(idUser);

        return ResponseEntity.ok(count);
    }
    
    @PostMapping
    public ResponseEntity<?> createNotification(
            @RequestBody Notification notification,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Notification created =
                notificationService
                        .createNotification(notification);

        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotification(
            @PathVariable Long id,
            @RequestBody Notification notification,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Notification updated =
                notificationService
                        .updateNotification(id, notification);

        return ResponseEntity.ok(updated);
    }
    
    @PutMapping("/{id}/vue")
    public ResponseEntity<?> marquerCommeVue(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        Notification notification =
                notificationService
                        .marquerCommeVue(id);

        return ResponseEntity.ok(notification);
    }
    
    @PutMapping("/user/{idUser}/toutes-vues")
    public ResponseEntity<?> marquerToutesCommeVues(
            @PathVariable Long idUser,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        notificationService
                .marquerToutesCommeVues(idUser);

        return ResponseEntity.ok(
                "Toutes les notifications ont été marquées comme vues"
        );
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long id,
            HttpServletRequest request) {

        if (!jwtUtil.verifyToken(request)) {
            return ResponseEntity
                    .status(401)
                    .body("Token invalide ou manquant");
        }

        notificationService
                .deleteNotification(id);

        return ResponseEntity.ok(
                "Notification supprimée avec succès"
        );
    }
}