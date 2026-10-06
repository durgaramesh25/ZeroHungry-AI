package com.zerohungry.ai.model;

// ─────────────────────────────────────────────────────────────────────────────
// JPA IMPORTS
// These come from the Jakarta Persistence API (formerly javax.persistence).
// Spring Boot 3.x uses the "jakarta" namespace instead of "javax".
// ─────────────────────────────────────────────────────────────────────────────
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Java built-in imports
import java.time.LocalDateTime;

// Our own enum types (created in Step 6)
import com.zerohungry.ai.model.enums.DonationStatus;
import com.zerohungry.ai.model.enums.FoodCategory;
import com.zerohungry.ai.model.enums.FreshnessStatus;
import com.zerohungry.ai.model.enums.PreparationType;
import com.zerohungry.ai.model.enums.StorageCondition;

/**
 * ═══════════════════════════════════════════════════════════════════
 *  FoodDonation  —  JPA Entity
 *
 *  This class represents a single food donation in ZeroHungry AI.
 *
 *  WHAT IS AN ENTITY?
 *  ──────────────────
 *  An entity is a Java class that is mapped to a database TABLE.
 *  Each field in this class becomes a COLUMN in the MySQL table.
 *  Each object (instance) of this class becomes a ROW in the table.
 *
 *  Java class   →  MySQL table    (food_donation)
 *  Java field   →  MySQL column   (donor_name, food_name, …)
 *  Java object  →  MySQL row      (one specific donation record)
 *
 *  HOW DOES THE TABLE GET CREATED?
 *  ────────────────────────────────
 *  We set  spring.jpa.hibernate.ddl-auto=update  in application.properties.
 *  When Spring Boot starts, Hibernate reads this class, sees @Entity,
 *  and automatically runs the equivalent of:
 *    CREATE TABLE IF NOT EXISTS food_donation ( ... )
 *  You never write SQL manually for basic table creation.
 *
 *  NOTE ON NAMING:
 *  ───────────────
 *  We use "FoodDonation" (not "Donation") to be specific — later we
 *  will also have an "Ngo" entity. Clear names prevent confusion.
 * ═══════════════════════════════════════════════════════════════════
 */

@Entity
/*
 * @Entity
 * ────────
 * Tells JPA: "This Java class is an entity — map it to a database table."
 * Without this annotation, JPA ignores the class completely.
 * This is the MOST IMPORTANT annotation on this class.
 */

@Table(name = "food_donation")
/*
 * @Table(name = "food_donation")
 * ──────────────────────────────
 * Specifies the exact name of the MySQL table.
 * Without @Table, Hibernate uses the class name by default
 * (it would create a table called "FoodDonation" or "food_donation"
 * depending on the naming strategy).
 * Being explicit with @Table avoids surprises.
 *
 * This creates:   CREATE TABLE food_donation ( ... )
 */

public class FoodDonation {

    // ═════════════════════════════════════════════════════════════════
    //  FIELD 1: id  —  PRIMARY KEY
    //  MySQL column: id  (BIGINT, AUTO_INCREMENT, PRIMARY KEY)
    // ═════════════════════════════════════════════════════════════════

    @Id
    /*
     * @Id
     * ────
     * Marks this field as the PRIMARY KEY of the table.
     * Every table must have exactly one @Id field.
     * The primary key uniquely identifies each row.
     * Think of it like a unique roll number for each donation.
     */

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /*
     * @GeneratedValue(strategy = GenerationType.IDENTITY)
     * ─────────────────────────────────────────────────────
     * Tells MySQL to automatically assign the next available number
     * when a new row is inserted.  You never set the id yourself.
     *
     * GenerationType.IDENTITY uses MySQL's AUTO_INCREMENT feature:
     *   Row 1 → id = 1
     *   Row 2 → id = 2
     *   Row 3 → id = 3  … and so on.
     */

