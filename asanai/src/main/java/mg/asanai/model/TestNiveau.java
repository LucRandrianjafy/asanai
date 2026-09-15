package mg.asanai.model;

import java.time.LocalDateTime;

public class TestNiveau {

    private Long id;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long idProgramme;
    private Long idTestType;
    private Long idUsers;
    private Long idCampus;

    public TestNiveau() {
    }

    public TestNiveau(
            Long id,
            String description,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long idProgramme,
            Long idTestType,
            Long idUsers,
            Long idCampus) {

        this.id = id;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.idProgramme = idProgramme;
        this.idTestType = idTestType;
        this.idUsers = idUsers;
        this.idCampus = idCampus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Long getIdProgramme() {
        return idProgramme;
    }

    public void setIdProgramme(Long idProgramme) {
        this.idProgramme = idProgramme;
    }

    public Long getIdTestType() {
        return idTestType;
    }

    public void setIdTestType(Long idTestType) {
        this.idTestType = idTestType;
    }

    public Long getIdUsers() {
        return idUsers;
    }

    public void setIdUsers(Long idUsers) {
        this.idUsers = idUsers;
    }

    public Long getIdCampus() {
        return idCampus;
    }

    public void setIdCampus(Long idCampus) {
        this.idCampus = idCampus;
    }
}