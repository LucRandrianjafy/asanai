package mg.asanai.model;

import java.time.LocalDateTime;

public class Notification {

    private Long id;
    private Long idUser;
    private String titre;
    private String message;
    private Boolean statutVu;
    private LocalDateTime dateNotification;

    public Notification() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getStatutVu() {
        return statutVu;
    }

    public void setStatutVu(Boolean statutVu) {
        this.statutVu = statutVu;
    }

    public LocalDateTime getDateNotification() {
        return dateNotification;
    }

    public void setDateNotification(LocalDateTime dateNotification) {
        this.dateNotification = dateNotification;
    }
}