package com.unifecaf.Food_Donation_Manager.Controllers;

import com.unifecaf.Food_Donation_Manager.Dtos.FamilyDonationDto;
import com.unifecaf.Food_Donation_Manager.Models.Donation;
import com.unifecaf.Food_Donation_Manager.Models.Family;
import com.unifecaf.Food_Donation_Manager.Services.ServicesDonation;
import com.unifecaf.Food_Donation_Manager.Services.ServicesFamily;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@CrossOrigin(origins = "*")
public class ControllersDonation {

    private final ServicesDonation servicesDonation;
    private final ServicesFamily servicesFamily;


    public ControllersDonation(ServicesDonation servicesDonation, ServicesFamily servicesFamily) {
        this.servicesDonation = servicesDonation;
        this.servicesFamily = servicesFamily;
    }

    @PutMapping("/update_donation")
    public ResponseEntity<Void> updateDonationStatusByFamily(
            @RequestParam LocalDate month,
            @RequestBody FamilyDonationDto familyDonationDto) {

        Family family = servicesFamily.getFamilyById(familyDonationDto.getFamilyId());
        Donation donation = servicesDonation.getDonationByFamilyAndMonth(family, month);

        if (donation == null) {
            donation = new Donation();
            donation.setFamily(family);
            donation.setMonth(month);
        }

        donation.setStatus(familyDonationDto.getStatus());
        donation.setDelivery(familyDonationDto.getDelivery());
        servicesDonation.saveDonation(donation);
        return ResponseEntity.ok().build();
    }
}