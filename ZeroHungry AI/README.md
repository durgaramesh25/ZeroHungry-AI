# 🍱 ZeroHungry AI – Food Donation Management System

> Connecting food donors with NGOs to reduce food wastage.

---

## 📁 Project Structure

```
ZeroHungry AI/
│
├── frontend/                   ← Everything the user sees in the browser
│   ├── index.html              ← Main web page (structure/content)
│   ├── style.css               ← Visual design (colors, layout, fonts)
│   └── script.js               ← Dynamic behaviour (form, API calls)
│
├── backend/                    ← Spring Boot server (Java)
│   ├── pom.xml                 ← Maven config: dependencies & build settings
│   └── src/
│       ├── main/
│       │   ├── java/com/zerohungry/app/
│       │   │   ├── ZeroHungryApplication.java   ← Entry point (run this)
│       │   │   ├── controller/
│       │   │   │   └── DonationController.java  ← REST API endpoints
│       │   │   ├── model/
│       │   │   │   └── Donation.java            ← Data shape (future DB table)
│       │   │   ├── repository/                  ← DB access layer (coming soon)
│       │   │   └── service/                     ← Business logic (coming soon)
│       │   └── resources/
│       │       └── application.properties       ← Server config (port, DB, etc.)
│       └── test/                                ← Unit/integration tests
│
└── README.md                   ← You are here
```

---

## 🗂️ What Each Folder Does

| Folder / File | Purpose |
|---|---|
| `frontend/` | Pure HTML/CSS/JS files — no framework needed. Open `index.html` in a browser. |
| `backend/` | Spring Boot Java project. Runs as a web server on port 8080. |
| `controller/` | Receives HTTP requests from the frontend and sends back responses. |
| `model/` | Java classes that represent real-world objects (e.g. a Donation). |
| `repository/` | Will talk to the database using Spring Data JPA (added later). |
| `service/` | Will contain business logic, e.g. matching donors with NGOs (added later). |
| `resources/` | Configuration files that Spring Boot reads at startup. |

---

## 🔧 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Java 17, Spring Boot 3.2 |
| Database | MySQL (to be added) |
| ORM | Spring Data JPA / Hibernate (to be added) |
| Communication | REST APIs (JSON over HTTP) |

---

## 🔌 How Frontend and Backend Communicate

```
┌─────────────────────┐         HTTP Request          ┌──────────────────────┐
│                     │  ──── GET /api/donations ───▶  │                      │
│   Browser           │                               │   Spring Boot        │
│   (index.html +     │  ◀─── JSON Response ────────  │   (port 8080)        │
│    script.js)       │                               │                      │
└─────────────────────┘                               └──────────────────────┘
```

1. The browser loads `index.html` and runs `script.js`.
2. `script.js` uses the browser's `fetch()` function to send HTTP requests.
3. Spring Boot receives the request in a `@RestController` class.
4. The controller returns data as JSON.
5. `script.js` receives the JSON and updates the page — no page reload needed.

**Example already wired up:**
- `script.js` calls `GET http://localhost:8080/api/donations/ping`
- `DonationController.java` handles it and returns `{ "status": "ok", "message": "..." }`
- The frontend shows the backend status in the yellow bar on the page.

---

## 🚀 How to Run

### Backend (Spring Boot)
1. Make sure you have **Java 17+** and **Maven** installed.
2. Open a terminal inside the `backend/` folder.
3. Run:
   ```bash
   mvn spring-boot:run
   ```
4. You should see: `✅ ZeroHungry AI Backend is running on http://localhost:8080`

### Frontend
1. Open `frontend/index.html` directly in your browser, **OR**
2. Use the VS Code extension **Live Server** for auto-reload on save.

---

## 🗺️ Roadmap (Next Steps)

- [ ] Step 6 – Add MySQL database connection
- [ ] Step 7 – Add JPA annotations to `Donation.java` (make it a real DB table)
- [ ] Step 8 – Add `DonationRepository` (CRUD operations)
- [ ] Step 9 – Add POST API to save donations from the form
- [ ] Step 10 – Add GET API to list all donations
- [ ] Step 11 – Connect frontend form to POST API using `fetch()`
- [ ] Step 12 – Add NGO module
- [ ] Step 13 – Add user authentication (Spring Security)
- [ ] Step 14 – Add AI-based donor-NGO matching

---

## 👨‍💻 Built With

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [MySQL](https://www.mysql.com/)
