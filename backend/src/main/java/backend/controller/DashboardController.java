package backend.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import backend.entity.Notification;
import backend.dto.ComplaintTrendDTO;
import backend.entity.Complaint;
import backend.dto.PriorityStatsDTO;
import backend.dto.ComplaintHistoryDTO;
import backend.dto.*;
import backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@SecurityRequirement(name = "BearerAuth")
public class DashboardController {
    

    
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/staff-performance")
    public List<StaffPerformanceDTO> getStaffPerformance() {
        return dashboardService.getStaffPerformance();
    }

    @GetMapping("/stats")
    public DashboardResponseDTO getStats() {
        return dashboardService.getDashboardStats();
    }

    @GetMapping("/zones")
    public List<ZoneStatsDTO> getZoneStats() {
        return dashboardService.getZoneStats();
    }

    @GetMapping("/priorities")
    public java.util.List<PriorityStatsDTO> getPriorityStats() {

    return dashboardService.getPriorityStats();
    }

    @GetMapping("/status")
    public java.util.List getStatusStats() {

    return dashboardService.getStatusStats();
    }


    @GetMapping("/staff-workload")
    public List<backend.dto.StaffWorkloadDTO> getStaffWorkload() {
    return dashboardService.getStaffWorkload();
    }

    @GetMapping("/recent-complaints")
    public List<Complaint> getRecentComplaints() {

        return dashboardService.getRecentComplaints();
    }

    @GetMapping("/complaint-trend")
    public java.util.List<ComplaintTrendDTO> getComplaintTrend() {

    return dashboardService.getComplaintTrend();

    }

    @GetMapping("/task-stats")
    public TaskStatsDTO getTaskStats() {
    return dashboardService.getTaskStats();
    }

    @GetMapping("/complaint-history")
    public ComplaintHistoryDTO getComplaintHistory() {

        return dashboardService.getComplaintHistory();
    } 


    @GetMapping("/activity")
    public List<Notification> getRecentActivity() {

    return dashboardService.getRecentActivity();
}
}
