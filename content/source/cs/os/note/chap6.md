---
title: Chap. 6 Note
order: 6
---

# Chapter 6: Concurrency: Deadlock and Starvation - Review Notes

## 1. Principles of Deadlock (死锁的原理)

**Deadlock (死锁)** is defined as the permanent blocking of a set of processes that either compete for system resources or communicate with each other. It occurs when each process in the set is blocked awaiting an event (typically the freeing of a requested resource) that can only be triggered by another blocked process in the same set.

### 1.1 Types of Resources (资源类型)

- **Reusable Resources (可重用资源):** A resource that can be safely used by only one process at a time and is not depleted by that use. Examples include processors, I/O channels, main and secondary memory, files, databases, and semaphores.
- **Consumable Resources (可消耗资源):** A resource that can be created (produced) and destroyed (consumed). There is typically no limit on the number of consumable resources of a particular type. Examples include interrupts, signals, messages, and information in I/O buffers.

### 1.2 Resource Allocation Graphs (资源分配图)

A **Resource Allocation Graph (RAG)** is a directed graph that depicts the state of the system regarding resources and processes.

- **Nodes:** Processes (represented as circles) and Resources (represented as squares with dots inside for each instance).
- **Edges:** A directed edge from a process to a resource indicates a **Request (请求)**; an edge from a resource to a process indicates it is **Held by (被持有/分配给)** that process.
- A circular chain of processes and resources in the graph typically illustrates a deadlock situation.

### 1.3 The Conditions for Deadlock (死锁的条件)

For a deadlock to exist, four conditions must be met:

1.  **Mutual exclusion (互斥):** Only one process may use a resource at a time.
2.  **Hold and wait (占有并等待):** A process may hold allocated resources while awaiting assignment of other resources.
3.  **No preemption (非抢占):** No resource can be forcibly removed from a process holding it.
4.  **Circular wait (循环等待):** A closed chain of processes exists, such that each process holds at least one resource needed by the next process in the chain.
    _(Note: Conditions 1-3 are necessary, but Condition 4 makes them sufficient for a deadlock to actually occur.)_

---

## 2. Deadlock Prevention (死锁预防)

Deadlock prevention involves designing the system to exclude the possibility of deadlock by breaking at least one of the four necessary conditions.

- **Preventing Mutual Exclusion:** Generally cannot be disallowed. If a resource requires exclusive access, the OS must support it.
- **Preventing Hold and Wait:** Require that a process request all of its required resources at one time and block it until all can be granted simultaneously. _Disadvantages:_ Highly inefficient, resources may remain unused for long periods, and modular applications may not know all required resources in advance.
- **Preventing No Preemption:** If a process holding resources is denied a further request, it must release its original resources and request them again later. Alternatively, the OS may preempt a lower-priority process.
- **Preventing Circular Wait:** Define a linear ordering of resource types. A process can only request resources that follow its currently held resources in the ordering. _Disadvantages:_ Can be inefficient and deny resource access unnecessarily.

---

## 3. Deadlock Avoidance (死锁避免)

Unlike prevention, **Deadlock Avoidance** allows the first three necessary conditions but makes dynamic, judicious choices to assure that the deadlock point is never reached. It requires knowledge of future process resource requests.

### 3.1 Process Initiation Denial (进程启动拒绝)

Do not start a process if its total demands, added to the maximum claims of all current processes, might exceed the total resources in the system. It is conservative and assumes all processes will make their maximum claims simultaneously.

### 3.2 Resource Allocation Denial / Banker's Algorithm (资源分配拒绝 / 银行家算法)

Proposed by Dijkstra, this algorithm dynamically checks if granting a request will leave the system in a **Safe state (安全状态)**.

- **Safe state:** A state where there is at least one sequence of resource allocations to processes that allows all processes to run to completion without deadlock.
- **Unsafe state (不安全状态):** A state that is not safe, which has the _potential_ for deadlock.
- **Mechanism:** When a process requests resources, the OS temporarily assumes the request is granted, updates the system state, and checks if the new state is safe. If safe, it grants the request; if unsafe, the process is blocked.
- _Restrictions:_ Maximum requirements must be stated in advance, processes must be independent, and the number of resources must be fixed.

---

## 4. Deadlock Detection and Recovery (死锁检测与恢复)

Deadlock detection strategies do not limit resource access. Instead, the OS periodically executes an algorithm to check for the presence of the circular wait condition.

### 4.1 Deadlock Detection Algorithm (死锁检测算法)

The algorithm marks processes that are _not_ part of a deadlocked set.

