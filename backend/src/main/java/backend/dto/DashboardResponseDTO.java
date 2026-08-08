package backend.dto;

public class DashboardResponseDTO {

    private long totalComplaints;
    private long pendingComplaints;
    private long assignedComplaints;
    private long resolvedComplaints;

    private long totalStaff;
    private long availableStaff;

    public DashboardResponseDTO() {
    }

    public long getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(long totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public long getPendingComplaints() {
        return pendingComplaints;
    }

    public void setPendingComplaints(long pendingComplaints) {
        this.pendingComplaints = pendingComplaints;
    }

    public long getAssignedComplaints() {
        return assignedComplaints;
    }

    public void setAssignedComplaints(long assignedComplaints) {
        this.assignedComplaints = assignedComplaints;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public long getAvailableStaff() {
        return availableStaff;
    }

    public void setAvailableStaff(long availableStaff) {
        this.availableStaff = availableStaff;
    }
}