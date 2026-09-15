package mg.asanai.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserProgramme {

    private Long userInformationId;
    private Long userId;

    // =========================
    // USER
    // =========================
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String residenceTana;
    private LocalDate dateNaissance;
    private String genre;
    private String cin;
    private LocalDate cinDateDelivrance;
    private String cinLieuDelivrance;
    private String dernierDiplomeObtenu;

    // =========================
    // REGION
    // =========================
    private Long regionId;
    private String regionNom;

    // =========================
    // PROGRAMME
    // =========================
    private Long programmeId;
    private String programmeNom;

    // =========================
    // USER INFORMATION
    // =========================
    private String niveauEtudes;
    private Boolean independanceFinanciere;
    private String disponibiliteEngagment;
    private LocalDate dateDisponibilite;

    private String interetPoste;

    // =========================
    // EVALUATION ORALE / FRANCAIS
    // =========================
    private String niveauFrancais;
    private String clareteOrale;
    private String comprehensionOrale;

    // =========================
    // FICHIERS
    // =========================
    private String cinFichier;
    private String dernierDiplomeFichier;
    private String cvFichier;

    // =========================
    // DATE INFORMATION
    // =========================
    private LocalDateTime dateInfo;

    public UserProgramme() {
    }

    public UserProgramme(
            Long userInformationId,
            Long userId,
            String nom,
            String prenom,
            String email,
            String telephone,
            String adresse,
            String residenceTana,
            LocalDate dateNaissance,
            String genre,
            String cin,
            LocalDate cinDateDelivrance,
            String cinLieuDelivrance,
            String dernierDiplomeObtenu,
            Long regionId,
            String regionNom,
            Long programmeId,
            String programmeNom,
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
            LocalDateTime dateInfo) {

        this.userInformationId = userInformationId;
        this.userId = userId;

        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.adresse = adresse;
        this.residenceTana = residenceTana;
        this.dateNaissance = dateNaissance;
        this.genre = genre;
        this.cin = cin;
        this.cinDateDelivrance = cinDateDelivrance;
        this.cinLieuDelivrance = cinLieuDelivrance;
        this.dernierDiplomeObtenu = dernierDiplomeObtenu;

        this.regionId = regionId;
        this.regionNom = regionNom;

        this.programmeId = programmeId;
        this.programmeNom = programmeNom;

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
    public Long getUserInformationId() {
        return userInformationId;
    }

    public void setUserInformationId(Long userInformationId) {
        this.userInformationId = userInformationId;
    }
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
    public String getResidenceTana() {
        return residenceTana;
    }

    public void setResidenceTana(String residenceTana) {
        this.residenceTana = residenceTana;
    }
    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }
    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }
    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }
    public LocalDate getCinDateDelivrance() {
        return cinDateDelivrance;
    }

    public void setCinDateDelivrance(LocalDate cinDateDelivrance) {
        this.cinDateDelivrance = cinDateDelivrance;
    }
    public String getCinLieuDelivrance() {
        return cinLieuDelivrance;
    }

    public void setCinLieuDelivrance(String cinLieuDelivrance) {
        this.cinLieuDelivrance = cinLieuDelivrance;
    }
    public String getDernierDiplomeObtenu() {
        return dernierDiplomeObtenu;
    }

    public void setDernierDiplomeObtenu(String dernierDiplomeObtenu) {
        this.dernierDiplomeObtenu = dernierDiplomeObtenu;
    }
    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }
    public String getRegionNom() {
        return regionNom;
    }

    public void setRegionNom(String regionNom) {
        this.regionNom = regionNom;
    }
    public Long getProgrammeId() {
        return programmeId;
    }

    public void setProgrammeId(Long programmeId) {
        this.programmeId = programmeId;
    }
    public String getProgrammeNom() {
        return programmeNom;
    }

    public void setProgrammeNom(String programmeNom) {
        this.programmeNom = programmeNom;
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