    private Long id;
    // Long (capital L) is used for IDs because it supports very large
    // numbers (up to 9.2 × 10¹⁸). int would only go up to ~2 billion.


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 2: donorName
    //  MySQL column: donor_name  VARCHAR(150), NOT NULL
    //  The name of the person, restaurant, or organisation donating.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "donor_name", nullable = false, length = 150)
    /*
     * @Column  customises how a field maps to a database column.
     *   name       = the column name in MySQL  (snake_case convention)
     *   nullable   = false means this column cannot be empty (NOT NULL)
     *   length     = maximum number of characters for VARCHAR columns
     *
     * If you leave out @Column, Hibernate uses the Java field name
     * directly (e.g. "donorName") which works but is less conventional
     * for database naming.
     */
    private String donorName;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 3: foodName
    //  MySQL column: food_name  VARCHAR(200), NOT NULL
    //  The name of the food being donated (e.g. "Vegetable Biryani").
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "food_name", nullable = false, length = 200)
    private String foodName;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 4: foodCategory  (ENUM)
    //  MySQL column: food_category  VARCHAR(50), NOT NULL
    //  Categorises the food: COOKED_MEAL, FRUITS, DAIRY, etc.
    // ═════════════════════════════════════════════════════════════════

    @Enumerated(EnumType.STRING)
    /*
     * @Enumerated(EnumType.STRING)
     * ─────────────────────────────
     * Tells Hibernate HOW to store an enum value in the database.
     *
     * EnumType.STRING  →  stores the constant NAME as text
     *                     e.g.  COOKED_MEAL  →  "COOKED_MEAL"  in MySQL
     *
     * EnumType.ORDINAL →  stores the position number (0, 1, 2 …)
     *                     AVOID this — if you reorder the enum, all
     *                     existing data in the DB becomes wrong.
     *
     * Always use EnumType.STRING. It is readable and safe.
     */

    @Column(name = "food_category", nullable = false, length = 50)
    private FoodCategory foodCategory;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 5: quantity
    //  MySQL column: quantity  VARCHAR(100), NOT NULL
    //  A free-text description of the amount (e.g. "5 kg", "30 meals").
    //  We use String because quantity has a unit (kg, packets, litres…)
    //  that does not fit a plain number.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "quantity", nullable = false, length = 100)
    private String quantity;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 6: numberOfPeople
    //  MySQL column: number_of_people  INT
    //  Estimated number of people this donation can feed.
    //  Integer (boxed type) is used so the value can be null in the DB.
    //  (int primitive cannot be null; Integer wrapper can be null.)
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "number_of_people")
    private Integer numberOfPeople;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 7: preparationType  (ENUM)
    //  MySQL column: preparation_type  VARCHAR(20), NOT NULL
    //  How the food was prepared: COOKED, BAKED, RAW, PACKAGED, OTHER.
    // ═════════════════════════════════════════════════════════════════

    @Enumerated(EnumType.STRING)
    @Column(name = "preparation_type", nullable = false, length = 20)
    private PreparationType preparationType;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 8: preparationDateTime
    //  MySQL column: preparation_date_time  DATETIME
    //  The exact date and time when the food was prepared.
    //  LocalDateTime stores both date and time without a time zone.
    //  MySQL maps this to a DATETIME column.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "preparation_date_time")
    private LocalDateTime preparationDateTime;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 9: storageCondition  (ENUM)
    //  MySQL column: storage_condition  VARCHAR(20), NOT NULL
    //  How the food is being stored: ROOM_TEMPERATURE, REFRIGERATED, OTHER.
    //  This is used by the AI to adjust the freshness score.
    // ═════════════════════════════════════════════════════════════════

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_condition", nullable = false, length = 20)
    private StorageCondition storageCondition;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 10: expectedExpiry
    //  MySQL column: expected_expiry  DATETIME, NOT NULL
    //  The date and time the donor expects the food to expire.
    //  This is the value entered by the donor on the frontend form.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "expected_expiry", nullable = false)
    private LocalDateTime expectedExpiry;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 11: foodImagePath
    //  MySQL column: food_image_path  VARCHAR(500)
    //  The file path or URL where the uploaded food image is stored.
    //  e.g. "/uploads/donations/ZH-0001-food.jpg"
    //  The actual image file is stored on disk; only the path is in the DB.
    //  nullable = true (image upload is optional in some workflows).
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "food_image_path", length = 500)
    private String foodImagePath;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 12: location
    //  MySQL column: location  VARCHAR(300), NOT NULL
    //  The pickup address provided by the donor.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "location", nullable = false, length = 300)
    private String location;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 13: contact
    //  MySQL column: contact  VARCHAR(15), NOT NULL
    //  The donor's phone number (10-digit mobile number in India).
    //  We use VARCHAR(15) to allow for country codes (+91…) if needed.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "contact", nullable = false, length = 15)
    private String contact;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 14: freshnessScore
    //  MySQL column: freshness_score  INT
    //  The AI-calculated score from 0 to 100.
    //  0   = completely spoiled / expired
    //  100 = perfectly fresh
    //  Null until the AI analysis is complete.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "freshness_score")
    private Integer freshnessScore;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 15: freshnessStatus  (ENUM)
    //  MySQL column: freshness_status  VARCHAR(20)
    //  Human-readable result of the AI check: FRESH, MODERATE,
    //  EXPIRING_SOON, or NOT_RECOMMENDED.
    //  Null until the AI analysis is complete.
    // ═════════════════════════════════════════════════════════════════

    @Enumerated(EnumType.STRING)
    @Column(name = "freshness_status", length = 20)
    private FreshnessStatus freshnessStatus;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 16: estimatedExpiry
    //  MySQL column: estimated_expiry  DATETIME
    //  The expiry time CALCULATED by the AI based on:
    //    - preparation time
    //    - storage condition
    //    - food category
    //    - preparation type
    //  This may differ from expectedExpiry (which is the donor's guess).
    //  Null until the AI analysis is complete.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "estimated_expiry")
    private LocalDateTime estimatedExpiry;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 17: aiMessage
    //  MySQL column: ai_message  TEXT
    //  A plain-language safety message generated by the AI.
    //  e.g. "This food is fresh and safe to donate. Distribute within
    //        4 hours. Store in a cool place during transport."
    //  TEXT type is used instead of VARCHAR because the message can be
    //  longer than 255 characters.
    //  Null until the AI analysis is complete.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "ai_message", columnDefinition = "TEXT")
    /*
     * columnDefinition = "TEXT"
     * Explicitly sets the MySQL column type to TEXT instead of the
     * default VARCHAR(255). Use this for any field that may hold
     * more than 255 characters.
     */
    private String aiMessage;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 18: status  (ENUM)
    //  MySQL column: status  VARCHAR(20), NOT NULL
    //  The current lifecycle stage of this donation.
    //  Starts as ANALYZING when the record is first created.
    //  Progresses through VERIFIED → WAITING_FOR_NGO → ACCEPTED →
    //  PICKUP_PENDING → COMPLETED   (or REJECTED / EXPIRED).
    // ═════════════════════════════════════════════════════════════════

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private DonationStatus status;


    // ═════════════════════════════════════════════════════════════════
    //  FIELD 19: createdAt
    //  MySQL column: created_at  DATETIME, NOT NULL, updatable = false
    //  The exact timestamp when this donation record was first saved.
    //  updatable = false means Hibernate will NEVER change this value
    //  after the first INSERT — it is a permanent creation timestamp.
    // ═════════════════════════════════════════════════════════════════

    @Column(name = "created_at", nullable = false, updatable = false)
    /*
     * updatable = false
     * ──────────────────
     * Prevents Hibernate from including this column in UPDATE statements.
     * Once a row is inserted, created_at is locked forever.
     * This guarantees an accurate audit trail.
     */
    private LocalDateTime createdAt;


    // ═════════════════════════════════════════════════════════════════
    //  CONSTRUCTORS
    // ═════════════════════════════════════════════════════════════════

    /**
     * No-argument constructor  (REQUIRED by JPA)
     *
     * JPA/Hibernate needs to be able to create an empty FoodDonation
     * object and then fill in the fields one by one when it reads a
     * row from the database.  Without this constructor, Spring Boot
     * will throw an error at startup.
     *
     * Rule: every @Entity class MUST have a no-arg constructor.
     */
    public FoodDonation() {
        // Sets a sensible default: every new donation starts in ANALYZING state.
        // The createdAt timestamp is set here so it is never accidentally null.
        this.status    = DonationStatus.ANALYZING;
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Convenience constructor for creating a donation from the frontend form.
     *
     * You pass in all the fields the donor fills in on index.html.
     * The AI result fields (freshnessScore, freshnessStatus,
     * estimatedExpiry, aiMessage) are left null — they will be
     * filled in by the AI service in a later step.
     *
     * @param donorName          Donor's name or organisation
     * @param foodName           Name of the food
     * @param foodCategory       Food category enum value
     * @param quantity           Quantity as a text string
     * @param numberOfPeople     Estimated number of people it can feed
     * @param preparationType    How the food was prepared
     * @param preparationDateTime When the food was prepared
     * @param storageCondition   How it is being stored
     * @param expectedExpiry     Donor's estimate of when it expires
     * @param foodImagePath      Path to the uploaded image file
     * @param location           Pickup address
     * @param contact            Donor's phone number
     */
    public FoodDonation(String donorName, String foodName,
                        FoodCategory foodCategory, String quantity,
                        Integer numberOfPeople, PreparationType preparationType,
                        LocalDateTime preparationDateTime,
                        StorageCondition storageCondition,
                        LocalDateTime expectedExpiry,
                        String foodImagePath, String location, String contact) {

        this.donorName           = donorName;
        this.foodName            = foodName;
        this.foodCategory        = foodCategory;
        this.quantity            = quantity;
        this.numberOfPeople      = numberOfPeople;
        this.preparationType     = preparationType;
        this.preparationDateTime = preparationDateTime;
        this.storageCondition    = storageCondition;
        this.expectedExpiry      = expectedExpiry;
        this.foodImagePath       = foodImagePath;
        this.location            = location;
        this.contact             = contact;

        // AI result fields — filled in later by the AI service
        this.freshnessScore   = null;
        this.freshnessStatus  = null;
        this.estimatedExpiry  = null;
        this.aiMessage        = null;

        // Set initial lifecycle defaults
        this.status    = DonationStatus.ANALYZING;
        this.createdAt = LocalDateTime.now();
    }


    // ═════════════════════════════════════════════════════════════════
    //  GETTERS AND SETTERS
    //
    //  WHY DO WE NEED THESE?
    //  ─────────────────────
    //  All fields above are declared as  private.
    //  Private means code OUTSIDE this class cannot directly read or
    //  change them (e.g. donationObject.donorName would be a compile error).
    //
    //  Getter methods let outside code READ a field:
    //    String name = donation.getDonorName();
    //
    //  Setter methods let outside code WRITE a field:
    //    donation.setDonorName("Raj's Restaurant");
    //
    //  Spring (Jackson JSON library) uses getters to convert a
    //  FoodDonation object into a JSON response for the frontend.
    //  JPA uses setters to populate a FoodDonation object from a DB row.
    // ═════════════════════════════════════════════════════════════════

    // ── id ────────────────────────────────────────────────────────
    public Long getId()            { return id; }
    public void setId(Long id)     { this.id = id; }

    // ── donorName ─────────────────────────────────────────────────
    public String getDonorName()                  { return donorName; }
    public void   setDonorName(String donorName)  { this.donorName = donorName; }

    // ── foodName ──────────────────────────────────────────────────
    public String getFoodName()                 { return foodName; }
    public void   setFoodName(String foodName)  { this.foodName = foodName; }

    // ── foodCategory ──────────────────────────────────────────────
    public FoodCategory getFoodCategory()                       { return foodCategory; }
    public void         setFoodCategory(FoodCategory foodCategory) { this.foodCategory = foodCategory; }

    // ── quantity ──────────────────────────────────────────────────
    public String getQuantity()               { return quantity; }
    public void   setQuantity(String quantity){ this.quantity = quantity; }

    // ── numberOfPeople ────────────────────────────────────────────
    public Integer getNumberOfPeople()                      { return numberOfPeople; }
    public void    setNumberOfPeople(Integer numberOfPeople){ this.numberOfPeople = numberOfPeople; }

    // ── preparationType ───────────────────────────────────────────
    public PreparationType getPreparationType()                           { return preparationType; }
    public void            setPreparationType(PreparationType preparationType){ this.preparationType = preparationType; }

    // ── preparationDateTime ───────────────────────────────────────
    public LocalDateTime getPreparationDateTime()                             { return preparationDateTime; }
    public void          setPreparationDateTime(LocalDateTime preparationDateTime){ this.preparationDateTime = preparationDateTime; }

    // ── storageCondition ──────────────────────────────────────────
    public StorageCondition getStorageCondition()                           { return storageCondition; }
    public void             setStorageCondition(StorageCondition storageCondition){ this.storageCondition = storageCondition; }

    // ── expectedExpiry ────────────────────────────────────────────
    public LocalDateTime getExpectedExpiry()                          { return expectedExpiry; }
    public void          setExpectedExpiry(LocalDateTime expectedExpiry){ this.expectedExpiry = expectedExpiry; }

    // ── foodImagePath ─────────────────────────────────────────────
    public String getFoodImagePath()                        { return foodImagePath; }
    public void   setFoodImagePath(String foodImagePath)    { this.foodImagePath = foodImagePath; }

    // ── location ──────────────────────────────────────────────────
    public String getLocation()               { return location; }
    public void   setLocation(String location){ this.location = location; }

    // ── contact ───────────────────────────────────────────────────
    public String getContact()              { return contact; }
    public void   setContact(String contact){ this.contact = contact; }

    // ── freshnessScore ────────────────────────────────────────────
    public Integer getFreshnessScore()                        { return freshnessScore; }
    public void    setFreshnessScore(Integer freshnessScore)  { this.freshnessScore = freshnessScore; }

    // ── freshnessStatus ───────────────────────────────────────────
    public FreshnessStatus getFreshnessStatus()                             { return freshnessStatus; }
    public void            setFreshnessStatus(FreshnessStatus freshnessStatus){ this.freshnessStatus = freshnessStatus; }

    // ── estimatedExpiry ───────────────────────────────────────────
    public LocalDateTime getEstimatedExpiry()                           { return estimatedExpiry; }
    public void          setEstimatedExpiry(LocalDateTime estimatedExpiry){ this.estimatedExpiry = estimatedExpiry; }

    // ── aiMessage ─────────────────────────────────────────────────
    public String getAiMessage()                  { return aiMessage; }
    public void   setAiMessage(String aiMessage)  { this.aiMessage = aiMessage; }

    // ── status ────────────────────────────────────────────────────
    public DonationStatus getStatus()                     { return status; }
    public void           setStatus(DonationStatus status){ this.status = status; }

    // ── createdAt ─────────────────────────────────────────────────
    public LocalDateTime getCreatedAt()                         { return createdAt; }
    public void          setCreatedAt(LocalDateTime createdAt)  { this.createdAt = createdAt; }


    // ═════════════════════════════════════════════════════════════════
    //  toString()  —  useful for debugging
    //
    //  When you do  System.out.println(donation)  or log a donation,
    //  Java calls toString() automatically.  Without this override it
    //  would print something unhelpful like "FoodDonation@3a1c7b4d".
    //  With this override it prints readable field values instead.
    // ═════════════════════════════════════════════════════════════════

    @Override
    public String toString() {
        return "FoodDonation{" +
               "id="                  + id                  +
               ", donorName='"        + donorName           + '\'' +
               ", foodName='"         + foodName            + '\'' +
               ", foodCategory="      + foodCategory        +
               ", quantity='"         + quantity            + '\'' +
               ", numberOfPeople="    + numberOfPeople      +
               ", preparationType="   + preparationType     +
               ", storageCondition="  + storageCondition    +
               ", expectedExpiry="    + expectedExpiry      +
               ", location='"         + location            + '\'' +
               ", freshnessScore="    + freshnessScore      +
               ", freshnessStatus="   + freshnessStatus     +
               ", status="            + status              +
               ", createdAt="         + createdAt           +
               '}';
    }
}
