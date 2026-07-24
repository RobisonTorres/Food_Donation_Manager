package com.unifecaf.Food_Donation_Manager.Services;

import com.unifecaf.Food_Donation_Manager.Dtos.FamilyChildDto;
import com.unifecaf.Food_Donation_Manager.Dtos.FamilyDonationDto;
import com.unifecaf.Food_Donation_Manager.Dtos.FamilyDonationListDto;
import com.unifecaf.Food_Donation_Manager.Models.Family;
import com.unifecaf.Food_Donation_Manager.Repositories.RepositoryFamily;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ServicesFamily {

    private final RepositoryFamily repositoryFamily;

    public ServicesFamily(RepositoryFamily repositoryFamily) {
        this.repositoryFamily = repositoryFamily;
    }

    public Family getFamilyById(Integer id) {
        return repositoryFamily.findById(id).orElse(null);
    }

    public List<Family> getAllFamilies() {
        return repositoryFamily.findAll();
    }

    public Family saveFamily(Family family) {
        return repositoryFamily.save(family);
    }

    public List<FamilyDonationDto> getAllFamiliesActiveStatusAndMonth(LocalDate month) {
        return repositoryFamily.findAllFamiliesActiveByMonth(month);
    }

    /**
     * Retrieves full donation history and detail information for a specific family.
     *
     * @param familyId The unique identifier of the target family.
     * @return A {@link FamilyDonationListDto} containing family details and donation history.
     * @throws RuntimeException If no family is found with the provided ID.
     */
    public FamilyDonationListDto getAllDonationsByFamily(Integer familyId) {

        Family family = repositoryFamily.findAllDonationsByFamily(familyId)
                .orElseThrow(() -> new RuntimeException("Family not found"));

        return new FamilyDonationListDto(
                family.getName(),
                family.getAddress(),
                family.getNeighborhood(),
                family.getPhone(),
                family.getMen(),
                family.getWomen(),
                family.getChildren(),
                family.getDonationList()
        );
    }

    /**
     * Retrieves all active families along with their registered children and maps them to DTOs.
     *
     * @return A list of {@link FamilyChildDto} objects containing family and child details.
     */
    public List<FamilyChildDto> getFamiliesWithChildren() {

        return repositoryFamily.findActiveFamiliesWithChildren()
                .stream()
                .map(f -> new FamilyChildDto(
                        f.getId(),
                        f.getName(),
                        f.getAddress(),
                        f.getChildList(),
                        f.getPhone()
                ))
                .toList();
    }

    public void deleteFamilyById(Integer id) {
        repositoryFamily.deleteById(id);
    }
}