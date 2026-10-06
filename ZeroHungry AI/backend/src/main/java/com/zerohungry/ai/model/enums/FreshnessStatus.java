package com.zerohungry.ai.model.enums;

/**
 * FreshnessStatus
 *
 * The human-readable result of the AI freshness analysis.
 * Derived from the freshnessScore (0–100):
 *
 *   Score 70–100  →  FRESH             (safe to donate, distribute immediately)
 *   Score 40–69   →  MODERATE          (usable but distribute quickly)
 *   Score 1–39    →  EXPIRING_SOON     (very close to expiry, caution needed)
 *   Score 0 or    →  NOT_RECOMMENDED   (unsafe, do not donate)
 *     already expired
 *
 * This mapping will be implemented in the service layer (Step 7).
 * Stored in the database as a VARCHAR string (EnumType.STRING).
 */
public enum FreshnessStatus {

    FRESH,             // Freshness score 70–100. Safe to donate.
    MODERATE,          // Freshness score 40–69. Distribute within hours.
    EXPIRING_SOON,     // Freshness score 1–39.  Urgent — distribute immediately.
    NOT_RECOMMENDED    // Score 0 or food already expired. Do not donate.
}
