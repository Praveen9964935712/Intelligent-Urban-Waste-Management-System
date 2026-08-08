package backend.repository;

import backend.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByAvailableTrue();

    List<Staff> findByZoneAndAvailableTrue(String zone);
 
    long countByAvailableTrue();
}