package backend.dto;

public class StaffPerformanceDTO {

    private Long staffId;
    private String staffName;
    private Long completedTasks;

    public StaffPerformanceDTO(Long staffId,
                               String staffName,
                               Long completedTasks) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.completedTasks = completedTasks;
    }

    public Long getStaffId() {
        return staffId;
    }

    public String getStaffName() {
        return staffName;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }
}