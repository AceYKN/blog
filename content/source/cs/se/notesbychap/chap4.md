# Chapter 4 - Requirements Engineering

**Requirements Engineering (RE)** is the foundational stage of the software development lifecycle. It is the systematic process of discovering, analyzing, documenting, and validating the services that a system should provide and the constraints under which it must operate. Failing to properly engineer requirements leads to systems that do not meet user needs, exceed budgets, and are plagued by constant rework. 

This chapter breaks down RE into four deeply interconnected phases: **Elicitation** (finding out what is needed), **Specification** (writing it down precisely), **Validation** (ensuring it is exactly what the customer wants), and **Requirements Management** (controlling the inevitable changes that arise during and after development). 

***

## 1. The Anatomy of a Requirement: Start from Zero

Before diving into the processes of RE, we must define what a "requirement" actually is. In software engineering, the term is highly elastic. A requirement can range from a high-level, abstract statement of a feature ("The system shall track patient records") to a mathematically precise definition of an algorithm. 

To prevent confusion, software engineers separate requirements into two distinct layers based on the **audience**:

### 1.1 User Requirements
* **What it is:** High-level, abstract statements of the services the system is expected to provide and its operational constraints. 
* **Target Audience:** Client managers, system end-users, and business stakeholders.
* **Format:** Written in simple, natural language supplemented by intuitive diagrams. They deliberately avoid technical jargon or software architecture details.
* **The "Why":** A business manager needs to understand *what* the system will do for the company without getting bogged down by *how* the database is structured. 

### 1.2 System Requirements
* **What it is:** A highly detailed and precise description of the software system's functions, services, and constraints. This document (often called the functional specification) serves as the contract between the buyer and the software developers.
* **Target Audience:** System architects, software developers, and client engineers.
* **Format:** Structured natural language, graphical models (like UML diagrams), or formal mathematical specifications.
* **The "Why":** Developers need unambiguous, exact instructions to write code. A vague user requirement like "The system should be fast" is useless to a developer; they need a system requirement like "The system shall process a database query within 500 milliseconds."

***

## 2. Deep Dive: Functional vs. Non-Functional Requirements

A core analytical framework in RE is classifying requirements into functional and non-functional categories. 

