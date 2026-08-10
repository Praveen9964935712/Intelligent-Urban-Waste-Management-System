package backend.dto;

public class StaffWorkloadDTO {

    private String staffName;
    private Long assignedTasks;

    public StaffWorkloadDTO(String staffName, Long assignedTasks) {
        this.staffName = staffName;
        this.assignedTasks = assignedTasks;
    }

    public String getStaffName() {
        return staffName;
    }

    public Long getAssignedTasks() {
        return assignedTasks;
    }
}