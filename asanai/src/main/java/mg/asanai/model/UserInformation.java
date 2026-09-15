package mg.asanai.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserInformation {

    private Long id;
    private Long idProgramme;
    private Long idUser;

    // Candidat
    private String niveauEtudes;
    private Boolean independanceFinanciere;
    private String disponibiliteEngagment;
    private LocalDate dateDisponibilite;

    // Formateur
    private String interetPoste;
    private String niveauFrancais;
    private String clareteOrale;
    private String comprehensionOrale;

    // Fichiers
    private String cinFichier;
    private String dernierDiplomeFichier;
    private String cvFichier;

    private LocalDateTime dateInfo;

    public UserInformation() {
    }

    public UserInformation(
            Long id,
            Long idProgramme,
            Long idUser,
            String niveauEtudes,
            Boolean independanceFinanciere,
            String disponibiliteEngagment,
            LocalDate dateDisponibilite,
            String interetPoste,
            String niveauFrancais,
            String clareteOrale,
            String comprehensionOrale,
            String cinFichier,
            String dernierDiplomeFichier,
            String cvFichier,
            LocalDateTime dateInfo
    ) {
        this.id = id;
        this.idProgramme = idProgramme;
        this.idUser = idUser;
        this.niveauEtudes = niveauEtudes;
        this.independanceFinanciere = independanceFinanciere;
        this.disponibiliteEngagment = disponibiliteEngagment;
        this.dateDisponibilite = dateDisponibilite;
        this.interetPoste = interetPoste;
        this.niveauFrancais = niveauFrancais;
        this.clareteOrale = clareteOrale;
        this.comprehensionOrale = comprehensionOrale;
        this.cinFichier = cinFichier;
        this.dernierDiplomeFichier = dernierDiplomeFichier;
        this.cvFichier = cvFichier;
        this.dateInfo = dateInfo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdProgramme() {
        return idProgramme;
    }

    public void setIdProgramme(Long idProgramme) {
        this.idProgramme = idProgramme;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getNiveauEtudes() {
        return niveauEtudes;
    }

    public void setNiveauEtudes(String niveauEtudes) {
        this.niveauEtudes = niveauEtudes;
    }

    public Boolean getIndependanceFinanciere() {
        return independanceFinanciere;
    }

    public void setIndependanceFinanciere(Boolean independanceFinanciere) {
        this.independanceFinanciere = independanceFinanciere;
    }

    public String getDisponibiliteEngagment() {
        return disponibiliteEngagment;
    }

    public void setDisponibiliteEngagment(String disponibiliteEngagment) {
        this.disponibiliteEngagment = disponibiliteEngagment;
    }

    public LocalDate getDateDisponibilite() {
        return dateDisponibilite;
    }

    public void setDateDisponibilite(LocalDate dateDisponibilite) {
        this.dateDisponibilite = dateDisponibilite;
    }

    public String getInteretPoste() {
        return interetPoste;
    }

    public void setInteretPoste(String interetPoste) {
        this.interetPoste = interetPoste;
    }

    public String getNiveauFrancais() {
        return niveauFrancais;
    }

    public void setNiveauFrancais(String niveauFrancais) {
        this.niveauFrancais = niveauFrancais;
    }

    public String getClareteOrale() {
        return clareteOrale;
    }

    public void setClareteOrale(String clareteOrale) {
        this.clareteOrale = clareteOrale;
    }

    public String getComprehensionOrale() {
        return comprehensionOrale;
    }

    public void setComprehensionOrale(String comprehensionOrale) {
        this.comprehensionOrale = comprehensionOrale;
    }

    public String getCinFichier() {
        return cinFichier;
    }

    public void setCinFichier(String cinFichier) {
        this.cinFichier = cinFichier;
    }

    public String getDernierDiplomeFichier() {
        return dernierDiplomeFichier;
    }

    public void setDernierDiplomeFichier(String dernierDiplomeFichier) {
        this.dernierDiplomeFichier = dernierDiplomeFichier;
    }

    public String getCvFichier() {
        return cvFichier;
    }

    public void setCvFichier(String cvFichier) {
        this.cvFichier = cvFichier;
    }

    public LocalDateTime getDateInfo() {
        return dateInfo;
    }

    public void setDateInfo(LocalDateTime dateInfo) {
        this.dateInfo = dateInfo;
    }
}