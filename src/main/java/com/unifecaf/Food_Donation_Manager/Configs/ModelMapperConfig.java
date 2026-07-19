package com.unifecaf.Food_Donation_Manager.Configs;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// This configuration class defines a bean for ModelMapper, which is used for object mapping.
// ModelMapper simplifies the process of mapping between different object models, such as DTOs and entities.
@Configuration
public class ModelMapperConfig {

    // This method creates and returns a ModelMapper bean.
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

}