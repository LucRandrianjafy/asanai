package mg.asanai.model;

import java.math.BigDecimal;

public class TestNiveauQuestion {

    private Long id;
    private String question;
    private String answers;
    private Integer correctAnswerIdx;
    private Integer answerIdx;
    private BigDecimal points;
    private Integer dureeMinutes;
    private Long idTestNiveau;
    private Long idCategorieQuestion;

    public TestNiveauQuestion() {
    }

    public TestNiveauQuestion(
            Long id,
            String question,
            String answers,
            Integer correctAnswerIdx,
            Integer answerIdx,
            BigDecimal points,
            Integer dureeMinutes,
            Long idTestNiveau,
            Long idCategorieQuestion) {

        this.id = id;
        this.question = question;
        this.answers = answers;
        this.correctAnswerIdx = correctAnswerIdx;
        this.answerIdx = answerIdx;
        this.points = points;
        this.dureeMinutes = dureeMinutes;
        this.idTestNiveau = idTestNiveau;
        this.idCategorieQuestion = idCategorieQuestion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswers() {
        return answers;
    }

    public void setAnswers(String answers) {
        this.answers = answers;
    }

    public Integer getCorrectAnswerIdx() {
        return correctAnswerIdx;
    }

    public void setCorrectAnswerIdx(Integer correctAnswerIdx) {
        this.correctAnswerIdx = correctAnswerIdx;
    }

    public Integer getAnswerIdx() {
        return answerIdx;
    }

    public void setAnswerIdx(Integer answerIdx) {
        this.answerIdx = answerIdx;
    }

    public BigDecimal getPoints() {
        return points;
    }

    public void setPoints(BigDecimal points) {
        this.points = points;
    }

    public Integer getDureeMinutes() {
        return dureeMinutes;
    }

    public void setDureeMinutes(Integer dureeMinutes) {
        this.dureeMinutes = dureeMinutes;
    }

    public Long getIdTestNiveau() {
        return idTestNiveau;
    }

    public void setIdTestNiveau(Long idTestNiveau) {
        this.idTestNiveau = idTestNiveau;
    }

    public Long getIdCategorieQuestion() {
        return idCategorieQuestion;
    }

    public void setIdCategorieQuestion(Long idCategorieQuestion) {
        this.idCategorieQuestion = idCategorieQuestion;
    }
}