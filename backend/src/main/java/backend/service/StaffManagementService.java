package backend.service;

import backend.dto.StaffAssignedComplaintDTO;
import backend.dto.StaffAssignedTaskDTO;
import backend.dto.StaffAvailabilityDTO;
import backend.dto.StaffListItemDTO;
import backend.dto.StaffManagementPerformanceDTO;
import backend.dto.StaffManagementRequestDTO;
import backend.dto.StaffPageResponseDTO;
import backend.dto.StaffProfileDTO;
import backend.entity.Complaint;
import backend.entity.Staff;
import backend.entity.Task;
import backend.repository.ComplaintRepository;
import backend.repository.StaffRepository;
import backend.repository.TaskRepository;
import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StaffManagementService {
    private final StaffRepository staffRepository;
    private final ComplaintRepository complaintRepository;
    private final TaskRepository taskRepository;

    public StaffManagementService(StaffRepository staffRepository, ComplaintRepository complaintRepository, TaskRepository taskRepository) {
        this.staffRepository = staffRepository;
        this.complaintRepository = complaintRepository;
        this.taskRepository = taskRepository;
    }

    public StaffPageResponseDTO listStaff(String search, String department, String zone, Boolean available,
            int page, int size, String sortBy, String sortDirection) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        String query = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
        List<StaffListItemDTO> filtered = staffRepository.findAll().stream()
                .map(this::toListItem)
                .filter(staff -> query.isEmpty() || staff.getName().toLowerCase(Locale.ROOT).contains(query)
                        || staff.getEmail().toLowerCase(Locale.ROOT).contains(query)
                        || value(staff.getDepartment()).toLowerCase(Locale.ROOT).contains(query))
                .filter(staff -> department == null || department.isBlank() || department.equalsIgnoreCase(staff.getDepartment()))
                .filter(staff -> zone == null || zone.isBlank() || zone.equalsIgnoreCase(staff.getZone()))
                .filter(staff -> available == null || available.equals(staff.getAvailable()))
                .sorted(staffComparator(sortBy, sortDirection))
                .collect(Collectors.toList());

        long total = filtered.size();
        int from = Math.min(safePage * safeSize, filtered.size());
        int to = Math.min(from + safeSize, filtered.size());
        return new StaffPageResponseDTO(filtered.subList(from, to), safePage, safeSize, total);
    }

    public StaffProfileDTO getProfile(Long staffId) {
        Staff staff = findStaff(staffId);
        List<Task> tasks = taskRepository.findByStaffId(staffId);
        StaffListItemDTO summary = toListItem(staff);
        StaffManagementPerformanceDTO performance = performance(tasks);
        List<StaffAssignedComplaintDTO> complaints = tasks.stream()
                .map(task -> complaintRepository.findById(task.getComplaintId()).orElse(null))
                .filter(java.util.Objects::nonNull)
                .map(this::toComplaint)
                .distinct()
                .collect(Collectors.toList());
        List<StaffAssignedTaskDTO> assignedTasks = tasks.stream().map(this::toTask).collect(Collectors.toList());
        return new StaffProfileDTO(summary, performance, complaints, assignedTasks);
    }

    @Transactional
    public StaffListItemDTO createStaff(StaffManagementRequestDTO request) {
        Staff staff = new Staff();
        apply(staff, request);
        if (staff.getAvailable() == null) staff.setAvailable(true);
        return toListItem(staffRepository.save(staff));
    }

    @Transactional
    public StaffListItemDTO updateStaff(Long staffId, StaffManagementRequestDTO request) {
        Staff staff = findStaff(staffId);
        apply(staff, request);
        return toListItem(staffRepository.save(staff));
    }

    @Transactional
    public StaffListItemDTO updateAvailability(Long staffId, StaffAvailabilityDTO request) {
        Staff staff = findStaff(staffId);
        staff.setAvailable(request.getAvailable());
        return toListItem(staffRepository.save(staff));
    }

    private Staff findStaff(Long staffId) {
        return staffRepository.findById(staffId).orElseThrow(() -> new IllegalArgumentException("Staff not found"));
    }

    private void apply(Staff staff, StaffManagementRequestDTO request) {
        staff.setName(request.getName());
        staff.setEmail(request.getEmail());
        staff.setPhone(request.getPhone());
        staff.setDepartment(request.getDepartment());
        staff.setZone(request.getZone());
        if (request.getAvailable() != null) staff.setAvailable(request.getAvailable());
    }

    private StaffListItemDTO toListItem(Staff staff) {
        List<Task> tasks = taskRepository.findByStaffId(staff.getId());
        StaffListItemDTO result = new StaffListItemDTO();
        result.setId(staff.getId()); result.setName(staff.getName()); result.setEmail(staff.getEmail());
        result.setPhone(staff.getPhone()); result.setDepartment(staff.getDepartment()); result.setZone(staff.getZone());
        result.setAvailable(staff.getAvailable());
        result.setAssignedTasks(tasks.stream().filter(task -> !"COMPLETED".equalsIgnoreCase(task.getStatus())).count());
        result.setResolvedComplaints(tasks.stream().filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus())).count());
        long completed = tasks.stream().filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus())).count();
        result.setTaskCompletionRate(tasks.isEmpty() ? 0 : Math.round(completed * 10000.0 / tasks.size()) / 100.0);
        return result;
    }

    private StaffManagementPerformanceDTO performance(List<Task> tasks) {
        long completed = tasks.stream().filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus())).count();
        List<Task> timed = tasks.stream().filter(task -> task.getAssignedAt() != null && task.getCompletedAt() != null).collect(Collectors.toList());
        double averageHours = timed.isEmpty() ? 0 : Math.round(timed.stream().mapToLong(task -> Duration.between(task.getAssignedAt(), task.getCompletedAt()).toMinutes()).average().orElse(0) / 60.0 * 100) / 100.0;
        long active = tasks.stream().filter(task -> !"COMPLETED".equalsIgnoreCase(task.getStatus())).count();
        double rate = tasks.isEmpty() ? 0 : Math.round(completed * 10000.0 / tasks.size()) / 100.0;
        return new StaffManagementPerformanceDTO(
                completed,
                averageHours,
                rate,
                active,
                tasks.size());
    }

    private StaffAssignedComplaintDTO toComplaint(Complaint complaint) {
        return new StaffAssignedComplaintDTO(complaint.getId(), complaint.getTitle(), complaint.getPriority(), complaint.getStatus(), complaint.getCreatedAt());
    }

    private StaffAssignedTaskDTO toTask(Task task) {
        String status = "ASSIGNED".equalsIgnoreCase(task.getStatus()) ? "IN_PROGRESS" : task.getStatus();
        return new StaffAssignedTaskDTO(task.getId(), task.getComplaintId(), status, task.getAssignedAt(), task.getCompletedAt());
    }

    private Comparator<StaffListItemDTO> staffComparator(String sortBy, String direction) {
        Comparator<StaffListItemDTO> comparator;
        if ("assignedTasks".equals(sortBy)) comparator = Comparator.comparingLong(StaffListItemDTO::getAssignedTasks);
        else if ("resolvedComplaints".equals(sortBy)) comparator = Comparator.comparingLong(StaffListItemDTO::getResolvedComplaints);
        else comparator = Comparator.comparing(StaffListItemDTO::getName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
        return "desc".equalsIgnoreCase(direction) ? comparator.reversed() : comparator;
    }

    private String value(String input) { return input == null ? "" : input; }
}
