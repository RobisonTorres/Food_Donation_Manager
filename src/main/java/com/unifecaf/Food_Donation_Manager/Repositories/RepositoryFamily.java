package com.unifecaf.Food_Donation_Manager.Repositories;

import com.unifecaf.Food_Donation_Manager.Dtos.FamilyDonationDto;
import com.unifecaf.Food_Donation_Manager.Models.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing {@link Family} entity database operations.
 */
@Repository
public interface RepositoryFamily extends JpaRepository<Family, Integer> {

    /**
     * Retrieves all active families along with their donation status for a given month.
     *
     * @param month The target date corresponding to the donation month.
     * @return A list of {@link FamilyDonationDto} objects sorted alphabetically by family name.
     */
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

    /**
     * Retrieves a family by ID along with its full donation history.
     *
     * @param familyId The unique identifier of the family.
     * @return An {@link Optional} containing the family entity with fetched donations if found.
     */
    @Query("""
        SELECT DISTINCT f
        FROM Family f
        LEFT JOIN FETCH f.donationList d
        WHERE f.id = :familyId
    """)
    Optional<Family> findAllDonationsByFamily(@Param("familyId") Integer familyId);

    /**
     * Retrieves all active families eagerly fetching their associated children.
     *
     * @return A list of active families with their children, sorted alphabetically by name.
     */
    @Query("""
        SELECT DISTINCT f
        FROM Family f
        INNER JOIN FETCH f.childList c
        WHERE f.status = com.unifecaf.Food_Donation_Manager.Models.Family.FamilyStatus.YES
        ORDER BY f.name
    """)
    List<Family> findActiveFamiliesWithChildren();
}