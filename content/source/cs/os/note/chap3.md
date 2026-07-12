---
title: Chap. 3 Note
order: 2
---

# Chapter 3: Process Description and Control

## 1. The Concept of Process (进程的概念)

The design of a multiprogramming operating system is built around the concept of the process. The OS must interleave the execution of multiple processes to maximize processor utilization, allocate resources avoiding deadlock, and support interprocess communication and user creation of processes.

A **Process (进程)** can be defined as a program in execution, an instance of a running program, the entity assigned to a processor, or a unit of activity characterized by a single sequential thread of execution, a current state, and an associated set of system resources.

### 1.1 Process Elements (进程的组成)

While a program is executing, the executing entity is called a process, which consists of two essential elements: **Program code (程序代码)** and a **Set of data (数据集)** associated with that code. It is uniquely characterized by elements including:

- **Identifier (标识符)**
- **State (状态)**
- **Priority (优先级)**
- **Program counter (程序计数器)**
- **Memory pointers (内存指针)**
- **Context data (上下文数据)**
- **I/O status information (I/O状态信息)**
- **Accounting information (记账信息)**

### 1.2 Process Control Block (PCB, 进程控制块)

The OS creates and manages a data structure called the **Process Control Block (PCB)**, which contains all the process elements mentioned above. It is the most important data structure in the OS because it allows the OS to interrupt a running process and later resume it exactly as if the interruption had not occurred.

---

## 2. Process States (进程的状态)

To understand process states, we first define two terms:

- **Trace (轨迹):** The behavior of an individual process characterized by the sequence of instructions that execute for that process.
- **Dispatcher (调度器):** A small OS program that switches the processor from one process to another.

### 2.1 Two-State Process Model (两态进程模型)

The simplest model defines two states:

- **Running (运行态):** The process is currently being executed.
- **Not Running (非运行态):** The process is waiting for an opportunity to execute.
  Processes in the "Not Running" state are typically kept in a queue waiting their turn to be dispatched.

### 2.2 Five-State Process Model (五态进程模型)

To handle processes that are waiting for I/O or events, the "Not Running" state is split, leading to the five-state model:

1.  **Running (运行态):** The process is currently executing.
2.  **Ready (就绪态):** The process is prepared to execute when given the opportunity.
3.  **Blocked / Waiting (阻塞态/等待态):** The process cannot execute until some event occurs (e.g., I/O completion).
4.  **New (新建态):** A process just created but not yet admitted to the pool of executable processes by the OS.
5.  **Exit (退出态):** A process released from the executable pool because it halted or aborted.

### 2.3 Suspended Processes (挂起进程)

If all processes in main memory are blocked, the processor becomes idle. To solve this, the OS uses **Swapping (交换)** to move part or all of a process from main memory to disk, creating a **Suspend queue (挂起队列)**. This introduces two new states:

- **Blocked/Suspend (阻塞/挂起):** The process is in secondary memory and awaiting an event.
- **Ready/Suspend (就绪/挂起):** The process is in secondary memory but is available for execution as soon as it is loaded into main memory.

**Characteristics of a Suspended Process:** It is not immediately available for execution, may or may not be waiting on an event, was placed in this state by an agent (itself, parent, or OS), and cannot be removed until explicitly ordered. Reasons for suspension include swapping, interactive user requests, timing, or parent process requests.

---

## 3. Process Creation and Termination (进程的创建与终止)

### 3.1 Process Creation (进程创建)

Reasons for creating a process include: new batch jobs, interactive logons, created by the OS to provide a service, or **Process Spawning (进程派生)**.

- **Process Spawning:** When the OS creates a process at the explicit request of another process.
- The original process is the **Parent process (父进程)**, and the newly created one is the **Child process (子进程)**.

### 3.2 Process Termination (进程终止)

A process terminates when it reaches a normal completion, time limit exceeded, memory unavailable, bounds violation, protection error, arithmetic error, I/O failure, invalid instruction, or parent termination.

---

## 4. Process Description and Control Structures (进程描述与控制结构)

The OS manages system resources by maintaining four types of control tables: **Memory tables**, **I/O tables**, **File tables**, and **Process tables**.

### 4.1 Process Image (进程映像)

The collection of program, data, stack, and attributes is referred to as the **Process Image (进程映像)**. It typically includes:

- **User Data:** Modifiable part of user space.
- **User Program:** Program to be executed.
- **System Stack:** Used for procedure calls and parameter passing.
- **Process Control Block (PCB):** Information needed by the OS to control the process.

### 4.2 Elements of the Process Control Block

The PCB information falls into three categories:

1.  **Process Identification (进程标识):** Numeric identifiers for the process, its parent, and the user.
2.  **Processor State Information (处理器状态信息):** User-visible registers, control and status registers (e.g., the **Program Status Word / PSW (程序状态字)**), and stack pointers.
3.  **Process Control Information (进程控制信息):** Scheduling and state information, data structuring (pointers to queues), IPC flags, process privileges, memory management pointers, and resource ownership.

---

## 5. Process Control (进程控制)

### 5.1 Modes of Execution (执行模式)

To protect OS tables and resources, processors support at least two execution modes:

- **User Mode (用户态):** A less-privileged mode where user programs typically execute.
- **System Mode / Kernel Mode / Control Mode (系统态/内核态/控制态):** A more-privileged mode where the OS kernel executes, granting complete control of the processor and memory.

### 5.2 Steps of Process Creation (进程创建的步骤)

When the OS creates a new process, it typically:

1.  Assigns a unique process identifier.
2.  Allocates memory space for the process image.
3.  Initializes the Process Control Block (PCB).
4.  Sets the appropriate linkages (e.g., inserts it into the Ready queue).
5.  Creates or expands other data structures (e.g., accounting files).

### 5.3 Process Switching (进程切换)

A process switch occurs when the OS gains control from the currently running process. The mechanisms triggering this are:

- **Interrupt (中断):** External to the current instruction (e.g., Clock interrupt/time slice expiration, I/O interrupt, Memory fault).
- **Trap (陷阱):** An error or exception generated within the current process.
- **Supervisor Call (系统调用):** Explicit request to an OS function by the user program.

**Mode Switch vs. Process Switch (模式切换与进程切换):**
A mode switch (user to kernel) does not necessarily change the state of the running process and has low overhead. A **Full Process Switch** is much heavier and requires:

1. Saving the context of the processor.
2. Updating the PCB of the currently running process.
3. Moving the PCB to the appropriate queue (Ready, Blocked, etc.).
4. Selecting another process for execution.
5. Updating the PCB of the selected process.
6. Updating memory management data structures.
7. Restoring the context of the newly selected process.
