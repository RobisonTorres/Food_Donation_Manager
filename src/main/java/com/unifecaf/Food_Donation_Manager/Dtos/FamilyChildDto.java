package com.unifecaf.Food_Donation_Manager.Dtos;

import com.unifecaf.Food_Donation_Manager.Models.Child;

import java.util.List;

public class FamilyChildDto {

    private Integer familyId;
    private String familyName;
    private String phone;
    private String familyAddress;
    private List<Child> childList;

    public FamilyChildDto(Integer familyId, String familyName, String familyAddress, List<Child> childList, String phone) {
        this.familyId = familyId;
        this.familyName = familyName;
        this.familyAddress = familyAddress;
        this.childList = childList;
        this.phone = phone;
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

    public String getFamilyAddress() {
        return familyAddress;
    }

    public void setFamilyAddress(String familyAddress) {
        this.familyAddress = familyAddress;
    }

    public List<Child> getChildList() {
        return childList;
    }

    public void setChildList(List<Child> childList) {
        this.childList = childList;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}