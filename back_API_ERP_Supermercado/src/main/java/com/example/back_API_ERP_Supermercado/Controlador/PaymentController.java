package com.example.back_API_ERP_Supermercado.Controlador;

import com.example.back_API_ERP_Supermercado.Servicios.DTO.PaymentIntentDTO;
import com.example.back_API_ERP_Supermercado.Servicios.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripe")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/paymentintent")
    public ResponseEntity<?> payment(@RequestBody PaymentIntentDTO dto) {
        try {
            PaymentIntent paymentIntent = paymentService.paymentIntent(dto);
            return ResponseEntity.ok(paymentIntent.toJson());
        } catch (Exception e) {
            e.printStackTrace(); // 👈 esto imprimirá el error real en consola
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear PaymentIntent: " + e.getMessage());
        }
    }


    @PostMapping("/confirm/{id}")
    public ResponseEntity<String> confirm(@PathVariable String id) throws StripeException {
        PaymentIntent paymentIntent = paymentService.confirm(id);
        return ResponseEntity.ok(paymentIntent.toJson());
    }
}
