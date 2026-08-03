package backend.service;

import backend.dto.ComplaintRequestDTO;
import backend.entity.Complaint;
import backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class ComplaintService {
    public void deleteComplaint(Long id) {


Complaint complaint = complaintRepository.findById(id)
        .orElseThrow(() ->
                new RuntimeException("Complaint not found"));

complaintRepository.delete(complaint);


}

    public Complaint updateComplaintStatus(Long id, String status) {


Complaint complaint = complaintRepository.findById(id)
        .orElseThrow(() ->
                new RuntimeException("Complaint not found"));

complaint.setStatus(status);

return complaintRepository.save(complaint);


}


    @Autowired
    private ComplaintRepository complaintRepository;
    public java.util.List<Complaint> getAllComplaints() {
return complaintRepository.findAll();
}
public Complaint getComplaintById(Long id) {
return complaintRepository.findById(id)
.orElseThrow(() ->
new RuntimeException("Complaint not found"));
}



    public Complaint createComplaint(ComplaintRequestDTO dto) {

        Complaint complaint = new Complaint();

        complaint.setTitle(dto.getTitle());
        complaint.setDescription(dto.getDescription());
        complaint.setPhotoUrl(dto.getPhotoUrl());
        complaint.setLatitude(dto.getLatitude());
        complaint.setLongitude(dto.getLongitude());
        complaint.setPriority(dto.getPriority());

        complaint.setStatus("PENDING");

        return complaintRepository.save(complaint);
    }
}