---
title: Chap. 2 Note
order: 1
---

# Chapter 2: Operating System Overview

## 1. Operating System Objectives and Functions

**Def**: An Operating System is a program that controls the execution of application programs and acts as an interface between applications and the computer hardware. It has three main objectives:

- **Convenience (方便):** Makes a computer more convenient to use for the end user,.
- **Efficiency (高效):** Allows the computer system resources to be used in an efficient manner,.
- **Ability to evolve (可演进能力):** Permits the effective development, testing, and introduction of new system functions without interfering with service,.

### 1.1 The OS as a User/Computer Interface

The OS masks the details of the hardware from the programmer and provides a convenient interface. It typically provides services in the following areas:

- **Program development:** Provides tools like editors and debuggers (often via utilities).
- **Program execution:** Handles scheduling duties, loads instructions/data into main memory, and initializes files and I/O devices.
- **Access to I/O devices:** Hides specific hardware details and provides a uniform interface for reading and writing.
- **Controlled access to files:** Understands storage media and data structures, and provides protection mechanisms in multi-user environments.
- **System access:** Resolves resource conflicts and protects resources/data from unauthorized access.
- **Error detection and response:** Responds to internal/external hardware errors or software errors with minimal impact on running applications-.
- **Accounting (记账):** Collects usage statistics to tune system performance and bill users.
- It provides an **Application Programming Interface (API, 应用程序编程接口)**, allowing software to be ported easily across systems-.

### 1.2 The OS as Resource Manager

The OS is responsible for controlling the use of a computer's resources (I/O, main/secondary memory, processor execution time).

- Unlike typical control mechanisms, the OS functions as an ordinary computer program executed by the processor.
- It frequently relinquishes control to let the processor perform "useful" work and depends on the processor to regain control.
- The **Kernel (内核)**, or nucleus, contains the most frequently used OS functions and typically remains permanently in main memory,-.

### 1.3 Ease of Evolution

An OS will evolve over time due to hardware upgrades, new types of hardware, new services, and software fixes-. This requires the OS to be modular in construction with clearly defined interfaces.

---

## 2. The Evolution of Operating Systems

### 2.1 Serial Processing (串行处理)

In early computers (late 1940s to mid-1950s), there was no OS; programmers interacted directly with hardware.

- **Scheduling:** Users used a hardcopy sign-up sheet, which often resulted in wasted computer processing time-.
- **Setup time:** A single **job (作业)** involved mounting tapes and setting up card decks manually, causing a considerable waste of time.

### 2.2 Simple Batch Systems (简单批处理系统)

To maximize processor utilization, early batch OSs used a **Monitor (监控程序)**-.

- Users submitted jobs on cards/tape to an operator, who batched them together on an input device for the monitor.
- The monitor automatically loaded the next program after a job was completed, avoiding idle time-.
- **Job Control Language (JCL, 作业控制语言)** was used to provide instructions to the monitor.
- **Hardware Features Required:** Memory protection (内存保护), Timer (定时器), Privileged instructions (特权指令), and Interrupts (中断).
- Execution modes were split into **User mode (用户态)** (with restricted memory and instruction access) and **Kernel mode / System mode (内核态/系统态)** (for the monitor to execute privileged instructions),.

### 2.3 Multiprogrammed Batch Systems (多道批处理系统)

In a simple batch system, the processor is often idle waiting for slow I/O devices.

- **Multiprogramming / Multitasking (多道程序设计/多任务处理):** Expands memory to hold multiple programs; when one job waits for I/O, the processor switches to another job,.
- This relies on hardware supporting I/O interrupts and **Direct Memory Access (DMA, 直接内存访问)**.
- It maximizes processor utilization but requires advanced memory management and scheduling algorithms,.

### 2.4 Time-Sharing Systems (分时系统)

Used to handle multiple interactive jobs by interleaving execution in short bursts or time slices.

- Multiple users simultaneously access the system through terminals.
- While multiprogramming maximizes processor use, time-sharing aims to minimize **Response time (响应时间)**,.
- Examples include the Compatible Time-Sharing System (CTSS).

