package mg.asanai.repository;

import mg.asanai.model.Notification;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class NotificationRepository {

    private final JdbcTemplate jdbcTemplate;

    public NotificationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Notification> notificationRowMapper =
            new RowMapper<Notification>() {

        @Override
        public Notification mapRow(
                ResultSet rs,
                int rowNum) throws SQLException {

            Notification notification = new Notification();

            notification.setId(
                    rs.getLong("id")
            );

            notification.setIdUser(
                    rs.getLong("id_user")
            );

            notification.setTitre(
                    rs.getString("titre")
            );

            notification.setMessage(
                    rs.getString("message")
            );

            notification.setStatutVu(
                    rs.getBoolean("statut_vu")
            );

            if (rs.getTimestamp("date_notification") != null) {
                notification.setDateNotification(
                        rs.getTimestamp("date_notification")
                                .toLocalDateTime()
                );
            }

            return notification;
        }
    };
    
    public List<Notification> getAllNotifications() {

        String sql = """
                SELECT
                    id,
                    id_user,
                    titre,
                    message,
                    statut_vu,
                    date_notification
                FROM notification
                ORDER BY date_notification DESC
                """;

        return jdbcTemplate.query(
                sql,
                notificationRowMapper
        );
    }
    
    public Notification getNotificationById(Long id) {

        String sql = """
                SELECT
                    id,
                    id_user,
                    titre,
                    message,
                    statut_vu,
                    date_notification
                FROM notification
                WHERE id = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                notificationRowMapper,
                id
        );
    }
    
    public List<Notification> getNotificationsByUserId(
            Long idUser) {

        String sql = """
                SELECT
                    id,
                    id_user,
                    titre,
                    message,
                    statut_vu,
                    date_notification
                FROM notification
                WHERE id_user = ?
                ORDER BY date_notification DESC
                """;

        return jdbcTemplate.query(
                sql,
                notificationRowMapper,
                idUser
        );
    }
    
    public List<Notification> getNotificationsNonVuesByUserId(
            Long idUser) {

        String sql = """
                SELECT
                    id,
                    id_user,
                    titre,
                    message,
                    statut_vu,
                    date_notification
                FROM notification
                WHERE id_user = ?
                  AND statut_vu = FALSE
                ORDER BY date_notification DESC
                """;

        return jdbcTemplate.query(
                sql,
                notificationRowMapper,
                idUser
        );
    }
    
    public int countNotificationsNonVuesByUserId(
            Long idUser) {

        String sql = """
                SELECT COUNT(*)
                FROM notification
                WHERE id_user = ?
                  AND statut_vu = FALSE
                """;

        return jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                idUser
        );
    }
    
    public Notification createNotification(
            Notification notification) {

        String sql = """
                INSERT INTO notification (
                    id_user,
                    titre,
                    message,
                    statut_vu
                )
                VALUES (?, ?, ?, ?)
                RETURNING
                    id,
                    id_user,
                    titre,
                    message,
                    statut_vu,
                    date_notification
                """;

        return jdbcTemplate.queryForObject(
                sql,
                notificationRowMapper,
                notification.getIdUser(),
                notification.getTitre(),
                notification.getMessage(),
                notification.getStatutVu() != null
                        ? notification.getStatutVu()
                        : false
        );
    }
    
    public Notification updateNotification(
            Long id,
            Notification notification) {

        String sql = """
                UPDATE notification
                SET
                    id_user = ?,
                    titre = ?,
                    message = ?,
                    statut_vu = ?
                WHERE id = ?
                RETURNING
                    id,
                    id_user,
                    titre,
                    message,
                    statut_vu,
                    date_notification
                """;

        return jdbcTemplate.queryForObject(
                sql,
                notificationRowMapper,
                notification.getIdUser(),
                notification.getTitre(),
                notification.getMessage(),
                notification.getStatutVu(),
                id
        );
    }
    
    public Notification marquerCommeVue(Long id) {

        String sql = """
                UPDATE notification
                SET statut_vu = TRUE
                WHERE id = ?
                RETURNING
                    id,
                    id_user,
                    titre,
                    message,
                    statut_vu,
                    date_notification
                """;

        return jdbcTemplate.queryForObject(
                sql,
                notificationRowMapper,
                id
        );
    }
    
    public void marquerToutesCommeVues(Long idUser) {

        String sql = """
                UPDATE notification
                SET statut_vu = TRUE
                WHERE id_user = ?
                  AND statut_vu = FALSE
                """;

        jdbcTemplate.update(
                sql,
                idUser
        );
    }
    
    public void deleteNotification(Long id) {

        String sql = """
                DELETE FROM notification
                WHERE id = ?
                """;

        jdbcTemplate.update(
                sql,
                id
        );
    }
}