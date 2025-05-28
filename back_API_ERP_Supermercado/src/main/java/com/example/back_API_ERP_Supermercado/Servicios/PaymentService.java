package com.example.back_API_ERP_Supermercado.Servicios;

import com.example.back_API_ERP_Supermercado.Servicios.DTO.PaymentIntentDTO;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    @Value("${stripe.key.private}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentIntent paymentIntent(PaymentIntentDTO dto) throws StripeException {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", dto.getAmount());
        params.put("currency", dto.getCurrency());
        params.put("automatic_payment_methods", Map.of("enabled", true));
        return PaymentIntent.create(params);
    }

    public PaymentIntent confirm(String id) throws StripeException {
        PaymentIntent intent = PaymentIntent.retrieve(id);
        return intent.confirm();
    }
}
