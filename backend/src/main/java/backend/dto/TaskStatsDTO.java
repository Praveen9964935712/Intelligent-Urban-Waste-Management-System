package backend.dto;

public class TaskStatsDTO {

    private Long assignedTasks;
    private Long completedTasks;
    private Long pendingTasks;

    public Long getAssignedTasks() {
        return assignedTasks;
    }

    public void setAssignedTasks(Long assignedTasks) {
        this.assignedTasks = assignedTasks;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(Long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }
}