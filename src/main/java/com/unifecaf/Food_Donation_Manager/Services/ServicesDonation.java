package com.unifecaf.Food_Donation_Manager.Services;

import com.unifecaf.Food_Donation_Manager.Models.Donation;
import com.unifecaf.Food_Donation_Manager.Models.Family;
import com.unifecaf.Food_Donation_Manager.Repositories.RepositoryDonation;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ServicesDonation {

    private final RepositoryDonation repositoryDonation;

    public ServicesDonation(RepositoryDonation repositoryDonation) {
        this.repositoryDonation = repositoryDonation;
    }

    public Donation getDonationByFamilyAndMonth(Family family, LocalDate month) {
        return repositoryDonation.findByFamilyAndMonth(family, month);
    }

    public Donation saveDonation(Donation donation) {
        return repositoryDonation.save(donation);
    }

}