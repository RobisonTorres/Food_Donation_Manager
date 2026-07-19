package com.unifecaf.Food_Donation_Manager.Repositories;

import com.unifecaf.Food_Donation_Manager.Models.Child;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface RepositoryChild extends JpaRepository<Child, Integer> {

    List<Child> findByFamilyId(Integer familyId);

    @Modifying
    @Transactional
    void deleteByFamilyId(Integer familyId);

}