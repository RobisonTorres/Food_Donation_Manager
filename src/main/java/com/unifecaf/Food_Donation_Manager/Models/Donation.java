package com.unifecaf.Food_Donation_Manager.Models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    @Column(name = "donation_month")
    private LocalDate month;

    @Column(name = "delivery")
    private LocalDate delivery;

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    public Donation(){}

    public Donation(Integer id, DonationStatus status, LocalDate month, LocalDate delivery, Family family) {
        this.id = id;
        this.status = status;
        this.month = month;
        this.delivery = delivery;
        this.family = family;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public LocalDate getMonth() {
        return month;
    }

    public void setMonth(LocalDate month) {
        this.month = month;
    }

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public LocalDate getDelivery() {
        return delivery;
    }

    public void setDelivery(LocalDate delivery) {
        this.delivery = delivery;
    }

    public enum DonationStatus {
        OK, PENDENT
    }
}