package com.zerohungry.ai.model.enums;

/**
 * PreparationType
 *
 * Describes HOW the food was prepared.
 * This affects freshness calculations:
 *   - Cooked food spoils faster than packaged food.
 *   - Raw food has different safety rules than cooked food.
 *
 * Stored in the database as a VARCHAR string (EnumType.STRING).
 */
public enum PreparationType {

    COOKED,     // Heat-cooked food (rice, curry, biryani, dal…)
    BAKED,      // Oven-baked items (bread, cake, biscuits…)
    RAW,        // Unprocessed food that was not cooked (fruits, vegetables)
    PACKAGED,   // Factory-sealed item with a printed expiry date
    OTHER       // Any preparation method not covered above
}
