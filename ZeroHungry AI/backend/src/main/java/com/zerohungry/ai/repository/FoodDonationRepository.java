package com.zerohungry.ai.repository;

import com.zerohungry.ai.model.FoodDonation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {
}