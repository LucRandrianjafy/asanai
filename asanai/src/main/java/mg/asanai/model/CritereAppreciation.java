package mg.asanai.model;

public class CritereAppreciation {

    private Long id;
    private String nom;
    private String description;
    private Boolean statut;

    public CritereAppreciation() {
    }

    public CritereAppreciation(Long id, String nom, String description, Boolean statut) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.statut = statut;
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getStatut() {
        return statut;
    }

    public void setStatut(Boolean statut) {
        this.statut = statut;
    }
}