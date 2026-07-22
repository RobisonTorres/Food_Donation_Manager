package com.unifecaf.Food_Donation_Manager;

import com.unifecaf.Food_Donation_Manager.Configs.AppWindow;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FoodDonationManagerApplication {

	public static void main(String[] args) {

		SpringApplication.run(FoodDonationManagerApplication.class, args);
		AppWindow.main(args);
	}
	/*
	@Bean
	CommandLineRunner initialization () {
		return args -> {

			System.out.println("Fox Two!");
			System.out.println("Access the app here: http://localhost:8080/index.html");
		};
	}
	*/
}