package com.unifecaf.Food_Donation_Manager.Repositories;

import com.unifecaf.Food_Donation_Manager.Dtos.FamilyDonationDto;
import com.unifecaf.Food_Donation_Manager.Models.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RepositoryFamily extends JpaRepository<Family, Integer> {

    // This query take all families with status OK in the current month.
    @Query("""
    SELECT new com.unifecaf.Food_Donation_Manager.Dtos.FamilyDonationDto(
        f.id,
        f.name,
        f.status,
        d.id,
        d.status,
        d.delivery
    )
    FROM Family f
    LEFT JOIN f.donationList d
        ON d.month = :month
    WHERE f.status = com.unifecaf.Food_Donation_Manager.Models.Family.FamilyStatus.YES
    ORDER BY f.name
    """)
    List<FamilyDonationDto> findAllFamiliesActiveByMonth(@Param("month") LocalDate month);

    // This query takes all donations related to the given family.
    @Query("""
    SELECT DISTINCT f
    FROM Family f
    LEFT JOIN FETCH f.donationList d
    WHERE f.id = :familyId
    """)
    Optional<Family> findAllDonationsByFamily(@Param("familyId") Integer familyId);

    // This query takes all families with children.
    @Query("""
    SELECT DISTINCT f
    FROM Family f
    JOIN FETCH f.childList
    WHERE f.status = com.unifecaf.Food_Donation_Manager.Models.Family.FamilyStatus.YES
    ORDER BY f.name
    """)
    List<Family> findActiveFamiliesWithChildren();
}