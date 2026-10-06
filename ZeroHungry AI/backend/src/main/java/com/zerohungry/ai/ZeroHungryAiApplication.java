package com.zerohungry.ai;

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTS
// An import tells Java: "I want to use a class from another library."
// Without imports, Java would not know what SpringApplication or
// @SpringBootApplication mean.
// ─────────────────────────────────────────────────────────────────────────────
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ═══════════════════════════════════════════════════════════════════
 *  ZeroHungryAiApplication  —  THE ENTRY POINT
 *
 *  This is the FIRST class Java runs when you start the backend.
 *  Think of it as the "ON switch" for the entire application.
 *
 *  When this class runs:
 *    1. Spring Boot starts an embedded web server (Apache Tomcat).
 *       "Embedded" means the server is built right into the app —
 *       you do NOT need to install Tomcat separately.
 *    2. The server starts listening on port 8080.
 *    3. Spring scans every class in this package and sub-packages
 *       looking for @RestController, @Service, @Repository, etc.
 *    4. Your REST APIs become available at http://localhost:8080
 * ═══════════════════════════════════════════════════════════════════
 */
@SpringBootApplication
/*
 * @SpringBootApplication is a SHORTCUT that combines three annotations:
 *
 *   @Configuration
 *   └─ Marks this class as a source of Spring bean definitions.
 *      (A "bean" is an object that Spring creates and manages for you.)
 *
 *   @EnableAutoConfiguration
 *   └─ Tells Spring Boot to automatically set up the application
 *      based on the dependencies in pom.xml.
 *      Example: because we have spring-boot-starter-web, Spring Boot
 *      automatically configures an embedded Tomcat server.
 *
 *   @ComponentScan
 *   └─ Tells Spring to scan this package (com.zerohungry.ai) and
 *      ALL sub-packages for annotated classes like @RestController.
 *      This is how Spring finds your controllers automatically.
 */
public class ZeroHungryAiApplication {

    /**
     * main() — Java always starts here.
     *
     * SpringApplication.run(...)
     *   • Takes this class and the command-line arguments.
     *   • Bootstraps the entire Spring application context.
     *   • Starts the embedded Tomcat server.
     *   • Returns when the server is up and ready.
     *
     * @param args  Command-line arguments (we don't use any for now)
     */
    public static void main(String[] args) {

        // This single line starts the entire Spring Boot application.
        SpringApplication.run(ZeroHungryAiApplication.class, args);

        // This line prints a message to the terminal so you know
        // the server started successfully.
        System.out.println("============================================");
        System.out.println("  ZeroHungry AI Backend is running!");
        System.out.println("  URL : http://localhost:8080");
        System.out.println("  Test: http://localhost:8080/api/test");
        System.out.println("============================================");
    }
}
