---
title: Chap. 3 HW
order: 2
---

# OS Chap.3 HW

## Q1. What common events lead to the creation of a process?

There are four common events that lead to the creation of a new process by the operating system (OS):

- **New batch job:** The OS is provided with a batch job control stream, typically on a disk or tape. When the OS is prepared to handle new work, it reads the next sequence of job control commands and creates a process for it.
- **Interactive log-on:** A user attempts to log on to the system from a terminal. The OS accepts authorized users up to the system's saturation point and creates a new process for the user session.
- **Created by OS to provide a service:** The OS can autonomously create a process to perform a specific function on behalf of a user program. For example, it might create a background process to control printing so that the user's main application does not have to wait for the printer to finish.
- **Spawned by existing process:** A currently running user program can explicitly dictate the creation of new processes to exploit parallelism or improve modularity. When this happens, the original process is called the _parent process_, and the newly created one is the _child process_.

## Q2. For the five-state processing model, briefly define each state.

The five-state process model categorizes the lifecycle and execution states of a process as follows:

- **Running:** The process that is currently being executed by the processor. In a uniprocessor system, at most one process can be in this state at any given time.
- **Ready:** A process that is prepared and available to execute as soon as the OS dispatcher gives it the opportunity.
- **Blocked (Waiting):** A process that cannot continue execution until some specific external event occurs, such as the completion of an I/O operation or the availability of a requested resource.
- **New:** A process that has just been created by the OS. Its Process Control Block (PCB) has been initialized, but it has not yet been loaded into main memory or admitted to the pool of executable processes.
- **Exit:** A process that has been permanently released from the pool of executable processes by the OS. This occurs either because it halted naturally upon completion or because it was aborted due to an error or parent request.

## Q3. What does it mean to preempt a process?

**Process preemption occurs when an executing process is forcefully interrupted by the processor (usually driven by the OS scheduler) so that another process can be executed**. Instead of waiting for the running process to voluntarily yield control or block on an I/O request, the OS moves the running process directly to the **Ready** state.

Preemption is typically triggered by a clock interrupt when a process exhausts its maximum allowable time slice (quantum) for uninterrupted execution. It can also occur if the OS assigns different priority levels; if a higher-priority process transitions out of the Blocked state into the Ready state, the OS may immediately preempt the currently running lower-priority process to dispatch the higher-priority one.

## Q4. What are the steps performed by an OS to create a new process?

Once the OS decides to create a new process, it proceeds with the following detailed steps:

1. **Assign a unique process identifier:** The OS assigns a unique numeric identifier to the new process and adds a new entry for it into the primary process table.
2. **Allocate space for the process:** The OS allocates the necessary memory for all elements of the process image. This includes the private user address space for the program code and data, the user stack for procedure calls, and the space for the process control block.
3. **Initialize the process control block (PCB):** The OS populates the PCB with the process ID, the parent process ID, and processor state information (setting registers to zero, setting the program counter to the entry point, and defining stack boundaries). It also initializes process control information, such as setting the initial process state to _New_ or _Ready_ and assigning a default priority level.
4. **Set the appropriate linkages:** The new process is placed into the appropriate scheduling queues (e.g., adding it as a linked list node into the _Ready_ or _Ready/Suspend_ queue).
5. **Create or expand other data structures:** The OS establishes any additional data structures needed, such as creating an accounting file to track the process's resource utilization for billing or performance assessment.

## Q5. List reasons why a mode switch between threads may be cheaper than a mode switch between processes.

Switching between threads is generally much faster and cheaper than switching between processes because **less state information must be saved and restored**.

All threads within a single process share the same virtual address space, files, and execution privileges. Therefore, a thread switch avoids the heavy overhead of updating memory management data structures or swapping out address spaces, which is strictly required during a full process switch.

Additionally, if the system uses User-Level Threads (ULTs), **thread switching does not require kernel-mode privileges**. All thread management data structures reside entirely within the user address space of that single process. Because the OS kernel is not involved, the system completely avoids the expensive overhead of performing two mode switches (switching from user mode to kernel mode to process the change, and then back to user mode).

## Q6. Why are all threads blocked when a ULT executes a system call?

This limitation occurs because **the thread structure of a process using ULTs is completely invisible to the operating system**. All of the thread management—such as creating, scheduling, and destroying threads—is done by an application-level threads library.

