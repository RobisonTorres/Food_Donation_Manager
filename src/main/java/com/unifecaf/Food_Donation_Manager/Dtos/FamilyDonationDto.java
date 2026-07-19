package com.unifecaf.Food_Donation_Manager.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.unifecaf.Food_Donation_Manager.Models.Donation;
import com.unifecaf.Food_Donation_Manager.Models.Family;

import java.time.LocalDate;

public class FamilyDonationDto {

    private Integer familyId;
    private String familyName;
    private Family.FamilyStatus familyStatus;
    private Integer donationId;
    private Donation.DonationStatus status;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate delivery;

    public FamilyDonationDto() {
    }

    public FamilyDonationDto(Integer familyId, String familyName, Family.FamilyStatus familyStatus, Integer donationId, Donation.DonationStatus status, LocalDate delivery) {
        this.familyId = familyId;
        this.familyName = familyName;
        this.familyStatus = familyStatus;
        this.donationId = donationId;
        this.status = status;
        this.delivery = delivery;
    }

    public Integer getFamilyId() {
        return familyId;
    }

    public void setFamilyId(Integer familyId) {
        this.familyId = familyId;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public Family.FamilyStatus getFamilyStatus() {
        return familyStatus;
    }

    public void setFamilyStatus(Family.FamilyStatus familyStatus) {
        this.familyStatus = familyStatus;
    }

    public Integer getDonationId() {
        return donationId;
    }

    public void setDonationId(Integer donationId) {
        this.donationId = donationId;
    }

    public Donation.DonationStatus getStatus() {
        return status;
    }

    public void setStatus(Donation.DonationStatus status) {
        this.status = status;
    }

    public LocalDate getDelivery() {
        return delivery;
    }

    public void setDelivery(LocalDate delivery) {
        this.delivery = delivery;
    }
}