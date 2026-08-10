package backend.service;

import backend.entity.Notification;
import backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(
            String message,
            String type) {

        Notification notification = new Notification();

        notification.setMessage(message);
        notification.setType(type);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    public List<Notification> getRecentNotifications() {

        return notificationRepository
                .findTop10ByOrderByCreatedAtDesc();
    }
}