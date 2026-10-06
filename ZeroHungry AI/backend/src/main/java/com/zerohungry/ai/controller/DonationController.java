package com.zerohungry.ai.controller;

import com.zerohungry.ai.model.FoodDonation;
import com.zerohungry.ai.model.enums.DonationStatus;
import com.zerohungry.ai.repository.FoodDonationRepository;
import com.zerohungry.ai.service.FreshnessAnalysisService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    private final FoodDonationRepository repository;
    private final FreshnessAnalysisService freshnessAnalysisService;

    public DonationController(
            FoodDonationRepository repository,
            FreshnessAnalysisService freshnessAnalysisService) {

        this.repository = repository;
        this.freshnessAnalysisService = freshnessAnalysisService;
    }

    // ==============================
    // CREATE DONATION
    // ==============================

    @PostMapping
    public ResponseEntity<FoodDonation> createDonation(
            @RequestBody FoodDonation donation) {

        FoodDonation analyzedDonation =
                freshnessAnalysisService.analyzeFood(donation);

        FoodDonation savedDonation =
                repository.save(analyzedDonation);

        return ResponseEntity
                .status(201)
                .body(savedDonation);
    }

    // ==============================
    // GET ALL DONATIONS
    // ==============================

    @GetMapping
    public ResponseEntity<List<FoodDonation>> getAllDonations() {

        List<FoodDonation> donations =
                repository.findAll();

        return ResponseEntity.ok(donations);
    }

    // ==============================
    // GET DONATION BY ID
    // ==============================

    @GetMapping("/{id}")
    public ResponseEntity<FoodDonation> getDonationById(
            @PathVariable Long id) {

        Optional<FoodDonation> donation =
                repository.findById(id);

        if (donation.isPresent()) {
            return ResponseEntity.ok(donation.get());
        }

        return ResponseEntity.notFound().build();
    }

    // ==============================
    // UPDATE DONATION STATUS
    // ACCEPT / REJECT
    // ==============================

    @PutMapping("/{id}/status")
    public ResponseEntity<FoodDonation> updateDonationStatus(
            @PathVariable Long id,
            @RequestParam DonationStatus status) {

        FoodDonation donation =
                repository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Donation not found"
                                )
                        );

        donation.setStatus(status);

        FoodDonation updatedDonation =
                repository.save(donation);

        return ResponseEntity.ok(updatedDonation);
    }

    // ==============================
    // EXPIRE DONATION
    // ==============================

    @PutMapping("/{id}/expire")
    public ResponseEntity<FoodDonation> expireDonation(
            @PathVariable Long id) {

        FoodDonation donation =
                repository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Donation not found"
                                )
                        );

        // Expire only if NGO has not processed it
        if (donation.getStatus() == DonationStatus.WAITING_FOR_NGO
                || donation.getStatus() == DonationStatus.ANALYZING
                || donation.getStatus() == DonationStatus.VERIFIED) {

            donation.setStatus(
                    DonationStatus.EXPIRED
            );

            FoodDonation updatedDonation =
                    repository.save(donation);

            return ResponseEntity.ok(updatedDonation);
        }

        // If already ACCEPTED or REJECTED,
        // don't change the status
        return ResponseEntity.ok(donation);
    }
}