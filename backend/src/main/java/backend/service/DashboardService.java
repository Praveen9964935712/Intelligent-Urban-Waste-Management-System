package backend.service;

import backend.entity.Complaint;
import backend.dto.PriorityStatsDTO;
import backend.dto.ComplaintHistoryDTO;
import backend.repository.TaskRepository;
import backend.dto.StaffPerformanceDTO;
import backend.dto.ZoneStatsDTO;
import backend.dto.TaskStatsDTO;

import java.util.List;
import backend.dto.DashboardResponseDTO;
import backend.repository.ComplaintRepository;
import backend.repository.StaffRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private StaffRepository staffRepository;

     @Autowired
    private TaskRepository taskRepository;

    public List<ZoneStatsDTO> getZoneStats() {

    return complaintRepository.getZoneStatistics();

}

    public List<PriorityStatsDTO> getPriorityStats() {

    return complaintRepository.getPriorityStatistics();
}

public List<Complaint> getRecentComplaints() {

    return complaintRepository
            .findTop5ByOrderByCreatedAtDesc();
}

public List<StaffPerformanceDTO> getStaffPerformance() {
    return taskRepository.getStaffPerformance();
}

    public DashboardResponseDTO getDashboardStats() {

        DashboardResponseDTO dto = new DashboardResponseDTO();

        dto.setTotalComplaints(
                complaintRepository.count());

        dto.setPendingComplaints(
                complaintRepository.countByStatus("PENDING"));

        dto.setAssignedComplaints(
                complaintRepository.countByStatus("ASSIGNED"));

        dto.setResolvedComplaints(
                complaintRepository.countByStatus("RESOLVED"));

        dto.setTotalStaff(
                staffRepository.count());

        dto.setAvailableStaff(
                staffRepository.countByAvailableTrue());

        return dto;
    }
    public ComplaintHistoryDTO getComplaintHistory() {

    ComplaintHistoryDTO dto = new ComplaintHistoryDTO();

    dto.setPending(
            complaintRepository.countByStatus("PENDING"));

    dto.setAssigned(
            complaintRepository.countByStatus("ASSIGNED"));

    dto.setResolved(
            complaintRepository.countByStatus("RESOLVED"));

    dto.setTotal(
            complaintRepository.count());

    return dto;
}

    public TaskStatsDTO getTaskStats() {

    TaskStatsDTO dto = new TaskStatsDTO();

    dto.setAssignedTasks(
            taskRepository.count());

    dto.setCompletedTasks(
            taskRepository.countByStatus("COMPLETED"));

    dto.setPendingTasks(
            taskRepository.countByStatus("ASSIGNED"));

    return dto;
}

}