package com.mediconnect.appointmentservice.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AvailabilityRequest {
    // Map of day -> schedule info
    // Example: { "MON": { enabled: true, startTime: "09:00", endTime: "17:00", duration: 30 } }
    private Map<String, DaySchedule> schedule;

    @Data
    public static class DaySchedule {
        private Boolean enabled;
        private String startTime;
        private String endTime;
        private Integer duration;
    }
}