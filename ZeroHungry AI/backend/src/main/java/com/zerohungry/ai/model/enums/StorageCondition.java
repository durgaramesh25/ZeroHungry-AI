package com.zerohungry.ai.model.enums;

/**
 * StorageCondition
 *
 * Describes how the food is being stored between preparation and pickup.
 * Storage condition is a key input to the AI freshness calculation:
 *   - Refrigerated food lasts significantly longer than room-temperature food.
 *   - This allows the AI to adjust the freshness score accordingly.
 *
 * Stored in the database as a VARCHAR string (EnumType.STRING).
 */
public enum StorageCondition {

    ROOM_TEMPERATURE,  // Left at ambient indoor temperature (~25–35 °C in India)
    REFRIGERATED,      // Stored in a refrigerator (0–5 °C)
    OTHER              // Frozen, insulated box, or any other storage method
}
