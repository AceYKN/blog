---
title: Chap. 2 HW
order: 1
---

# OS Chap.2 HW

## Q1. Definition, Objectives, Functions, and Features of the Operating System

- **Definition:** An operating system (OS) is a program that controls the execution of application programs and acts as an interface between applications and the computer hardware.
- **Objectives:** The three main objectives of an OS are **convenience** (making the computer easier to use), **efficiency** (allowing the computer's resources to be used in an efficient manner), and **ability to evolve** (permitting the development and introduction of new system functions without interfering with existing services).
- **Functions:**
  - **User/Computer Interface:** The OS masks hardware details and provides services for program development, program execution, uniform access to I/O devices, controlled access to files, system access (protection and conflict resolution), error detection/response, and accounting.
  - **Resource Manager:** The OS is responsible for managing the computer's resources, including allocating main memory, determining which I/O devices can be used by executing programs, and deciding how much processor time is devoted to specific user programs.
- **Features:** Modern OS features include instruction set architectures, application programming interfaces (APIs), dual-mode execution (user mode vs. kernel mode) to protect memory and prevent unauthorized use of privileged instructions, and interrupt/trap handling to switch execution contexts.

## Q2. Main Features of Different OS Types

- **Batch Processing OS:** The central feature is a software program called a **monitor**. Users submit jobs offline, which are batched together sequentially and handled by the monitor. The monitor automatically loads and executes the next program in the batch once the current one finishes. _Multiprogrammed batch systems_ enhance this by keeping multiple jobs in memory simultaneously; when one job waits for I/O, the processor switches to another job, highly improving efficiency and CPU utilization.
- **Time-Sharing OS:** Designed to handle multiple interactive jobs simultaneously. The OS uses **multiprogramming and time slicing** (allocating a short burst or "quantum" of computation to each process) so that multiple users can access the system through terminals concurrently. Its principal objective is to **minimize response time** rather than strictly maximizing processor use.
- **Real-Time OS:** Designed for applications where correctness depends not just on logical results, but on the **time at which the results are produced**. Features include **determinism** (performing operations at fixed times), fast **responsiveness** to external interrupts, extensive **user control** over task priorities, strict preemptive scheduling for meeting deadlines (hard vs. soft tasks), and **fail-soft operation** (the ability to fail in a way that preserves maximum capability).
- **Distributed OS:** Operates across a cluster of separate computers (multicomputer system) but provides the **illusion of a single main memory space and secondary memory space**, along with unified access facilities like a distributed file system.

## Q3. User Behavior and Core Mindset

The provided sources focus heavily on the technical and architectural internals of operating systems rather than the psychological or behavioral analysis of users. However, the sources do note that in interactive systems (like time-sharing), human reaction time is "relatively slow," allowing many users to share a system without noticeable interference. Furthermore, users expect **predictability** (variations in response time are distracting) and rely on the OS to provide a **convenient interface** that abstracts away complex hardware details.

_(Note: A deep psychological or behavioral analysis of the "core mindset" falls outside the scope of the provided sources and would require independent verification)._

## Q4. CPU Time Spent on Clock Interrupts

_(Note: The following calculation uses the system parameters you provided, which require external mathematical application not explicitly found in the sources)._

- **Time per interrupt sequence:** 1ms (handle interrupt) + 2ms (process scheduling) + 1ms (allocate CPU) = **4ms total per clock interrupt.**
- **Total interrupts per second:** 100.
- **Total time spent per second:** 100 interrupts × 4ms = 400ms.
- **Percentage of CPU time:** 400ms out of 1000ms (1 second) = **40% of the CPU's time**.

## Q5. Increase in CPU Utilization with Added Memory

_(Note: This uses the standard probabilistic CPU utilization formula $1 - p^N$ where $p$ is the I/O wait probability and $N$ is the number of processes. This specific formula and problem are not derived from the text)._

- **Initial State:**
  - Available memory = 1MB (1024KB).
  - User space = 1024KB - 200KB (OS) = 824KB.
  - Number of processes ($N$) = $824 / 200 = 4$ complete processes.
  - CPU Utilization = $1 - 0.80^4 = 1 - 0.4096 = 0.5904$ (**59.04%**).
- **After adding 1MB (Total 2MB / 2048KB):**
  - User space = 2048KB - 200KB (OS) = 1848KB.
  - Number of processes ($N$) = $1848 / 200 = 9$ complete processes.
  - New CPU Utilization = $1 - 0.80^9 = 1 - 0.1342 = 0.8658$ (**86.58%**).
- **Increase:** 86.58% - 59.04% = **27.54% increase in CPU utilization.**

## Q6. Concurrent Execution Trajectory

_(Note: This requires logical modeling of a timeline which is an external exercise not explicitly contained in the provided source material)._

### (1) Working Situation (Timeline) of the Two Programs

Assuming a uniprocessor system with non-preemptive CPU execution (unless blocked by I/O), the trajectory unfolds as follows:

- **0 ms - 50 ms:** CPU executes Program A (Calculate: 50ms).
- **50 ms - 100 ms:** Program A starts Printing (100ms duration, ends at 150ms). CPU is handed to Program B. CPU executes Program B (Calculate: 50ms).
- **100 ms - 150 ms:** Program B finishes calculation and starts Input (80ms duration, ends at 180ms). _Both programs are now performing I/O. The CPU is idle._
- **150 ms - 200 ms:** Program A finishes Printing and reclaims the CPU. CPU executes Program A (Calculate: 50ms). (Note: At 180ms, Program B finishes Input and becomes ready, but must wait for the CPU).
- **200 ms - 300 ms:** Program A finishes calculating and starts its second Print (100ms duration, ends at 300ms). The CPU is handed back to Program B. CPU executes Program B (Calculate: 100ms).
- **300 ms:** Both Program A and Program B finish their final operations simultaneously and terminate.

### (2) CPU Idle Waiting Time

**Yes**, the CPU does have idle waiting time. The CPU is completely idle from **100 ms to 150 ms** (a duration of 50 ms) because Program A is busy using the printer and Program B is busy using the input machine.
