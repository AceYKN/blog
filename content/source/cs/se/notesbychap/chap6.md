# Chapter 6: Architectural Design

***

## Executive Summary
Architectural design represents the critical bridge between requirements engineering and software design. It dictates how a software system is fundamentally organized, establishing its major structural components and their interrelationships. This chapter explores how architectural decisions profoundly impact non-functional properties?uch as performance, security, and maintainability. It introduces the concept of modeling architecture from multiple distinct views, using established "Architectural Patterns" to reuse proven design solutions, and applying generic "Application Architectures" to specific business domains.

***

## 1. Introduction to Architectural Design

### 1.1 What is Architectural Design?
Architectural design is the very first stage in the software design process. Because it is the critical link between requirements engineering and design, it identifies the main structural components in a system and defines the relationships between them. The ultimate output of this process is an architectural model that describes how the system is organized as a set of communicating components.

### 1.2 Architecture in the Small vs. Architecture in the Large
Software architecture can be designed at two distinct levels of abstraction:
* **Architecture in the small:** Concerned with the architecture of individual programs and how an individual program is decomposed into components. 
* **Architecture in the large:** Concerned with the architecture of complex enterprise systems that encompass multiple programs and systems. These are often distributed across different computers and managed by different organizations.

### 1.3 Why is Software Architecture Important?
The architecture of a system is paramount because it exerts the dominant influence on the system's non-functional characteristics?amely its performance, robustness, distributability, and maintainability. Explicitly designing and documenting it yields three major advantages:
1.  **Stakeholder Communication:** It provides a high-level presentation of the system that serves as a focal point for discussion among a wide range of stakeholders (engineers, managers, clients).
2.  **System Analysis:** Making the architecture explicit early allows engineers to analyze whether the system will actually be able to meet critical non-functional requirements.
3.  **Large-scale Reuse:** An architectural model is a compact description of system organization. Systems in similar domains often share the same architecture, which enables large-scale reuse (e.g., product-line architectures).

### 1.4 How Architectural Models are Used
Architectures are often modeled using simple, informal block diagrams. These models generally serve two distinct purposes:
* **To encourage discussion:** A high-level view facilitates communication and project planning because it is uncluttered by technical details, allowing stakeholders to easily grasp the system.
* **To document a design:** A detailed architectural description shows all components, interfaces, and connections, making it easier to understand and evolve the system during implementation.

***

## 2. Architectural Design Decisions

### 2.1 The Core Decisions
Architectural design is not a rigid sequence of activities, but rather a highly creative process driven by a series of structural decisions. System architects must rely on their expertise to answer several fundamental questions:
* What **Architectural patterns** or styles might be used?
* What fundamental approach will be used to **structure** the system?
* How will structural components be **decomposed** into sub-components?
* What strategy will be used to **control** the operation of the components?
* What organization is best for delivering the **non-functional requirements**?
* How should the architecture be **documented**?

### 2.2 Impact of Non-Functional Requirements (The Trade-offs)
Because non-functional requirements are heavily influenced by the system architecture, architects must structure the system to satisfy its most critical goals. 
* **Performance:** Demands that critical operations be localized within a small number of large components deployed on the same computer to minimize network communication.
* **Security:** Demands a layered structure where the most critical assets are protected in the innermost layers, with high-level security validation applied.
* **Safety:** Demands that safety-related operations be co-located in a single component (or very few). This simplifies safety validation and enables safe shutdown mechanisms.
* **Availability:** Demands redundant components so that parts of the system can be replaced or updated without stopping the entire system.
* **Maintainability:** Demands fine-grain, self-contained components where the producers and consumers of data are separated.

**Mastery Application:** Notice the inherent conflict here. If a system requires extremely high *Performance*, you must use a few large components. However, if it requires high *Maintainability*, you must use many small, fine-grained components. If both are required, the architect must find a compromise, sometimes applying different architectural patterns to different parts of the system to achieve a balance.

***

## 3. Architectural Views