From the perspective of the OS kernel, it only sees and schedules the single overarching process. Consequently, if one User-Level Thread executes a blocking system call (such as waiting for I/O), the OS kernel assumes the _entire process_ is waiting for that event. The kernel places the entire process into the Blocked state. Because the process is no longer running, the user-level threads library cannot execute, meaning all other threads within that process are simultaneously blocked from running, even if they are otherwise ready to execute.

## Q7. Consider a computer with N processes and M processors.

### a. Maximum number of processes in each state

- **Running:** At most **M** processes can be in the Running state at any given time (assuming $N \ge M$) because there are exactly M processors available to execute instructions. If there are fewer processes than processors ($N < M$), then at most **N** processes can be running. In general terms, the maximum is **$\min(N, M)$** processes.
- **Ready:** At most **N** processes can be in the Ready state. This could happen in a scenario where all N processes have just been admitted or transitioned to Ready, and the OS dispatcher has not yet assigned any of them to the M processors. The maximum number of strictly waiting Ready processes would be **$N - \min(N, M)$**.
- **Blocked:** At most **N** processes can be in the Blocked state simultaneously. This happens if every single process in the system has requested an external event (such as an I/O operation) and is currently waiting for it to complete.

### b. Minimum number of processes in each state

- **Running:** **0** processes. The processors could be completely idle if all N processes are in the Blocked state waiting for I/O operations to complete.
- **Ready:** **0** processes. This occurs if all N processes are currently running (if $N \le M$), or if all non-running processes are in the Blocked state.
- **Blocked:** **0** processes. This occurs if all N processes are either actively running on the CPUs or sitting in the Ready queue waiting for processor time.

## Q8. The queue model suggests that a process can only be in one Event queue at a time.

### a. Can a process wait on more than one event simultaneously?

Yes, it is very possible and common to want an application to wait on multiple events concurrently.

**Example:** An application might be processing data received from one process and then storing the processed results onto a disk. The process may reach a state where it has exhausted its current input and finished its last write. At this point, it needs to wait for **both** additional input data from the other process **and** for the disk to become available to accept a new write.

### b. How to modify the queuing structure?

There are several ways to modify the queuing structure to handle this:

- **Either/Or Queues:** You could implement a special type of "either/or" queue where a process is unblocked if _any_ of its designated events occur.
- **Multiple Queue Assignment:** The process's control block pointer could be placed into two (or more) separate event queues simultaneously.

In either modified design, the operating system's complexity increases. The OS would have to handle the delicate details of alerting the process to the occurrence of both events (potentially one after the other) and ensuring it is safely removed from all other event queues once it is unblocked.

## Q9. Tape Drive Allocation Policy

A multiprocessor with eight processors has 20 attached tape drives. There is a large number of jobs submitted to the system that each require a maximum of four tape drives to complete execution. Assume that each job starts running with only three tape drives for a long period before requiring the fourth tape drive for a short period toward the end of its operation.

### a. Conservative policy (require 4 tape drives upfront)

- **Maximum jobs in progress:** Because the conservative policy requires allocating all 4 drives up front, the system can support at most **5 jobs** concurrently (20 total drives / 4 drives per job = 5 jobs).
- **Maximum idle drives:** Because each job uses only 3 drives for the vast majority of its execution time, 1 drive per job is held but unused. Therefore, the maximum number of idle drives is **5** (5 jobs × 1 idle drive).
- **Minimum idle drives:** The minimum number of idle drives is **0**. This happens in the rare best-case scenario where all 5 active jobs reach the end of their execution at the exact same time and simultaneously utilize their 4th allocated drive.

### b. Alternative policy (allocate on demand)

- **Alternative Policy:** To improve utilization, the OS should initially allocate exactly the **three tape drives** each process needs for its long initial phase. The fourth tape drive is kept in a general pool and is only allocated on demand when a job reaches its final short period.
- **Maximum jobs in progress:** Under this policy, at most **6 jobs** can be active simultaneously (`floor(20/3) = 6`). Giving 3 drives to 6 jobs consumes 18 drives, leaving 2 drives safely in reserve to satisfy the eventual demand for a 4th drive, fully preventing deadlock.
- **Bounds on idling tape drives:** The bounds are a **maximum of 2** idle drives and a **minimum of 0** idle drives. The maximum occurs when all 6 jobs are in their long initial phase (using 18 drives, leaving 2 idle). The minimum occurs if 2 of the 6 jobs enter their final phase simultaneously and claim the 2 reserve drives.
