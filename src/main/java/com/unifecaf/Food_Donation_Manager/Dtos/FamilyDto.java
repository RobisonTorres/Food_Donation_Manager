package com.unifecaf.Food_Donation_Manager.Dtos;

public class FamilyDto {

    private String name;
    private String address;
    private String neighborhood;
    private String phone;
    private Integer men;
    private Integer women;
    private Integer children;
    private String status;

    public FamilyDto(String name, String address, String neighborhood, String phone, Integer men, Integer women, Integer children, String status) {
        this.name = name;
        this.address = address;
        this.neighborhood = neighborhood;
        this.phone = phone;
        this.men = men;
        this.women = women;
        this.children = children;
        this.status = status;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
