package com.zerohungry.ai.model;
//        ^^^^^^^^^^^^^^^^^
//        Package declaration matches the folder path:
//        src/main/java/com/zerohungry/ai/model/

/**
 * Donation  —  Plain Java Model Class (POJO)
 *
 * A model class represents a real-world thing in our system.
 * Right now this is just a simple Java class with fields.
 *
 * In Step 5 (MySQL / JPA) we will add:
 *   @Entity          — marks this as a database table
 *   @Id              — marks the primary key field
 *   @GeneratedValue  — auto-increment the ID
 *   @Column          — customise column names/constraints
 *
 * Current fields match the frontend form:
 *   id               — unique identifier for each donation
 *   donorName        — person or restaurant donating
 *   foodName         — what food is being donated
 *   foodCategory     — e.g. Cooked Meal, Fruits, Packaged Food
 *   quantity         — e.g. "5 kg" or "30 packets"
 *   servings         — estimated number of people it can feed
 *   prepType         — Cooked / Baked / Raw / Packaged / Other
 *   storageCondition — Room Temperature / Refrigerated / Other
 *   location         — pickup address
 *   contactNumber    — donor's phone number
 *   prepDateTime     — when the food was prepared
 *   expiryDateTime   — when the food expires
 *   freshnessScore   — AI score out of 100 (added in AI step)
 *   status           — current lifecycle status
 */
public class Donation {

    // ── Fields ────────────────────────────────────────────────────

    private Long   id;
    private String donorName;
    private String foodName;
    private String foodCategory;
    private String quantity;
    private int    servings;
    private String prepType;
    private String storageCondition;
    private String location;
    private String contactNumber;
    private String prepDateTime;
    private String expiryDateTime;
    private int    freshnessScore;

    /*
     * Status tracks where the donation is in its lifecycle.
     * Possible values:
     *   AVAILABLE      — submitted, waiting for an NGO
     *   CLAIMED        — an NGO has accepted it
     *   PICKUP_PENDING — NGO is on the way
     *   COMPLETED      — food delivered successfully
     *   REJECTED       — no NGO accepted in time
     *   EXPIRED        — passed expiry without being claimed
     */
    private String status;


    // ── Constructors ──────────────────────────────────────────────

    // No-argument constructor — required by Spring and JPA
    public Donation() {}

    // All-argument constructor — useful for creating objects in code
    public Donation(Long id, String donorName, String foodName,
                    String foodCategory, String quantity, int servings,
                    String prepType, String storageCondition,
                    String location, String contactNumber,
                    String prepDateTime, String expiryDateTime,
                    int freshnessScore, String status) {
        this.id               = id;
        this.donorName        = donorName;
        this.foodName         = foodName;
        this.foodCategory     = foodCategory;
        this.quantity         = quantity;
        this.servings         = servings;
        this.prepType         = prepType;
        this.storageCondition = storageCondition;
        this.location         = location;
        this.contactNumber    = contactNumber;
        this.prepDateTime     = prepDateTime;
        this.expiryDateTime   = expiryDateTime;
        this.freshnessScore   = freshnessScore;
        this.status           = status;
    }


    // ── Getters & Setters ─────────────────────────────────────────
    // Spring uses getters to convert this object to JSON.
    // Spring uses setters to create this object from incoming JSON.

    public Long   getId()               { return id; }
    public void   setId(Long id)        { this.id = id; }

    public String getDonorName()                    { return donorName; }
    public void   setDonorName(String donorName)    { this.donorName = donorName; }

    public String getFoodName()                     { return foodName; }
    public void   setFoodName(String foodName)      { this.foodName = foodName; }

    public String getFoodCategory()                         { return foodCategory; }
    public void   setFoodCategory(String foodCategory)      { this.foodCategory = foodCategory; }

    public String getQuantity()                     { return quantity; }
    public void   setQuantity(String quantity)      { this.quantity = quantity; }

    public int    getServings()                     { return servings; }
    public void   setServings(int servings)         { this.servings = servings; }

    public String getPrepType()                     { return prepType; }
    public void   setPrepType(String prepType)      { this.prepType = prepType; }

    public String getStorageCondition()                             { return storageCondition; }
    public void   setStorageCondition(String storageCondition)      { this.storageCondition = storageCondition; }

    public String getLocation()                     { return location; }
    public void   setLocation(String location)      { this.location = location; }

    public String getContactNumber()                        { return contactNumber; }
    public void   setContactNumber(String contactNumber)    { this.contactNumber = contactNumber; }

    public String getPrepDateTime()                         { return prepDateTime; }
    public void   setPrepDateTime(String prepDateTime)      { this.prepDateTime = prepDateTime; }

    public String getExpiryDateTime()                           { return expiryDateTime; }
    public void   setExpiryDateTime(String expiryDateTime)      { this.expiryDateTime = expiryDateTime; }

    public int    getFreshnessScore()                       { return freshnessScore; }
    public void   setFreshnessScore(int freshnessScore)     { this.freshnessScore = freshnessScore; }

    public String getStatus()                   { return status; }
    public void   setStatus(String status)      { this.status = status; }
}