---

## 3. Major Achievements

### 3.1 The Process (进程)

A **Process (进程)** is defined as a program in execution, an instance of a running program, or a unit of activity characterized by a single sequential thread of execution, a current state, and an associated set of system resources,.

- It consists of three components: an executable program, associated data, and the **Execution context (执行上下文)** (or **Process state (进程状态)**)-,-.
- The execution context includes contents of processor registers and information the OS needs to manage the process, allowing the OS to suspend and resume the process correctly,.
- **Thread (线程):** A single process can be broken up into multiple, concurrent threads that execute cooperatively.

### 3.2 Memory Management (内存管理)

The OS has five principal storage management responsibilities-,:

1.  **Process isolation (进程隔离):** Preventing independent processes from interfering with each other's memory,.
2.  **Automatic allocation and management:** Dynamically allocating memory across the hierarchy transparently to the programmer,.
3.  **Support of modular programming:** Allowing dynamic creation and alteration of program modules,.
4.  **Protection and access control:** Permitting shared memory while protecting the integrity of programs/OS,.
5.  **Long-term storage:** Storing information persistently (e.g., via file systems),.

- **Virtual memory (虚拟内存):** Allows programs to address memory logically without worrying about physical limitations. It maps a **Virtual address (虚拟地址)** to a **Real address / Physical address (实地址/物理地址)** dynamically-,.

### 3.3 Information Protection and Security (信息保护与安全)

Security policies generally target four categories:

1.  **Availability (可用性):** Protecting against interruption.
2.  **Confidentiality (机密性):** Assuring unauthorized users cannot read data.
3.  **Data integrity (数据完整性):** Protecting data from unauthorized modification.
4.  **Authenticity (真实性):** Verifying user identity and message validity.

### 3.4 Scheduling and Resource Management (调度和资源管理)

The OS must schedule process execution and allocate resources based on three factors-:

- **Fairness (公平性):** Giving processes equal and fair access to resources.
- **Differential responsiveness (差异响应性):** Discriminating among different classes of jobs to meet different service requirements dynamically.
- **Efficiency (高效):** Maximizing throughput, minimizing response time, and accommodating the maximum number of users.

---

## 4. Developments Leading to Modern Operating Systems

- **Microkernel architecture (微内核架构):** Assigns only a few essential functions (e.g., address space management, Interprocess Communication (IPC), basic scheduling) to the kernel,. Other services run in user mode, unlike a **Monolithic kernel (单体内核)** where all elements share the same address space,.
- **Multithreading (多线程):** A technique where a process is divided into threads that run concurrently,. A thread is a dispatchable unit of work; a process is a collection of threads and associated resources.
- **Symmetric Multiprocessing (SMP, 对称多处理):** The OS schedules threads across multiple processors, offering advantages in Performance, Availability, Incremental growth, and Scaling-.
- **Distributed Operating Systems (分布式操作系统):** Provides the illusion of a single main and secondary memory space across a cluster of separate computers.
- **Object-oriented design (面向对象设计):** Allows programmers to customize the OS without disrupting system integrity.

---

## 5. Fault Tolerance (容错)

**Fault tolerance (容错)** is the ability of a system to continue normal operations despite the presence of hardware or software faults. This involves redundancy to increase reliability, balancing the costs against the critical nature of the resources.

---

## 6. OS Design Considerations for Multiprocessor and Multicore

### 6.1 SMP OS Considerations

An SMP OS must manage processor and computer resources to provide the illusion of a uniprocessor system. Key design issues include-,:

- Simultaneous concurrent processes or threads,.
- Scheduling,.
- Synchronization,.
- Memory management,.
- Reliability and fault tolerance,.

### 6.2 Multicore OS Considerations

With "many-core" systems, the challenge is extracting parallelism from workloads-.

- **Parallelism within Applications:** Developers divide applications into parallel tasks.
- OS approaches like Apple's **Grand Central Dispatch (GCD)** map tasks onto a pool of available threads.
- Future architectures might drop the distinction between user and kernel mode, treating the OS more like a hypervisor while applications self-manage resources-.
