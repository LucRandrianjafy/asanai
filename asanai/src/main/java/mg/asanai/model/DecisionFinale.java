package mg.asanai.model;

import java.time.LocalDateTime;

public class DecisionFinale {

    private Long id;
    private Long idUserInformation;
    private Long idRh;
    private String decision;
    private LocalDateTime dateEvaluation;

    public DecisionFinale() {
    }

    public DecisionFinale(
            Long id,
            Long idUserInformation,
            Long idRh,
            String decision,
            LocalDateTime dateEvaluation) {

        this.id = id;
        this.idUserInformation = idUserInformation;
        this.idRh = idRh;
        this.decision = decision;
        this.dateEvaluation = dateEvaluation;
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

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public LocalDateTime getDateEvaluation() {
        return dateEvaluation;
    }

    public void setDateEvaluation(LocalDateTime dateEvaluation) {
        this.dateEvaluation = dateEvaluation;
    }
}