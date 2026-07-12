---
title: Chap. 4 Note
order: 4
---

# Chapter 4: Threads, SMP, and Microkernels - Review Notes

## 1. Processes and Threads (进程与线程)

In traditional operating systems, the concept of a process embodies two independent characteristics:

- **Resource ownership (资源所有权):** A process includes a virtual address space to hold the process image and is allocated control or ownership of resources such as main memory, I/O channels, I/O devices, and files.
- **Scheduling/execution (调度/执行):** The execution of a process follows an execution path (trace) through one or more programs, and it is the entity that is scheduled and dispatched by the OS.

To distinguish between these two characteristics, the unit of dispatching is usually referred to as a **Thread (线程)** or **Lightweight process (轻量级进程)**, while the unit of resource ownership is referred to as a **Process (进程)** or **Task (任务)**.

### 1.1 Multithreading (多线程)

**Multithreading** refers to the ability of an OS to support multiple, concurrent paths of execution within a single process.

- **In a multithreaded environment:** A process is defined as the unit of resource allocation and a unit of protection. All of the threads of a process share the state and resources of that process.
- **Thread Elements:** Within a process, each thread has an execution state (Running, Ready, etc.), a saved thread context, an execution stack, per-thread static storage for local variables, and access to the shared memory and resources of its process.

**Benefits of Threads (线程的优势):**

1.  It takes far less time to create a new thread in an existing process than to create a brand-new process.
2.  It takes less time to terminate a thread than a process.
3.  It takes less time to switch between two threads within the same process than to switch between processes.
4.  Threads enhance efficiency in communication between different executing programs because threads within the same process share memory and files, allowing them to communicate without invoking the kernel.

**Uses of Threads:**
Threads are useful for foreground and background work, asynchronous processing, speeding up execution via parallel computation, and organizing a modular program structure.

### 1.2 Thread Functionality (线程功能)

The key execution states for a thread are **Running (运行)**, **Ready (就绪)**, and **Blocked (阻塞)**.
There are four basic thread operations associated with a change in thread state:

- **Spawn (派生):** When a new process is spawned, a thread is also spawned. A thread can subsequently spawn another thread within the same process.
- **Block (阻塞):** A thread blocks when it needs to wait for an event, saving its user registers, program counter, and stack pointers.
- **Unblock (解除阻塞):** When the event occurs, the thread is moved to the Ready queue.
- **Finish (结束):** When a thread completes, its register context and stacks are deallocated.

---

## 2. Types of Threads (线程的类型)

There are two broad categories of thread implementation: **User-Level Threads (ULT, 用户级线程)** and **Kernel-Level Threads (KLT, 内核级线程)**.

### 2.1 User-Level Threads (ULT)

In a pure ULT facility, all of the work of thread management is done by the application (using a **threads library (线程库)**), and the kernel is not aware of the existence of threads.

- **Advantages:**
  1. Thread switching does not require kernel-mode privileges, saving the overhead of two mode switches.
  2. Scheduling can be application-specific and tailored to the application's needs.
  3. ULTs can run on any OS because no changes are required to the underlying kernel.
- **Disadvantages:**
  1. When a ULT executes a blocking system call, all of the threads within the entire process are blocked.
  2. A multithreaded application cannot take advantage of multiprocessing since the kernel assigns one process to only one processor at a time.
- **Jacketing (封装/套套):** A technique to overcome blocking threads by converting a blocking system call into a nonblocking application-level I/O jacket routine.

### 2.2 Kernel-Level Threads (KLT)

In a pure KLT facility, all thread management work is done by the kernel, with applications using an API to access the kernel thread facility.

- **Advantages:** The kernel can simultaneously schedule multiple threads from the same process on multiple processors, and blocking one thread does not block the entire process.
- **Disadvantages:** The transfer of control from one thread to another within the same process requires a mode switch to the kernel, incurring much greater latency overhead than ULTs.

### 2.3 Combined Approaches and Other Arrangements

- **Combined Approaches (组合方法):** Thread creation is done entirely in user space, but multiple ULTs from a single application are mapped onto a smaller or equal number of KLTs (e.g., Solaris).
- **Other Relationships:**
  - **M:N (Many-to-Many):** Explored in systems like TRIX where a thread can move from one domain (address space) to another.
  - **1:M (One-to-Many):** A thread can migrate from one process environment to another, such as in distributed operating systems like Clouds (Ra kernel) and Emerald.

