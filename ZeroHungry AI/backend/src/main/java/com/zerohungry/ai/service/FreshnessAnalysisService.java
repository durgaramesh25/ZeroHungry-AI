package com.zerohungry.ai.service;

import com.zerohungry.ai.model.FoodDonation;
import com.zerohungry.ai.model.enums.FreshnessStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class FreshnessAnalysisService {

    public FoodDonation analyzeFood(FoodDonation donation) {

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime preparationTime =
                donation.getPreparationDateTime();

        LocalDateTime expectedExpiry =
                donation.getExpectedExpiry();

        int score = calculateFreshnessScore(
                preparationTime,
                expectedExpiry,
                now
        );

        FreshnessStatus status =
                determineFreshnessStatus(score);

        donation.setFreshnessScore(score);
        donation.setFreshnessStatus(status);
        donation.setEstimatedExpiry(expectedExpiry);

        donation.setAiMessage(
                generateMessage(status, score)
        );

        return donation;
    }

    private int calculateFreshnessScore(
            LocalDateTime preparationTime,
            LocalDateTime expectedExpiry,
            LocalDateTime now) {

        if (preparationTime == null || expectedExpiry == null) {
            return 0;
        }

        if (now.isAfter(expectedExpiry)) {
            return 0;
        }

        if (now.isBefore(preparationTime)) {
            return 100;
        }

        long totalMinutes =
                Duration.between(
                        preparationTime,
                        expectedExpiry
                ).toMinutes();

        long remainingMinutes =
                Duration.between(
                        now,
                        expectedExpiry
                ).toMinutes();

        if (totalMinutes <= 0) {
            return 0;
        }

        double percentage =
                ((double) remainingMinutes / totalMinutes) * 100;

        int score = (int) Math.round(percentage);

        return Math.max(0, Math.min(100, score));
    }

    private FreshnessStatus determineFreshnessStatus(int score) {

        if (score >= 70) {
            return FreshnessStatus.FRESH;
        }

        if (score >= 40) {
            return FreshnessStatus.MODERATE;
        }

        if (score > 0) {
            return FreshnessStatus.EXPIRING_SOON;
        }

        return FreshnessStatus.NOT_RECOMMENDED;
    }

    private String generateMessage(
            FreshnessStatus status,
            int score) {

        switch (status) {

            case FRESH:
                return "Food appears fresh and suitable for donation. "
                        + "Freshness score: " + score + "/100.";

            case MODERATE:
                return "Food has moderate freshness. "
                        + "Consider donating soon. "
                        + "Freshness score: " + score + "/100.";

            case EXPIRING_SOON:
                return "Food is approaching its expected expiry time. "
                        + "Immediate donation is recommended. "
                        + "Freshness score: " + score + "/100.";

            case NOT_RECOMMENDED:
                return "Food is expired or not recommended for donation. "
                        + "Freshness score: " + score + "/100.";

            default:
                return "Freshness analysis completed.";
        }
    }
}