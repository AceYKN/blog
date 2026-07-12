# Chapter 7: Design and Implementation

***

# Executive Summary
Chapter 7 bridges the gap between requirements engineering and the actual coding of the software. It focuses on the transition from conceptual requirements to an executable system. The chapter emphasizes **object-oriented design** using the Unified Modeling Language (UML), the utilization of **design patterns** to solve recurring problems, and critical implementation issues that software engineers must manage, such as **software reuse, configuration management, and open-source development**. 

***

## 1. Introduction to Design and Implementation
Software **design** is a creative process where you identify software components and their relationships based on a customer?™s requirements. **Implementation** is the process of realizing this design as an executable program. 

These two activities are inherently linked and invariably interleaved. In agile environments, formal design documentation might be skipped in favor of whiteboard sketches, while plan-driven approaches might mandate detailed UML modeling before any code is written. A critical early decision in this phase is the "build vs. buy" dilemma: evaluating whether to build the software from scratch or buy and adapt an off-the-shelf application to save time and money.

***

## 2. Object-Oriented Design using the UML
An **object-oriented (OO) system** is composed of interacting objects that maintain their own private, local state and provide operations to manipulate that state. This concept of *encapsulation* ensures that the representation of an object's state cannot be accessed directly from outside the object, meaning modifying one object does not unintentionally break others.

The OO design process generally involves five sequential (but often iterative) steps:

### 2.1 System Context and Interactions
* **The "Why"**: Before designing the internal architecture, you must define the system boundaries to understand what lies outside the system. 
* **The "How"**: 
    * A **System Context Model** is created to illustrate the external entities (other systems, users, hardware) that interact with the software. 
    * A **Use Case Model** is then used to map out *what* interactions occur without detailing *how* they are processed internally.

### 2.2 System Architecture
Once the context and external interactions are clear, engineers design the overarching architecture to handle these interactions. This involves identifying the major components that make up the system and organizing them using architectural patterns (like a layered or client-server model).

### 2.3 Object Class Identification
Identifying the core objects is one of the most challenging parts of OO design. Engineers use several analytical techniques to discover them:
1.  **Grammatical Analysis:** Parsing natural language requirements. Nouns translate to objects or attributes, while verbs translate to operations or services.
2.  **Tangible Entities:** Identifying physical things (e.g., an aircraft), roles (e.g., manager), or events (e.g., a request) in the application domain.
3.  **Scenario-Based Analysis:** Tracing through specific use cases to see what data and actions are required to fulfill a scenario.

> **Mastery Application (Object Identification):** Imagine you are designing software for a wilderness weather station. A grammatical analysis of the requirement *"The system must report weather data"* reveals a `WeatherData` object (from the noun) and a `report()` operation (from the verb). 

### 2.4 Design Models
Models act as the bridge between abstract requirements and concrete implementation. In UML, two primary categories of models are used to document a design:
* **Structural (Static) Models:** Define the system's static structure. Examples include **Subsystem Models** (logical groupings of objects) and Class Diagrams showing inheritance and composition.
* **Dynamic Models:** Describe runtime interactions. **Sequence Models** chronologically map out the sequence of object interactions for a specific use case , while **State Machine Models** track how an individual object's state changes in response to specific events.

### 2.5 Interface Specification
Interfaces must be unambiguously defined so that individual objects and subsystems can be developed in parallel by different programmers. 
* **The Golden Rule:** Interface specifications should *never* expose the internal data representation (attributes). 
* **The "Why":** If data representation is hidden, it can be easily changed (e.g., switching from an array to a linked list) without breaking any external objects that rely on that interface. This leads to inherently more maintainable code.

***

## 3. Design Patterns
A **design pattern** is a stylized, abstract description of accumulated wisdom?”a well-tried solution to a common, recurring software design problem. Patterns facilitate high-level "concept reuse." When you try to reuse exact executable code, you are constrained by the original programmer's specific algorithms; patterns allow you to reuse the *idea* but adapt the implementation to your unique system.

### 3.1 Elements of a Design Pattern
As defined by the "Gang of Four" (the pioneers of software design patterns), a pattern includes four essential elements:
1.  **Name:** A meaningful reference to the pattern.
2.  **Problem Description:** Explains the motivation and situations where the pattern is applicable.
3.  **Solution Description:** A template (often graphical) showing the objects, their relationships, and responsibilities.
4.  **Consequences:** The trade-offs and results of applying the pattern.

### 3.2 Mastery Application: The Observer Pattern
* **The Problem:** You need multiple display formats (e.g., a pie chart and a bar graph) for the exact same underlying dataset, and all of them must update instantly when the data changes.
* **The Solution:** The **Observer pattern** separates the data (the `Subject`) from its displays (the `Observers`). The `Subject` maintains the state. When the state changes, the `Subject` issues a notification to all attached `Observers`. The `Observer` objects then automatically pull the updated data and refresh their specific displays. 

***

## 4. Implementation Issues
Once the design is mapped out, programmers write the code. However, modern software engineering requires managing three major non-programming implementation issues:

### 4.1 Software Reuse
Developing software entirely from scratch is expensive and risky. Modern software is heavily constructed by reusing existing components.
* **Abstraction Level:** Reusing successful design patterns and architectural styles.
* **Object Level:** Directly reusing specific objects/methods from existing libraries (e.g., using a JavaMail library to process emails).
* **Component Level:** Reusing entire frameworks or collections of objects (e.g., a User Interface framework that handles window displays and event handling).
* **The Trade-off:** While reuse saves time, it involves costs: the time spent searching for and evaluating the software, purchasing licenses, adapting it to your needs, and integrating conflicting components.

### 4.2 Configuration Management
Because software changes continuously during development, change management is essential. If a team doesn't track versions, developers will overwrite each other's code.
* **Version Management:** Tools that keep track of component versions and coordinate team development to stop code conflicts.
* **System Integration:** Tools that help developers define exactly which versions of which components are combined to create a specific system release. 

### 4.3 Host-Target Development
Software is rarely executed on the same machine it was coded on. 
* **The Host:** The development platform where the code is written (using an Integrated Development Environment or IDE).
* **The Target:** The execution platform where the software will live. Developers must consider the target's specific hardware constraints, physical size, and operating system during implementation.

***

## 5. Open-Source Development
Open-source development involves publishing the source code of a system and inviting a vast community of volunteers to participate in its development and improvement. 

### 5.1 Business and Practical Considerations
Making software open-source can reassure customers; if the original company goes out of business, the users know they will still have access to the code and can maintain it themselves. However, open-sourcing a highly specialized application does not guarantee a flood of volunteer developers?”most highly successful open-source projects are broad, foundational platform products.

### 5.2 Open-Source Licensing Models
While the code is freely available, the developer still legally owns the code and uses licenses to dictate exactly how it can be reused:
1.  **GNU General Public License (GPL):** A "reciprocal" license. If you embed GPL-licensed code in your system, your entire system *must* also be made open-source.
2.  **GNU Lesser General Public License (LGPL):** A variant where you can link to LGPL code without open-sourcing your entire system. However, if you modify the LGPL component itself, those specific modifications must be published.
3.  **Berkley Standard Distribution (BSD) / MIT:** Non-reciprocal licenses. You can use the code in proprietary, closed-source commercial systems that you sell, as long as you acknowledge the original creator of the code.