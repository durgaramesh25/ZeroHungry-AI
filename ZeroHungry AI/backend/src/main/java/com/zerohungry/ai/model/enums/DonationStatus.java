package com.zerohungry.ai.model.enums;

/**
 * DonationStatus
 *
 * Tracks every stage of a food donation's lifecycle from creation
 * to final delivery (or expiry/rejection).
 *
 * The lifecycle flows like this:
 *
 *   ANALYZING
 *       ↓  (AI freshness check finishes)
 *   VERIFIED
 *       ↓  (donor clicks "Donate This Food")
 *   WAITING_FOR_NGO
 *       ↓  (an NGO accepts)              OR  →  REJECTED  (no NGO responds
 *   ACCEPTED                                      within the time window)
 *       ↓
 *   PICKUP_PENDING
 *       ↓  (NGO collects the food)
 *   COMPLETED
 *
 *   EXPIRED  — set automatically if the food's expiry time passes
 *              before the donation reaches COMPLETED.
 *
 * These match the status values used on the frontend my-donations.html page.
 * Stored in the database as a VARCHAR string (EnumType.STRING).
 */
public enum DonationStatus {

    ANALYZING,       // AI freshness check is in progress
    VERIFIED,        // AI check finished — result is ready, not yet submitted
    WAITING_FOR_NGO, // Donation submitted — waiting for an NGO to respond
    ACCEPTED,        // An NGO has accepted the donation
    REJECTED,        // No NGO accepted within the response window
    PICKUP_PENDING,  // NGO accepted and is on the way to pick up the food
    COMPLETED,       // Food successfully collected and distributed
    EXPIRED          // Food expired before it could be donated
}
