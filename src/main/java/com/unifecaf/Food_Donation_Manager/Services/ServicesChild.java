package com.unifecaf.Food_Donation_Manager.Services;

import com.unifecaf.Food_Donation_Manager.Models.Child;
import com.unifecaf.Food_Donation_Manager.Repositories.RepositoryChild;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ServicesChild {

    private final RepositoryChild repositoryChild;

    public ServicesChild(RepositoryChild repositoryChild) {
        this.repositoryChild = repositoryChild;
    }

    public Child saveChild(Child child) {
        return repositoryChild.save(child);
    }

    public List<Child> getAllChildrenByFamily(Integer id) {
        return repositoryChild.findByFamilyId(id);
    }

    public void deleteChildrenByFamily(Integer familyId) {
        repositoryChild.deleteByFamilyId(familyId);
    }
}
