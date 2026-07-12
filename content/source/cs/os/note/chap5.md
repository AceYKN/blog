---
title: Chap. 5 Note
order: 5
---

# Chapter 5: Concurrency: Mutual Exclusion and Synchronization - Review Notes

## 1. Principles of Concurrency (并发的原理)

Concurrency is fundamental to operating system design and arises in three different contexts: multiple applications (multiprogramming), structured applications, and operating system structure.

### 1.1 Key Terminology (核心术语)

- **Atomic operation (原子操作):** A function or action implemented as a sequence of one or more instructions that appears to be indivisible; no other process can see an intermediate state or interrupt the operation.
- **Critical section (临界区):** A section of code within a process that requires access to shared resources and must not be executed while another process is in a corresponding section of code.
- **Deadlock (死锁):** A situation in which two or more processes are unable to proceed because each is waiting for one of the others to do something.
- **Livelock (活锁):** A situation in which two or more processes continuously change their states in response to changes in the other process(es) without doing any useful work.
- **Mutual exclusion (互斥):** The requirement that when one process is in a critical section that accesses shared resources, no other process may be in a critical section that accesses any of those shared resources.
- **Race condition (竞态条件):** A situation in which multiple threads or processes read and write a shared data item, and the final result depends on the relative timing of their execution.
- **Starvation (饥饿):** A situation in which a runnable process is overlooked indefinitely by the scheduler; although it is able to proceed, it is never chosen.

### 1.2 Process Interaction (进程交互)

Processes interact in three main ways based on their degree of awareness of each other:

1.  **Processes unaware of each other (Competition / 竞争):** These are independent processes that are not intended to work together. The OS must regulate access to shared resources, which can lead to control problems like mutual exclusion, deadlock (with renewable resources), and starvation.
2.  **Processes indirectly aware of each other (Cooperation by sharing / 通过共享合作):** These processes share access to some object, such as an I/O buffer, and exhibit cooperation in sharing. The control problems include mutual exclusion, deadlock, starvation, and the added requirement of data coherence.
3.  **Processes directly aware of each other (Cooperation by communication / 通过通信合作):** These processes communicate by process ID and are designed to work jointly on some activity. The control problems here are deadlock (with consumable resources) and starvation, but mutual exclusion is not required since nothing is explicitly shared.

---

## 2. Requirements for Mutual Exclusion (互斥的要求)

Any facility or capability that provides support for mutual exclusion must meet six requirements:

1.  **Mutual exclusion must be enforced:** Only one process at a time is allowed into its critical section.
2.  A process that halts in its noncritical section must do so without interfering with other processes.
3.  It must not be possible for a process requiring access to a critical section to be delayed indefinitely (i.e., **no deadlock or starvation**).
4.  When no process is in a critical section, any process that requests entry must be permitted to enter without delay.
5.  **No assumptions** are made about relative process speeds or the number of processors.
6.  A process remains inside its critical section for a **finite time only**.

---

## 3. Mutual Exclusion: Software Approaches (互斥的软件方法)

Software approaches rely entirely on the processes coordinating with each other without explicit support from the OS or programming language.

- **Dekker’s Algorithm:** A progressively developed solution for two processes that avoids the pitfalls of strict alternation, deadlock, and livelock.
- **Peterson’s Algorithm:** A simpler, elegant solution for two processes that uses a flag array to indicate intent to enter the critical section and a turn variable to resolve simultaneity conflicts.

---

## 4. Mutual Exclusion: Hardware Support (互斥的硬件支持)

### 4.1 Interrupt Disabling (禁用中断)

In a uniprocessor system, mutual exclusion can be guaranteed by preventing a process from being interrupted. A process can disable interrupts before entering its critical section and enable them after exiting. However, this degrades execution efficiency and does not work in a multiprocessor architecture where multiple processes can execute simultaneously.

### 4.2 Special Machine Instructions (专用机器指令)

Processors offer machine instructions that carry out two actions atomically (in a single instruction fetch cycle).