1.  Mark processes with no allocated resources.
2.  Initialize a temporary vector `W` with the currently available resources.
3.  Find an unmarked process whose requested resources are less than or equal to `W`. If none exists, terminate.
4.  If found, mark the process, add its currently allocated resources to `W`, and return to step 3.
    If any unmarked processes remain when the algorithm terminates, they are deadlocked.

### 4.2 Recovery Strategies (恢复策略)

Once deadlock is detected, the OS can recover by:

1.  **Abort all deadlocked processes (终止所有死锁进程):** The most common solution.
2.  **Back up to a checkpoint and restart:** Rollback all processes, risking recurring deadlock.
3.  **Successively abort deadlocked processes:** Terminate one by one based on minimum cost until the deadlock is resolved.
4.  **Successively preempt resources:** Preempt resources one by one and rollback the affected processes until resolved.

---

## 5. An Integrated Deadlock Strategy (综合死锁策略)

Instead of relying on a single strategy, systems can group resources into classes and apply the most appropriate technique for each:

- **Swappable space:** Deadlock prevention (hold-and-wait) or avoidance.
- **Process resources (devices, files):** Deadlock avoidance or prevention by resource ordering.
- **Main memory:** Deadlock prevention by preemption (swapping).
- **Internal resources:** Prevention by resource ordering.

---

## 6. The Dining Philosophers Problem (哲学家就餐问题)

A classic synchronization problem illustrating deadlock and starvation issues. Five philosophers sit around a table with a bowl of spaghetti and five forks. A philosopher needs two forks to eat.

- **Solution using Semaphores (使用信号量):** If all pick up their left fork simultaneously, deadlock occurs. A fix is to limit the room to four philosophers at a time, ensuring at least one can get two forks.
- **Solution using a Monitor (使用管程):** Uses condition variables for the forks. A philosopher can only pick up forks if both are available, and because only one process can enter the monitor at a time, deadlock is prevented.

---

## 7. OS Concurrency Mechanisms (操作系统的并发机制)

### 7.1 UNIX

UNIX provides several mechanisms for Interprocess Communication (IPC) and synchronization:

- **Pipes (管道):** A circular buffer allowing two processes to communicate on the producer-consumer model.
- **Messages (消息):** Data exchange via message queues.
- **Shared Memory (共享内存):** Direct memory sharing between processes.
- **Semaphores (信号量):** Usually created in sets. An atomic `semop` system call can perform operations on multiple semaphores simultaneously.
- **Signals (信号):** Software mechanisms informing a process of asynchronous events.

### 7.2 Linux Kernel

- **Atomic Operations (原子操作):** Simple synchronization executing without interruption (e.g., atomic integer or bitmap operations).
- **Spinlocks (自旋锁):** A lock where a waiting thread continuously polls (spins) in a busy-waiting loop. It includes plain spinlocks and **Reader-Writer Spinlocks (读写自旋锁)** (which favor readers).
- **Semaphores:** Includes traditional and reader-writer semaphores.
- **Barriers (屏障):** Enforce the order in which memory access instructions (loads and stores) are executed.

### 7.3 Solaris

- **Mutual Exclusion Locks (互斥锁/Mutex):** Defaults to spinlocks, but can use interrupt-based blocking queues.
- **Semaphores:** Traditional counting semaphores.
- **Reader/Writer Locks:** Allows multiple concurrent readers or a single writer.
- **Condition Variables:** Used with a mutex lock to wait until a particular condition becomes true.

### 7.4 Windows

- **Wait Functions (等待函数):** Allows a thread to block its execution on one or multiple objects (e.g., `WaitForSingleObject`).
- **Dispatcher Objects (调度器对象):** Includes Mutexes, Semaphores, Notification/Synchronization Events, Waitable Timers, Processes, and Threads.
- **Critical Sections (临界区):** Similar to mutexes but can only be used by threads within a _single process_. It uses spinlocks first, then falls back to dispatcher objects if blocked.
- **Slim Reader-Writer (SRW) Locks:** Highly optimized locks for reader-writer scenarios.
- **Condition Variables:** Used with Critical Sections or SRW Locks.
- **Lock-free Synchronization (无锁同步):** Utilizes hardware `Interlocked` operations to perform atomic read-modify-write actions, ensuring threads are never blocked while holding a lock.

### 7.5 Android

- **Interprocess Communication (IPC):** Android extensively uses the **Binder** framework for RPC (Remote Procedure Call). A client proxy marshals transaction data into a parcel, sends it to the Binder via `ioctl`, and the Binder wakes up the server stub to process it.
