package mg.asanai.model;

import java.time.LocalDateTime;

public class CandidatAppreciation {

    private Long id;
    private Long idUserInformation;
    private Long idRh;
    private Long idCritere;
    private Long idAppreciation;
    private LocalDateTime dateAppreciation;

    public CandidatAppreciation() {
    }

    public CandidatAppreciation(
            Long id,
            Long idUserInformation,
            Long idRh,
            Long idCritere,
            Long idAppreciation,
            LocalDateTime dateAppreciation) {

        this.id = id;
        this.idUserInformation = idUserInformation;
        this.idRh = idRh;
        this.idCritere = idCritere;
        this.idAppreciation = idAppreciation;
        this.dateAppreciation = dateAppreciation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUserInformation() {
        return idUserInformation;
    }

    public void setIdUserInformation(Long idUserInformation) {
        this.idUserInformation = idUserInformation;
    }

    public Long getIdRh() {
        return idRh;
    }

    public void setIdRh(Long idRh) {
        this.idRh = idRh;
    }

    public Long getIdCritere() {
        return idCritere;
    }

    public void setIdCritere(Long idCritere) {
        this.idCritere = idCritere;
    }

    public Long getIdAppreciation() {
        return idAppreciation;
    }

    public void setIdAppreciation(Long idAppreciation) {
        this.idAppreciation = idAppreciation;
    }

    public LocalDateTime getDateAppreciation() {
        return dateAppreciation;
    }

    public void setDateAppreciation(LocalDateTime dateAppreciation) {
        this.dateAppreciation = dateAppreciation;
    }
}