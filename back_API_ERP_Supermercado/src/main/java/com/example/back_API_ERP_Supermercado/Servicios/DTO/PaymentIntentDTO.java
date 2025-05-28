package com.example.back_API_ERP_Supermercado.Servicios.DTO;

import lombok.Data;


public class PaymentIntentDTO {
    private int amount;
    private String currency;

    public PaymentIntentDTO(int amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    public PaymentIntentDTO() {
    }

    public int getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