### 3.1 The Necessity of Multiple Perspectives
It is impossible to represent all relevant architectural information in a single diagram; a graphical model can only show one perspective at a time. An architect must present multiple views to show how modules are decomposed, how runtime processes interact, and how components are physically distributed. 

**Krutchen? 4+1 View Model** is a widely referenced framework that suggests four fundamental views (linked by common use cases):
* **Logical view:** Shows the key abstractions in the system as objects or object classes, directly relating to the system requirements.
* *(The model also includes Process, Development, and Physical views).*
* **Conceptual view:** (Suggested by Hofmeister et al.) An abstract view that helps decompose high-level requirements and guides decisions about reusable components or product lines.

### 3.2 Documenting Architectures
While specialized architectural description languages (ADLs) exist to strictly define components and rules, domain experts often find them too complex. Therefore, informal models and notations?ncluding informal applications of the UML?emain the most commonly used ways of documenting system architectures. 

***

## 4. Architectural Patterns

### 4.1 What is an Architectural Pattern?
An Architectural pattern (or style) is a stylized, abstract description of good architectural practice that has been tried and tested in different systems and environments. Patterns provide a vocabulary to describe system organization, capturing the essence of an architecture that has proven successful.

### 4.2 Key Architectural Patterns
1.  **Model-View-Controller (MVC)**
    * **Description:** Separates presentation and interaction from the system data. The system is structured into three logical components: The *Model* manages the data and operations; the *View* defines how data is presented; and the *Controller* manages user interactions (e.g., clicks) and passes them to the View and Model.
    * **Application:** Widely used in web-based frameworks to allow independent modification of the data representation and the user interface.
2.  **Layered Architecture**
    * **Description:** Organizes system functionality into separate layers. Each layer relies exclusively on the facilities and services offered by the layer immediately beneath it.
    * **Benefits:** Highly changeable and portable. If an interface is unchanged, a new layer with extended functionality can completely replace an existing layer without affecting the rest of the system. It is also highly suited for enforcing multilevel security.
3.  **Repository Architecture**
    * **Description:** All data in a system is managed in a central repository. Components do not interact directly; they communicate exclusively through the shared repository.
    * **Application:** Ideal for systems where large volumes of information are generated and stored long-term, such as IDEs, CAD systems, and management information systems.
4.  **Client-Server Architecture**
    * **Description:** Models the runtime organization of a distributed system. The system is organized as a set of services and associated servers, along with clients that access and utilize those services over a network.
5.  **Pipe and Filter Architecture**
    * **Description:** Models a runtime organization where functional transformations (filters) process their inputs and produce outputs. Data flows (via pipes) from one filter to another, being transformed as it moves through the sequence. 
    * **Application:** Found heavily in data-processing systems (as batch sequential models) and embedded real-time systems.

***

## 5. Application Architectures

### 5.1 Understanding Application Architectures
Application systems designed to meet similar business needs (e.g., all phone companies need to meter calls and issue bills) share significant structural commonalities. **Application architectures** encapsulate these principal characteristics, forming generic models of different system types. This common structure can be heavily reused when developing new systems within the same domain.

### 5.2 Uses of Application Architectures
Software designers utilize these generic application architectures in multiple strategic ways:
1.  **As a Starting Point:** If you are unfamiliar with a domain, you can base your initial design on the generic architecture and specialize it.
2.  **As a Design Checklist:** You can evaluate a completed design by comparing it against the generic architecture to ensure consistency.
3.  **To Organize Work:** Because application architectures identify stable structural features, project managers can assign teams to develop different components in parallel.
4.  **To Assess Reuse:** Designers can compare available off-the-shelf components against the generic architecture to see if they fit.
5.  **As a Vocabulary:** It gives engineers a common conceptual vocabulary for discussing and comparing specific applications.

### 5.3 Common Examples
* **Language Processing Systems:** Systems where a user's intentions are expressed in a formal language (like code or XML). The system processes the language into an internal format and interprets it. Compilers are a classic example of this architecture.