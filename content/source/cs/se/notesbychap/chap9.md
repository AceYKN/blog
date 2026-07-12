# Chapter 9: Software Evolution

## Executive Summary
Software development does not end when a system is deployed; in fact, the deployment marks the beginning of the most expensive and prolonged phase of the software lifecycle: **Software Evolution**. Historical data indicates that **60% to 90% of total software costs are incurred after delivery**. This chapter explores the inevitability of software change, the structured processes used to manage these changes, the complexities of maintaining aging "legacy" systems, and the strategic differences between software maintenance, reengineering, and refactoring.

***

## 9.1 The Dynamics of Software Evolution

Assume you have just launched a brand new software system. Almost immediately, the environment it operates in will begin to shift. Competitors will launch new features, underlying operating systems will be updated, and users will uncover unforeseen bugs or request new functionalities. A system that does not adapt will quickly degrade in usefulness.

### 9.1.1 The Software Lifecycle Model (Rajlich and Bennett)
To understand a system's lifespan from the ground up, we rely on a model that divides the software lifecycle into distinct phases:
1. **Evolution:** The phase immediately following deployment. The software is actively used, and significant changes to the architecture and functionality are frequently made to meet evolving stakeholder requirements.
2. **Servicing:** Over time, continuous modifications degrade the software's underlying structure, making large architectural changes too expensive or risky. The software enters the servicing phase, where only small, tactical, and essential changes (like minor bug fixes) are made. 
3. **Phase-out:** The system is still in use, but no further changes are made. Users must simply "work around" any bugs they encounter.
4. **Retirement:** The system is taken completely offline, often requiring a complex data migration to a newer replacement system.

### 9.1.2 The Evolution Process
The process of evolving software is inherently cyclical and revolves around **change management**:
* **Change Identification:** Stakeholders (users, management, developers) submit formal or informal change proposals (e.g., bug reports, feature requests).
* **Impact Analysis:** Before accepting a change, developers must analyze the existing source code to understand how the proposed change will affect the system's architecture and to estimate the cost. 
* **Release Planning:** The approved changes are bundled into a planned new release.
* **Implementation:** The changes are coded, validated (tested), and deployed. *Crucially, if a different team is doing the evolution than did the original development, the first and most difficult step of implementation is **program understanding**?iguring out how the original code works*.

**Mastery Application (Emergency Repairs):** Sometimes, a critical bug (like a security vulnerability) forces developers to bypass the formal evolution process and issue an **emergency repair**. 
* *The "How":* The developer patches the source code directly and immediately deploys it.
* *The Consequence:* The requirements and design documentation are not updated to reflect this patch. Over time, these emergency patches cause the system's architecture to severely degrade, accelerating the transition from the *Evolution* phase into the *Servicing* phase.

***

## 9.2 Legacy Systems

**Legacy systems** are older software systems that rely on obsolete languages and technologies, but which remain absolutely critical to a business's operations. 

### 9.2.1 Why Not Just Replace Them?
It seems logical to scrap 20-year-old software, but businesses rarely do. Why? **Risk and Cost**.
* **Embedded Business Rules:** The legacy code often contains crucial, undocumented business rules (e.g., complex insurance risk-assessment algorithms). If the system is scrapped, that tacit institutional knowledge is lost.
* **Operational Risk:** The new replacement system might fail, go over budget, or disrupt daily operations. It is often cheaper to pay the high maintenance costs of an old system than to risk a catastrophic failure of a new one.

### 9.2.2 The Layers of a Legacy System
A legacy system is not just old code; it is a **sociotechnical system** made up of interdependent layers:
1. **Hardware:** Obsolete mainframe computers.
2. **Support Software:** Outdated operating systems or compilers.
3. **Application Software:** The actual legacy code.
4. **Business Processes:** The organizational workflows built around the quirks of the old software. 

*Analytical Insight:* Because these layers are heavily intertwined, you cannot simply swap out the hardware without breaking the application software, which in turn disrupts the human business processes. 

### 9.2.3 Legacy System Assessment
To decide what to do with a legacy system, managers plot the system on a matrix measuring **System Quality** against **Business Value**:

* **Low Quality, Low Business Value:** Scrap the system.
* **Low Quality, High Business Value:** The system is vital but a nightmare to maintain. It should be reengineered or replaced.
* **High Quality, Low Business Value:** Replace with off-the-shelf software or maintain it cheaply.
* **High Quality, High Business Value:** Leave the system alone and continue normal maintenance.

***

## 9.3 Software Maintenance & Reengineering

**Software Maintenance** is the general term for changing custom software after it has been delivered, particularly when the maintenance team is different from the original development team.

### 9.3.1 The Three Types of Maintenance
1. **Fault Repairs (Bug Fixing):** Correcting coding, design, or requirements errors. (Surprisingly, this usually consumes the *least* amount of maintenance effort).
2. **Environmental Adaptation:** Modifying the software to work with new hardware, operating systems, or databases.
3. **Functionality Addition:** Implementing new features to meet changing business demands. (This generally consumes the *most* maintenance effort and budget).

### 9.3.2 Software Reengineering vs. Refactoring
When a legacy system degrades to the point where maintenance is too expensive, the structure must be improved. There are two distinct approaches to this:

**1. Software Reengineering (Macro-level):**
Reengineering takes place *after* a system has been maintained for a long time and its structure has decayed. The goal is to rebuild the system to make it maintainable again *without* changing its functionality. 
* **The Process:** 1. *Source Code Translation:* Automatically converting an old language (e.g., COBOL) to a modern one (e.g., Java).
    2. *Reverse Engineering:* Analyzing the code to automatically reconstruct missing design documentation.
    3. *Program Structure Improvement:* Untangling messy "spaghetti code".
    4. *Program Modularization:* Grouping related parts of the program together to remove redundancy.
    5. *Data Reengineering:* Cleaning up corrupted databases and redefining schemas.

**2. Refactoring (Micro-level / Preventative):**
Unlike reengineering, which is a massive reactive project, **refactoring is a continuous, preventative process**. 
* *The "How":* As developers add new features (especially in Agile environments), they continuously make small, localized improvements to the code structure (e.g., renaming variables for clarity, breaking a large function into two smaller ones). 
* *The "Why":* Refactoring prevents the structural degradation that eventually necessitates expensive reengineering.

**Mastery Application (Refactoring vs. Reengineering):**
Imagine a house. **Refactoring** is like fixing a leaky pipe and repainting the walls every few years so the house stays in great shape. **Reengineering** is what happens when you ignore the house for 40 years, the foundation starts sinking, and you have to hire a crew to lift the entire house and pour a new concrete foundation?ithout changing the floor plan.