package backend.dto;

public class ZoneStatsDTO {

    private String zone;
    private Long complaints;

    public ZoneStatsDTO() {
    }

    public ZoneStatsDTO(String zone, Long complaints) {
        this.zone = zone;
        this.complaints = complaints;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public Long getComplaints() {
        return complaints;
    }

    public void setComplaints(Long complaints) {
        this.complaints = complaints;
    }
}