---

## 3. Multicore and Multithreading (多核与多线程)

### 3.1 Performance on Multicore

- **Amdahl's Law (阿姆达尔定律):** Defines the potential speedup of a program on multiple processors as `Speedup = 1 / ((1 - f) + f/N)`, where `f` is the infinitely parallelizable fraction. Even a small amount of serial code (e.g., 10%) severely limits the performance gain on multicore architectures.
- **Beneficial Applications:** Database management systems, multithreaded native applications, multiprocess applications, Java applications (running on the multithreaded JVM), and multi-instance applications scale well on multicore systems.

### 3.2 Threading Granularity (线程粒度)

Using Valve's game software as an example, there are three options for threading granularity:

1.  **Coarse threading (粗粒度线程):** Individual modules (e.g., rendering, AI, physics) are assigned to individual processors.
2.  **Fine-grained threading (细粒度线程):** Many similar tasks (e.g., a loop) are spread across multiple processors.
3.  **Hybrid threading (混合线程):** A selective use of fine-grained threading for some systems, and single-threaded for other systems. This approach scales the best.

---

## 4. Windows Process and Thread Management (Windows进程与线程管理)

### 4.1 Process and Thread Objects

- **Windows Process:** Represents an application and contains a virtual address space, executable code, open handles, a security access token, and at least one thread.
- **Windows Thread:** The dispatchable entity within a process that can be scheduled for execution. It maintains exception handlers, a scheduling priority, and a saved context.
- **Job Object (作业对象):** Allows groups of processes to be managed as a unit (e.g., enforcing limits or terminating them together).
- **Thread Pool (线程池):** A collection of worker threads used to efficiently execute asynchronous callbacks.
- **Fiber (纤程):** A unit of execution that must be manually scheduled by the application, running in the context of the thread that scheduled it.
- **User-Mode Scheduling (UMS, 用户模式调度):** A lightweight mechanism that allows applications to switch between UMS threads in user mode without involving the system scheduler.

### 4.2 Thread States (线程状态)

An existing Windows thread is in one of six states:

- **Ready (就绪):** May be scheduled for execution.
- **Standby (备用):** Selected to run next on a particular processor.
- **Running (运行):** Currently executing.
- **Waiting (等待):** Blocked on an event or voluntarily waiting for synchronization.
- **Transition (过渡):** Ready to run, but resources (like paged-out stack) are not currently available.
- **Terminated (终止):** Thread has completed or been killed.

---

## 5. Solaris Thread and SMP Management (Solaris线程与SMP管理)

Solaris employs a multilevel thread architecture utilizing four concepts:

1.  **Process (进程):** The normal UNIX process with an address space.
2.  **User-Level Threads (ULT, 用户级线程):** Invisible to the OS, implemented via a threads library in the user address space.
3.  **Lightweight Processes (LWP, 轻量级进程):** Acts as a mapping between ULTs and kernel threads.
4.  **Kernel Threads (内核线程):** The fundamental entities scheduled and dispatched to system processors.

### 5.1 Interrupts as Threads (作为线程的中断)

Solaris converts hardware interrupts to kernel threads to reduce overhead and simplify synchronization.

- Interrupt threads have their own identifier, priority, context, and stack.
- They use standard mutual exclusion primitives for synchronization and are assigned higher priorities than all other kernel threads.

---

## 6. Linux Process and Thread Management (Linux进程与线程管理)

### 6.1 Linux Tasks and Threads

- **Task (任务):** A process or task in Linux is represented by a `task_struct` data structure. The execution states include **Running (执行/就绪)**, **Interruptible (可中断阻塞)**, **Uninterruptible (不可中断阻塞)**, **Stopped (停止)**, and **Zombie (僵尸)**.
- **Threads in Linux:** Linux does not recognize a strict distinction between threads and processes. User-level threads are mapped into kernel-level processes that share the same group ID.
- **The `clone()` System Call:** A new process is created using the `clone()` command, which allows the cloned process to share resources (like files and virtual memory) with the parent. The traditional `fork()` is just `clone()` with all sharing flags cleared.
