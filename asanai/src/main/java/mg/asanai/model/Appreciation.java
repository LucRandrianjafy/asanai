package mg.asanai.model;

public class Appreciation {

    private Long id;
    private Long idCritere;
    private String libelle;
    private Double points;
    private Boolean statut;

    public Appreciation() {
    }

    public Appreciation(
            Long id,
            Long idCritere,
            String libelle,
            Double points,
            Boolean statut) {

        this.id = id;
        this.idCritere = idCritere;
        this.libelle = libelle;
        this.points = points;
        this.statut = statut;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCritere() {
        return idCritere;
    }

    public void setIdCritere(Long idCritere) {
        this.idCritere = idCritere;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Double getPoints() {
        return points;
    }

    public void setPoints(Double points) {
        this.points = points;
    }

    public Boolean getStatut() {
        return statut;
    }

    public void setStatut(Boolean statut) {
        this.statut = statut;
    }
}