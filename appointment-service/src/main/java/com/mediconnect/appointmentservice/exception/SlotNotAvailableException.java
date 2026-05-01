package com.mediconnect.appointmentservice.exception;

public class SlotNotAvailableException extends RuntimeException{
    public SlotNotAvailableException(String message) {
        super(message);
    }
}
