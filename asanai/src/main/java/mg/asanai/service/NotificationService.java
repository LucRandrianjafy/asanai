package mg.asanai.service;

import mg.asanai.model.Notification;
import mg.asanai.repository.NotificationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllNotifications() {

        return notificationRepository
                .getAllNotifications();
    }

    public Notification getNotificationById(Long id) {

        return notificationRepository
                .getNotificationById(id);
    }

    public List<Notification> getNotificationsByUserId(
            Long idUser) {

        return notificationRepository
                .getNotificationsByUserId(idUser);
    }

    public List<Notification> getNotificationsNonVuesByUserId(
            Long idUser) {

        return notificationRepository
                .getNotificationsNonVuesByUserId(idUser);
    }

    public int countNotificationsNonVuesByUserId(
            Long idUser) {

        return notificationRepository
                .countNotificationsNonVuesByUserId(idUser);
    }

    public Notification createNotification(
            Notification notification) {

        return notificationRepository
                .createNotification(notification);
    }

    public Notification updateNotification(
            Long id,
            Notification notification) {

        return notificationRepository
                .updateNotification(id, notification);
    }

    public Notification marquerCommeVue(Long id) {

        return notificationRepository
                .marquerCommeVue(id);
    }

    public void marquerToutesCommeVues(Long idUser) {

        notificationRepository
                .marquerToutesCommeVues(idUser);
    }

    public void deleteNotification(Long id) {

        notificationRepository
                .deleteNotification(id);
    }
}