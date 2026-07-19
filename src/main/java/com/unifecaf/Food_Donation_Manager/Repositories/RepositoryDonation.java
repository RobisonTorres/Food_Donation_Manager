package com.unifecaf.Food_Donation_Manager.Repositories;

import com.unifecaf.Food_Donation_Manager.Models.Donation;
import com.unifecaf.Food_Donation_Manager.Models.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;

public interface RepositoryDonation extends JpaRepository<Donation, Integer> {
    Donation findByFamilyAndMonth(Family family, LocalDate month);
}