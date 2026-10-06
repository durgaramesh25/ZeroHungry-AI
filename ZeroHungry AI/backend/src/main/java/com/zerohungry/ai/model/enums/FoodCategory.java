package com.zerohungry.ai.model.enums;

/**
 * FoodCategory
 *
 * An enum (short for enumeration) is a special Java type that holds
 * a fixed set of named constants.  Using an enum instead of a plain
 * String means:
 *   • The compiler stops you from saving a typo like "Cookd Meal".
 *   • The database stores a short, consistent label.
 *   • Your code is self-documenting — the allowed values are visible here.
 *
 * In the database, Hibernate stores the NAME of the constant
 * (e.g. "COOKED_MEAL") as a VARCHAR column because we use
 * @Enumerated(EnumType.STRING) on the field in FoodDonation.java.
 *
 * Matches the food category options shown in the frontend form.
 */
public enum FoodCategory {

    COOKED_MEAL,      // Freshly prepared cooked dishes (biryani, curry, rice…)
    BAKED_GOODS,      // Bread, pastries, cakes, biscuits
    RAW_VEGETABLES,   // Fresh, uncooked vegetables
    FRUITS,           // Fresh fruit
    DAIRY,            // Milk, curd, cheese, paneer
    PACKAGED_FOOD,    // Factory-sealed, shelf-stable items
    BEVERAGES,        // Juices, drinks, water
    OTHER             // Anything that doesn't fit above categories
}
