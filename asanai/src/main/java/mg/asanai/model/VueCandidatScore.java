package mg.asanai.model;

public class VueCandidatScore {

    private Long idUser;
    private String nom;
    private String prenom;
    private String cin;
    private String email;
    private String telephone;
    private String adresse;
    private String residenceTana;
    private String dateNaissance;
    private String genre;

    private Long roleId;
    private String role;

    private Long regionId;
    private String region;

    private Long idProgramme;
    private String programme;

    private String niveauEtudes;

    // Disponibilité / engagement
    private String disponibiliteEngagment;

    // Indépendance financière
    private Boolean independanceFinanciere;

    // Notes
    private Integer noteRegion;
    private Integer noteNiveauEtudes;
    private Integer noteDispoEngagement;
    private Integer noteIndependanceFinanciere;
    private Integer noteTotale;


    // ============================================================
    // CONSTRUCTEUR
    // ============================================================

    public VueCandidatScore() {
    }


    // ============================================================
    // ID USER
    // ============================================================

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }


    // ============================================================
    // NOM
    // ============================================================

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }


    // ============================================================
    // PRENOM
    // ============================================================

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }


    // ============================================================
    // CIN
    // ============================================================

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }


    // ============================================================
    // EMAIL
    // ============================================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    // ============================================================
    // TELEPHONE
    // ============================================================

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }


    // ============================================================
    // ADRESSE
    // ============================================================

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }


    // ============================================================
    // RESIDENCE TANA
    // ============================================================

    public String getResidenceTana() {
        return residenceTana;
    }

    public void setResidenceTana(String residenceTana) {
        this.residenceTana = residenceTana;
    }


    // ============================================================
    // DATE NAISSANCE
    // ============================================================

    public String getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(String dateNaissance) {
        this.dateNaissance = dateNaissance;
    }


    // ============================================================
    // GENRE
    // ============================================================

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }


    // ============================================================
    // ROLE
    // ============================================================

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


    // ============================================================
    // REGION
    // ============================================================

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


    // ============================================================
    // PROGRAMME
    // ============================================================

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


    // ============================================================
    // NIVEAU ETUDES
    // ============================================================

    public String getNiveauEtudes() {
        return niveauEtudes;
    }

    public void setNiveauEtudes(String niveauEtudes) {
        this.niveauEtudes = niveauEtudes;
    }


    // ============================================================
    // DISPONIBILITE / ENGAGEMENT
    // ============================================================

    public String getDisponibiliteEngagment() {
        return disponibiliteEngagment;
    }

    public void setDisponibiliteEngagment(
            String disponibiliteEngagment
    ) {
        this.disponibiliteEngagment = disponibiliteEngagment;
    }


    // ============================================================
    // INDEPENDANCE FINANCIERE
    // ============================================================

    public Boolean getIndependanceFinanciere() {
        return independanceFinanciere;
    }

    public void setIndependanceFinanciere(
            Boolean independanceFinanciere
    ) {
        this.independanceFinanciere = independanceFinanciere;
    }


    // ============================================================
    // NOTE REGION
    // ============================================================

    public Integer getNoteRegion() {
        return noteRegion;
    }

    public void setNoteRegion(Integer noteRegion) {
        this.noteRegion = noteRegion;
    }


    // ============================================================
    // NOTE NIVEAU ETUDES
    // ============================================================

    public Integer getNoteNiveauEtudes() {
        return noteNiveauEtudes;
    }

    public void setNoteNiveauEtudes(
            Integer noteNiveauEtudes
    ) {
        this.noteNiveauEtudes = noteNiveauEtudes;
    }


    // ============================================================
    // NOTE DISPONIBILITE / ENGAGEMENT
    // ============================================================

    public Integer getNoteDispoEngagement() {
        return noteDispoEngagement;
    }

    public void setNoteDispoEngagement(
            Integer noteDispoEngagement
    ) {
        this.noteDispoEngagement = noteDispoEngagement;
    }


    // ============================================================
    // NOTE INDEPENDANCE FINANCIERE
    // ============================================================

    public Integer getNoteIndependanceFinanciere() {
        return noteIndependanceFinanciere;
    }

    public void setNoteIndependanceFinanciere(
            Integer noteIndependanceFinanciere
    ) {
        this.noteIndependanceFinanciere =
                noteIndependanceFinanciere;
    }


    // ============================================================
    // NOTE TOTALE
    // ============================================================

    public Integer getNoteTotale() {
        return noteTotale;
    }

    public void setNoteTotale(Integer noteTotale) {
        this.noteTotale = noteTotale;
    }
}