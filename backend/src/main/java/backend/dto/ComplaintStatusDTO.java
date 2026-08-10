package backend.dto;

public class ComplaintStatusDTO {

    private String status;
    private Long count;

    public ComplaintStatusDTO(String status, Long count) {
        this.status = status;
        this.count = count;
    }

    public String getStatus() {
        return status;
    }

    public Long getCount() {
        return count;
    }
}