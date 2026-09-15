package mg.asanai.model;

public class Programme {

    private Long id;
    private String nom;
    private Boolean statut;

    public Programme() {
    }

    public Programme(Long id, String nom, Boolean statut) {
        this.id = id;
        this.nom = nom;
        this.statut = statut;
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

    public Boolean getStatut() {
        return statut;
    }

    public void setStatut(Boolean statut) {
        this.statut = statut;
    }
}