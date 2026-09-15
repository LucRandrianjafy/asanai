package mg.asanai.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CandidatScoreFinal {

    private Long idUser;

    private String nom;
    private String prenom;
    private String cin;
    private String email;
    private String telephone;
    private String adresse;
    private String residenceTana;
    private LocalDate dateNaissance;
    private String genre;

    private Long roleId;
    private String role;

    private Long regionId;
    private String region;

    private Long idProgramme;
    private String programme;

    private String niveauEtudes;
    private String disponibiliteEngagment;
    private Boolean independanceFinanciere;

    private BigDecimal noteRegion;
    private BigDecimal noteNiveauEtudes;
    private BigDecimal noteDispoEngagement;
    private BigDecimal noteIndependanceFinanciere;
    private BigDecimal noteSkillMatching;

    private String interetPoste;
    private String niveauFrancais;
    private String clareteOrale;
    private String comprehensionOrale;

    private BigDecimal noteInteretPoste;
    private BigDecimal noteNiveauFrancais;
    private BigDecimal noteClarteOrale;
    private BigDecimal noteComprehensionOrale;
    private BigDecimal notePrequalification;

    private BigDecimal noteObtenueTestNiveau;
    private BigDecimal noteMaxTestNiveau;

    private BigDecimal noteGeneraleSur100;

    public CandidatScoreFinal() {
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
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

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
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

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Long getIdProgramme() {
        return idProgramme;
    }

    public void setIdProgramme(Long idProgramme) {
        this.idProgramme = idProgramme;
    }

    public String getProgramme() {
        return programme;
    }

    public void setProgramme(String programme) {
        this.programme = programme;
    }

    public String getNiveauEtudes() {
        return niveauEtudes;
    }

    public void setNiveauEtudes(String niveauEtudes) {
        this.niveauEtudes = niveauEtudes;
    }

    public String getDisponibiliteEngagment() {
        return disponibiliteEngagment;
    }

    public void setDisponibiliteEngagment(String disponibiliteEngagment) {
        this.disponibiliteEngagment = disponibiliteEngagment;
    }

    public Boolean getIndependanceFinanciere() {
        return independanceFinanciere;
    }

    public void setIndependanceFinanciere(Boolean independanceFinanciere) {
        this.independanceFinanciere = independanceFinanciere;
    }

    public BigDecimal getNoteRegion() {
        return noteRegion;
    }

    public void setNoteRegion(BigDecimal noteRegion) {
        this.noteRegion = noteRegion;
    }

    public BigDecimal getNoteNiveauEtudes() {
        return noteNiveauEtudes;
    }

    public void setNoteNiveauEtudes(BigDecimal noteNiveauEtudes) {
        this.noteNiveauEtudes = noteNiveauEtudes;
    }

    public BigDecimal getNoteDispoEngagement() {
        return noteDispoEngagement;
    }

    public void setNoteDispoEngagement(BigDecimal noteDispoEngagement) {
        this.noteDispoEngagement = noteDispoEngagement;
    }

    public BigDecimal getNoteIndependanceFinanciere() {
        return noteIndependanceFinanciere;
    }

    public void setNoteIndependanceFinanciere(BigDecimal noteIndependanceFinanciere) {
        this.noteIndependanceFinanciere = noteIndependanceFinanciere;
    }

    public BigDecimal getNoteSkillMatching() {
        return noteSkillMatching;
    }

    public void setNoteSkillMatching(BigDecimal noteSkillMatching) {
        this.noteSkillMatching = noteSkillMatching;
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

    public String getClarteOrale() {
        return clareteOrale;
    }

    public void setClarteOrale(String clareteOrale) {
        this.clareteOrale = clareteOrale;
    }

    public String getComprehensionOrale() {
        return comprehensionOrale;
    }

    public void setComprehensionOrale(String comprehensionOrale) {
        this.comprehensionOrale = comprehensionOrale;
    }

    public BigDecimal getNoteInteretPoste() {
        return noteInteretPoste;
    }

    public void setNoteInteretPoste(BigDecimal noteInteretPoste) {
        this.noteInteretPoste = noteInteretPoste;
    }

    public BigDecimal getNoteNiveauFrancais() {
        return noteNiveauFrancais;
    }

    public void setNoteNiveauFrancais(BigDecimal noteNiveauFrancais) {
        this.noteNiveauFrancais = noteNiveauFrancais;
    }

    public BigDecimal getNoteClarteOrale() {
        return noteClarteOrale;
    }

    public void setNoteClarteOrale(BigDecimal noteClarteOrale) {
        this.noteClarteOrale = noteClarteOrale;
    }

    public BigDecimal getNoteComprehensionOrale() {
        return noteComprehensionOrale;
    }

    public void setNoteComprehensionOrale(BigDecimal noteComprehensionOrale) {
        this.noteComprehensionOrale = noteComprehensionOrale;
    }

    public BigDecimal getNotePrequalification() {
        return notePrequalification;
    }

    public void setNotePrequalification(BigDecimal notePrequalification) {
        this.notePrequalification = notePrequalification;
    }

    public BigDecimal getNoteObtenueTestNiveau() {
        return noteObtenueTestNiveau;
    }

    public void setNoteObtenueTestNiveau(BigDecimal noteObtenueTestNiveau) {
        this.noteObtenueTestNiveau = noteObtenueTestNiveau;
    }

    public BigDecimal getNoteMaxTestNiveau() {
        return noteMaxTestNiveau;
    }

    public void setNoteMaxTestNiveau(BigDecimal noteMaxTestNiveau) {
        this.noteMaxTestNiveau = noteMaxTestNiveau;
    }

    public BigDecimal getNoteGeneraleSur100() {
        return noteGeneraleSur100;
    }

    public void setNoteGeneraleSur100(BigDecimal noteGeneraleSur100) {
        this.noteGeneraleSur100 = noteGeneraleSur100;
    }
}