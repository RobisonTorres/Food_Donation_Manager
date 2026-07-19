package com.unifecaf.Food_Donation_Manager.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "families")
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String address;
    private String neighborhood;
    private String phone;
    private Integer men;
    private Integer women;
    private Integer children;

    @Enumerated(EnumType.STRING)
    private Family.FamilyStatus status;

    @OneToMany(mappedBy = "family",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private List<Child> childList = new ArrayList<>();

    @OneToMany(mappedBy = "family")
    @JsonIgnore
    private List<Donation> donationList = new ArrayList<>();

    public Family(){}

    public Family(Integer id, String name, String address, String neighborhood, String phone, Integer men, Integer women, Integer children, FamilyStatus status, List<Child> childList, List<Donation> donationList) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.neighborhood = neighborhood;
        this.phone = phone;
        this.men = men;
        this.women = women;
        this.children = children;
        this.status = status;
        this.childList = childList;
        this.donationList = donationList;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getMen() {
        return men;
    }

    public void setMen(Integer men) {
        this.men = men;
    }

    public Integer getWomen() {
        return women;
    }

    public void setWomen(Integer women) {
        this.women = women;
    }

    public Integer getChildren() {
        return children;
    }

    public void setChildren(Integer children) {
        this.children = children;
    }

    public FamilyStatus getStatus() {
        return status;
    }

    public void setStatus(FamilyStatus status) {
        this.status = status;
    }

    public List<Child> getChildList() {
        return childList;
    }

    public void setChildList(List<Child> childList) {
        this.childList = childList;
    }

    public List<Donation> getDonationList() {
        return donationList;
    }

    public void setDonationList(List<Donation> donationList) {
        this.donationList = donationList;
    }

    public enum FamilyStatus {
        YES, NO
    }
}