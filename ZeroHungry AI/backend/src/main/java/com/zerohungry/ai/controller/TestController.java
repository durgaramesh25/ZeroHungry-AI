package com.zerohungry.ai.controller;

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS — the Spring annotations we need for this controller
// ─────────────────────────────────────────────────────────────────────────────
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ═══════════════════════════════════════════════════════════════════
 *  TestController
 *
 *  PURPOSE:
 *    A simple controller with ONE endpoint:
 *        GET  http://localhost:8080/api/test
 *
 *    It exists purely to confirm that the Spring Boot server
 *    is running correctly. Think of it as a "Hello World" for
 *    the backend.
 *
 *    In a later step this will be replaced by real endpoints
 *    like POST /api/donations and GET /api/donations.
 * ═══════════════════════════════════════════════════════════════════
 */

@RestController
/*
 * @RestController tells Spring two things:
 *
 *   1. @Controller
 *      This class handles incoming HTTP requests.
 *      Spring will look here when a request arrives.
 *
 *   2. @ResponseBody
 *      Every method in this class should send its return value
 *      directly as the HTTP response body.
 *      If you return a String  → the browser gets that plain text.
 *      If you return an Object → Spring converts it to JSON automatically.
 *
 * Without @RestController you would have to add @ResponseBody
 * to every single method. @RestController saves you that work.
 */

@RequestMapping("/api")
/*
 * @RequestMapping("/api")
 *
 * Sets a BASE URL prefix for ALL methods in this class.
 * Every endpoint URL will start with /api
 *
 * Example:
 *   Class-level  →  /api
 *   Method-level →  /test
 *   Final URL    →  /api/test
 *
 * This helps organise endpoints logically.
 * All our backend URLs will start with /api to separate them
 * from any future frontend server routes.
 */

@CrossOrigin(origins = "*")
/*
 * @CrossOrigin(origins = "*")
 *
 * By default, browsers block requests from one origin (e.g. port 5500)
 * to a different origin (port 8080). This security rule is called CORS
 * — Cross-Origin Resource Sharing.
 *
 * @CrossOrigin("*") tells Spring: "Allow requests from ANY origin."
 * This lets our frontend (running on Live Server port 5500) call
 * our backend (running on port 8080) without being blocked.
 *
 * In production we would replace "*" with the specific frontend URL
 * for security, e.g. @CrossOrigin("https://zerohungry.com")
 */
public class TestController {

    /**
     * test()
     *
     * Handles:   GET  /api/test
     * Returns:   A plain text string
     *
     * ──────────────────────────────────────────────────────────────
     * HOW A REQUEST FLOWS THROUGH THIS METHOD:
     *
     *   1. You type http://localhost:8080/api/test in your browser.
     *   2. Browser sends:  GET /api/test  to port 8080.
     *   3. Spring Boot receives the request.
     *   4. Spring looks for a method mapped to GET /api/test.
     *   5. It finds this method because of @GetMapping("/test").
     *   6. Spring calls test().
     *   7. test() returns the String below.
     *   8. Spring sends the String back as the HTTP response.
     *   9. Your browser displays:  ZeroHungry AI Backend is running!
     * ──────────────────────────────────────────────────────────────
     */
    @GetMapping("/test")
    /*
     * @GetMapping("/test")
     *
     * Maps HTTP GET requests for the path /test to this method.
     * Combined with the class-level @RequestMapping("/api"),
     * the full URL becomes:  GET /api/test
     *
     * GET is the HTTP method your browser uses when you type a URL.
     * Other HTTP methods we will use later:
     *   POST   — create new data  (e.g. submit a donation)
     *   PUT    — update data      (e.g. edit a donation)
     *   DELETE — delete data      (e.g. remove a donation)
     */
    public String test() {
        // This string is sent back to whoever calls this endpoint.
        return "ZeroHungry AI Backend is running!";
    }
}
