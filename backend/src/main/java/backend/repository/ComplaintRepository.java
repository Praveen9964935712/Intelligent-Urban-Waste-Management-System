package backend.repository;

import backend.dto.ZoneStatsDTO;
import org.springframework.data.jpa.repository.Query;
import backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    @Query("""
    SELECT new backend.dto.ZoneStatsDTO(
    c.zone,
    COUNT(c)
    )
    FROM Complaint c
    GROUP BY c.zone
    """)
java.util.List<ZoneStatsDTO> getZoneStatistics(); 

    long countByStatus(String status);

    @Query("""
    SELECT new backend.dto.PriorityStatsDTO(
    c.priority,
    COUNT(c)
    )
    FROM Complaint c
    GROUP BY c.priority
    """)
java.util.List<backend.dto.PriorityStatsDTO> getPriorityStatistics();
    
java.util.List<Complaint> findTop5ByOrderByCreatedAtDesc();

}