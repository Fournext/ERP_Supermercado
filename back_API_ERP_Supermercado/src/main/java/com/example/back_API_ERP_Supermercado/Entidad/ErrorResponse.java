package com.example.back_API_ERP_Supermercado.Entidad;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private String message;
    private int status;
    private String timestamp;
    private String path;

    public ErrorResponse(String message, HttpStatus status, String path) {
        this.message = message;
        this.status = status.value();
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        this.path = path;
    }
}