### 2.1 Functional Requirements
These describe **what the system should do**. They detail the system's exact reactions to specific inputs and its behavior in specific situations. 
* **Traits:** They must ideally be **complete** (all required services are defined) and **consistent** (no contradictory definitions). 
* **Mastery Application (Edge Case):** In a mental health care system (like the textbook's *Mentcare* example), a functional requirement might be: *"The system shall allow users to search for patient appointments across all clinics."* However, if the specification lacks precision, a developer might implement a search function that requires the user to select a clinic *first* before searching, slowing down the medical staff. Precision in functional requirements prevents developer assumptions.

### 2.2 Non-Functional Requirements (NFRs)
These describe **how the system should behave**. They are constraints on the services offered by the system, such as timing, security, and performance. 
* **The "Why":** NFRs are often *more critical* than functional requirements. If a system lacks a minor functional feature, users can usually find a workaround. But if an NFR fails—for example, if a heart monitor's real-time processing fails, or an aircraft's reliability constraint is breached—the entire system is useless or dangerous.
* **Categories of NFRs:**
    1.  **Product Requirements:** Dictate the software's runtime behavior (e.g., execution speed, memory footprint, reliability).
    2.  **Organizational Requirements:** Derived from the customer's or developer's policies (e.g., the system must be written in Java, or users must authenticate via smart-card swipe).
    3.  **External Requirements:** Derived from external laws or environments (e.g., the system must comply with HIPAA privacy legislation).

### 2.3 The Verifiability Problem
A common pitfall is writing NFRs as "goals" (e.g., *"The system shall be easy to use"*). Goals are impossible to test. To master NFRs, you must translate goals into **verifiable metrics**.
* **Mastery Application:** Instead of *"easy to use,"* translate it to: *"Medical staff shall be able to use all core system functions after two hours of training. Thereafter, the average error rate shall not exceed two per hour."* This is now testable via software instrumentation and observation.

***

## 3. The Requirements Engineering Process

RE is not a strict, linear "waterfall" phase. It is an **iterative spiral**. You elicit basic requirements, specify them, validate them, and then cycle back to elicit deeper, more complex requirements. 

### 3.1 Requirements Elicitation
This is the process of discovering requirements by interacting with stakeholders. It is notoriously difficult because of several underlying assumptions about human psychology and business:
* **Tacit Knowledge:** Users know their jobs so well they leave out crucial, implicit details when explaining them to an outsider.
* **Conflicting Goals:** Different stakeholders want different things (e.g., management wants strict data tracking; nurses want quick data entry).
* **Political Factors:** Managers may demand features simply to increase their department's influence.

**Elicitation Techniques:**
1.  **Interviewing (Open and Closed):** Directly asking stakeholders about their needs. Good for baseline understanding, but poor for uncovering tacit knowledge.
2.  **Ethnography (Observation):** An analyst immerses themselves in the users' working environment. 
    * *The "Why":* Ethnography reveals how people *actually* work, rather than how the formal company manual says they work. 
    * *Mastery Application:* An ethnographic study of air traffic controllers might reveal that they deliberately switch off a conflict-alert system because it triggers false alarms. A pure interview might have yielded a requirement to "replicate the conflict-alert system," but ethnography reveals the requirement should actually be "design an alert system with a lower false-positive threshold."
3.  **Stories and Scenarios:** Using real-life examples (User Stories) to help users visualize the system. Scenarios are highly structured stories detailing the initial state, normal flow of events, edge cases (what goes wrong), and the final state.

### 3.2 Requirements Specification
This is the act of translating elicited data into a formal **Software Requirements Document (SRS)**.

**Formatting Techniques:**
* **Natural Language:** The most common, but prone to ambiguity. To mitigate this, engineers use strict rules: use **"shall"** for mandatory requirements and **"should"** for desirable ones. Always avoid jargon.
* **Structured Specifications:** Using standardized templates or forms. This forces the analyst to define inputs, outputs, preconditions, and postconditions for every function.
* **Graphical Models (UML Use Cases):** Diagrams that show the interactions between system "actors" (users or other systems) and the system itself.

### 3.3 Requirements Validation
Once the SRS is written, it must be validated. Validation answers the question: *"Are we building the right product?"* * **The "Why":** The cost of fixing a requirements error during the coding or testing phase is exponentially higher than fixing it during the RE phase. If a requirement changes, the design, code, and tests must all be rewritten.
* **Core Checks:**
    1.  **Validity Check:** Does the system provide the functions that best support the customer's needs?
    2.  **Consistency Check:** Are there contradictory requirements?
    3.  **Completeness Check:** Are all necessary functions defined?
    4.  **Realism Check:** Can this be built with the given budget and technology?
    5.  **Verifiability Check:** Can we write a test to prove this requirement was met?

**Validation Techniques:**
* **Requirements Reviews:** Systematic analysis by a team of reviewers.
* **Prototyping:** Building an executable, scaled-down model for users to experiment with.
* **Test-Case Generation:** If you cannot design a test for a requirement, the requirement is inherently flawed and must be rewritten.

***

## 4. Requirements Change (Change Management)

The final, sobering reality of Software Engineering is that **requirements will always change**. Software often solves "wicked problems"—problems so complex they cannot be fully understood until a solution is attempted.

### 4.1 Why Requirements Evolve
1.  **Changing Environments:** Hardware evolves, business priorities shift, and new laws are passed after the project begins.
2.  **Purchaser vs. User Conflict:** The management team paying for the system has different priorities than the end-users. After deployment, user pushback often forces requirements to change.
3.  **Emerging Understanding:** Seeing the software in action helps users realize what they *actually* needed.

### 4.2 The Change Management Process
To prevent project chaos, organizations must establish a formal **Requirements Management** protocol.
1.  **Problem Analysis and Change Specification:** A proposed change is evaluated to see if it is valid and necessary.
2.  **Change Analysis and Costing:** Engineers assess the impact of the change. *How much code will this break? How much will it cost?* 3.  **Change Implementation:** The requirements document, system design, and code are sequentially updated.

* **Mastery Application (Traceability):** To successfully calculate the cost of a change during step 2, engineers rely on **Requirements Traceability**. Traceability involves maintaining explicit links (usually via specialized software tools) between a user requirement, its corresponding system requirements, and the actual code. If a manager requests a change to the "Authentication Requirement," traceability tools instantly flag the three system modules and 15 database tables that will be affected by the change, allowing for a precise cost estimate.