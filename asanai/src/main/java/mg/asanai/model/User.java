package mg.asanai.model;

import java.time.LocalDate;

public class User {

    private Long id;
    private String nom;
    private String prenom;
    private String password;
    private String cin;
    private String email;
    private String telephone;
    private String adresse;
    private LocalDate dateNaissance;
    private String genre;
    private String residenceTana;
    private Long regionId;
    private Long roleId;
    private LocalDate cinDateDelivrance;
    private String cinLieuDelivrance;
    private String dernierDiplomeObtenu;

    public User() {
    }

    public User(
            Long id,
            String nom,
            String prenom,
            String password,
            String cin,
            String email,
            String telephone,
            String adresse,
            LocalDate dateNaissance,
            String genre,
            String residenceTana,
            Long regionId,
            Long roleId,
            LocalDate cinDateDelivrance,
            String cinLieuDelivrance,
            String dernierDiplomeObtenu
    ) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.password = password;
        this.cin = cin;
        this.email = email;
        this.telephone = telephone;
        this.adresse = adresse;
        this.dateNaissance = dateNaissance;
        this.genre = genre;
        this.residenceTana = residenceTana;
        this.regionId = regionId;
        this.roleId = roleId;
        this.cinDateDelivrance = cinDateDelivrance;
        this.cinLieuDelivrance = cinLieuDelivrance;
        this.dernierDiplomeObtenu = dernierDiplomeObtenu;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getResidenceTana() {
        return residenceTana;
    }

    public void setResidenceTana(String residenceTana) {
        this.residenceTana = residenceTana;
    }

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
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
}