package com.unifecaf.Food_Donation_Manager;

import com.unifecaf.Food_Donation_Manager.Configs.AppWindow;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodDonationManagerApplication {

	public static void main(String[] args) {

		SpringApplication.run(FoodDonationManagerApplication.class, args);
		AppWindow.main(args);
	}
}