- **Compare and Swap Instruction (比较并交换指令):** Compares a memory value with a test value, and if they are the same, a new value is written to the memory location.
- **Exchange Instruction (交换指令):** Exchanges the contents of a register with that of a memory location.
- **Properties of Machine-Instruction Approach (优缺点):**
  - _Advantages:_ Applicable to any number of processes on either a single processor or multiple processors sharing memory, simple to verify, and supports multiple critical sections.
  - _Disadvantages:_ Employs **Busy waiting / Spin waiting (忙等待/自旋等待)** which consumes processor time, starvation is possible since process selection is arbitrary, and deadlock is possible if a higher-priority process interrupts a lower-priority one holding the lock.

---

## 5. Semaphores (信号量)

A semaphore is an integer value used for signaling among processes, operated on by only three atomic operations: initialize, decrement (`semWait`), and increment (`semSignal`).

- The `semWait` operation decrements the semaphore value; if the value becomes negative, the executing process is blocked.
- The `semSignal` operation increments the semaphore value; if the resulting value is less than or equal to zero, a blocked process is unblocked.
- **Binary semaphore (二元信号量):** A semaphore that takes on only the values 0 and 1.
- **Mutex (互斥锁):** Similar to a binary semaphore, but the key difference is that the process that locks the mutex must be the one to unlock it.
- **Strong vs. Weak Semaphores (强信号量与弱信号量):** A strong semaphore uses a first-in-first-out (FIFO) policy to unblock processes, guaranteeing freedom from starvation. A weak semaphore does not specify the order in which processes are removed from the queue.

---

## 6. Monitors (管程)

A monitor is a programming language construct that encapsulates variables, access procedures, and initialization code within an abstract data type. It provides equivalent functionality to semaphores but is easier to control.

- Local data variables are accessible only by the monitor's procedures.
- Only one process may be executing in the monitor at a time, inherently enforcing mutual exclusion.
- **Condition variables (条件变量):** Used to synchronize processes within the monitor; operated on by `cwait` (suspends the calling process) and `csignal` (resumes a blocked process).
- **Hoare Monitor vs. Mesa Monitor (两种管程模型):**
  - _Hoare Monitor:_ Requires that when a process issues a signal, the waiting process immediately runs, meaning the signaling process must exit or block.
  - _Mesa Monitor (Lampson/Redell):_ Uses a `cnotify` primitive instead of a signal, allowing the signaling process to continue executing. The waiting process is placed on a ready queue and must recheck the condition using a `while` loop when it resumes. It is less prone to error and supports a `cbroadcast` primitive to wake all waiting processes.

---

## 7. Message Passing (消息传递)

Message passing provides a means for processes to exchange information and perform synchronization, typically utilizing `send` and `receive` primitives.

- **Synchronization (同步):** Both sender and receiver can be blocking or nonblocking.
  - _Blocking send, blocking receive:_ A rendezvous allowing tight synchronization.
  - _Nonblocking send, blocking receive:_ The most useful combination, often used for server processes providing services.
  - _Nonblocking send, nonblocking receive:_ Neither party is required to wait.
- **Addressing (寻址):**
  - _Direct addressing (直接寻址):_ The `send` primitive includes a specific identifier of the destination process.
  - _Indirect addressing (间接寻址):_ Messages are sent to a shared data structure consisting of queues, generally referred to as **mailboxes (信箱)** or **ports (端口)**. This allows for one-to-one, many-to-one, one-to-many, or many-to-many relationships.
- **Message Format (消息格式):** Generally divided into a header (containing source, destination, length, type, and control info) and a body (the actual contents).

---

## 8. Classic Concurrency Problems (经典并发问题)

### 8.1 The Producer/Consumer Problem (生产者/消费者问题)

- **Definition:** One or more producers generate data and place it in a buffer, while a single consumer takes items out of the buffer one at a time.
- **Constraints:** The system must prevent overlap of buffer operations, ensure the producer does not add to a full buffer, and ensure the consumer does not remove data from an empty buffer.
- Can be solved using semaphores, monitors, or message passing.

### 8.2 The Readers/Writers Problem (读者/写者问题)

- **Definition:** A data area is shared among multiple processes. Readers only read the data area, and writers only write to it.
- **Constraints:** Any number of readers may simultaneously read the file; only one writer at a time may write to the file; if a writer is writing, no reader may read it.
- **Priority Strategies:**
  - _Readers Have Priority:_ Writers are subject to starvation as long as at least one reader is continuously reading.
  - _Writers Have Priority:_ Guarantees no new readers are allowed access once a writer has declared a desire to write.
