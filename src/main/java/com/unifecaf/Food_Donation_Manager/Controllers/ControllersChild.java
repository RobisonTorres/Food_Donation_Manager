package com.unifecaf.Food_Donation_Manager.Controllers;

import com.unifecaf.Food_Donation_Manager.Dtos.ChildDto;
import com.unifecaf.Food_Donation_Manager.Dtos.FamilyChildWrapperDto;
import com.unifecaf.Food_Donation_Manager.Models.Child;
import com.unifecaf.Food_Donation_Manager.Models.Family;
import com.unifecaf.Food_Donation_Manager.Services.ServicesChild;
import com.unifecaf.Food_Donation_Manager.Services.ServicesFamily;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.modelmapper.ModelMapper;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ControllersChild {

    private final ServicesChild servicesChild;
    private final ServicesFamily servicesFamily;
    private final ModelMapper modelMapper;

    public ControllersChild(ServicesChild servicesChild, ServicesFamily servicesFamily, ModelMapper modelMapper) {
        this.servicesChild = servicesChild;
        this.servicesFamily = servicesFamily;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/get_children_by_family/{id}")
    public List<Child> getChildrenByFamily(@PathVariable Integer id) {
        return servicesChild.getAllChildrenByFamily(id);
    }

    @PutMapping("update_children_by_family_id/{id}")
    public ResponseEntity<Family> updateChildren(@RequestBody FamilyChildWrapperDto wrapperDto,
                                                 @PathVariable Integer id) {

        Family family = servicesFamily.getFamilyById(id);
        servicesChild.deleteChildrenByFamily(id);
        List<ChildDto> children = wrapperDto.getChildrenDto();

        family.setChildren(children == null ? 0 : children.size());
        servicesFamily.saveFamily(family);

        Family family2 = servicesFamily.getFamilyById(id);

        if (wrapperDto.getChildrenDto() != null) {
            for (ChildDto childDto : wrapperDto.getChildrenDto()) {
                Child child = modelMapper.map(childDto, Child.class);
                child.setFamily(family);
                servicesChild.saveChild(child);
            }
        }

        return ResponseEntity.ok().build();
    }
}