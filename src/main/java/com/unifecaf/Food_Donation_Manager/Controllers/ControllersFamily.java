package com.unifecaf.Food_Donation_Manager.Controllers;

import com.unifecaf.Food_Donation_Manager.Dtos.*;
import com.unifecaf.Food_Donation_Manager.Models.Child;
import com.unifecaf.Food_Donation_Manager.Models.Family;
import com.unifecaf.Food_Donation_Manager.Services.ServicesChild;
import org.modelmapper.ModelMapper;
import com.unifecaf.Food_Donation_Manager.Services.ServicesFamily;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ControllersFamily {

    private final ServicesFamily servicesFamily;
    private final ServicesChild servicesChild;
    private final ModelMapper modelMapper;


    public ControllersFamily(ServicesFamily servicesFamily, ServicesChild servicesChild, ModelMapper modelMapper) {
        this.servicesFamily = servicesFamily;
        this.servicesChild = servicesChild;
        this.modelMapper = modelMapper;
    }

    @GetMapping("get_families")
    public List<Family> getAllFamilies() {
        System.out.println("Calling Api - Families");
        return servicesFamily.getAllFamilies();
    }

    @GetMapping("get_family/{id}")
    public Family getById(@PathVariable Integer id) {
        Family family = servicesFamily.getFamilyById(id);

        if (family == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return family;
    }

    @GetMapping("/get_all_families_active_by_month")
    public List<FamilyDonationDto> getAllFamiliesStatusActiveMonth(
                                    @RequestParam LocalDate month) {
        System.out.println("Calling Api - Status");
        return servicesFamily.getAllFamiliesActiveStatusAndMonth(month);
    }

    @GetMapping("/get_all_donation_by_family/{id}")
    public FamilyDonationListDto getAllDonationByFamily(@PathVariable Integer id) {
        return servicesFamily.getAllDonationsByFamily(id);
    }

    @GetMapping("/get_children_family")
    public List<FamilyChildDto> getAllChildrenByFamily() {
        System.out.println("Calling Api - Children");
        return servicesFamily.getFamiliesWithChildren();
    }

    @PostMapping("create_family")
    public ResponseEntity<Family> createFamily(@RequestBody FamilyChildWrapperDto wrapperDto) {

        FamilyDto familyDto = wrapperDto.getFamilyDto();
        Family family = modelMapper.map(familyDto, Family.class);

        family = servicesFamily.saveFamily(family);

        if (wrapperDto.getChildrenDto() != null) {
            for (ChildDto childDto : wrapperDto.getChildrenDto()) {
                Child child = modelMapper.map(childDto, Child.class);
                child.setFamily(family);
                servicesChild.saveChild(child);
            }
        }

        return ResponseEntity.ok().build();
    }

    @PutMapping("update_family/{id}")
    public ResponseEntity<Family> updateFamily(@RequestBody FamilyChildWrapperDto wrapperDto,
                                               @PathVariable Integer id) {

        Family family = servicesFamily.getFamilyById(id);

        if (family == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        FamilyDto familyDto = wrapperDto.getFamilyDto();
        modelMapper.map(familyDto, family);

        servicesFamily.saveFamily(family);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("delete_family/{id}")
    public ResponseEntity<Void> deleteFamily(@PathVariable Integer id) {

        servicesFamily.deleteFamilyById(id);
        return ResponseEntity.ok().build();
    }
}