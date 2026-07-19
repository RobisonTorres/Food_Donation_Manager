package com.unifecaf.Food_Donation_Manager.Dtos;

import java.util.List;

public class FamilyChildWrapperDto {

    private FamilyDto familyDto;
    private List<ChildDto> childrenDto;

    public FamilyDto getFamilyDto() {
        return familyDto;
    }

    public void setFamilyDto(FamilyDto familyDto) {
        this.familyDto = familyDto;
    }

    public List<ChildDto> getChildrenDto() {
        return childrenDto;
    }

    public void setChildrenDto(List<ChildDto> childrenDto) {
        this.childrenDto = childrenDto;
    }
}