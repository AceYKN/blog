---
title: Chap. 4
order: 4
---

# Chapter 4 - Threads, SMP, and Microkernels

## 一、 True / False Questions (判断题)

**1. The basic unit of dispatching in an operating system is usually referred to as a thread or lightweight process.**
*   **中文翻译**：操作系统中的基本调度单位通常被称为线程（thread）或轻量级进程（lightweight process）。
*   **答案**：**True (正确)**
*   **知识点讲解**：在现代操作系统中，**进程（Process）**是资源分配和保护的基本单位，而**线程（Thread）**或轻量级进程是 CPU 调度和执行的基本单位。一个进程可以包含一个或多个线程。

**2. An example of a system that implements a single process with multiple threads is MS-DOS.**
*   **中文翻译**：实现单进程多线程的系统的一个例子是 MS-DOS。
*   **答案**：**False (错误)**
*   **知识点讲解**：MS-DOS 是典型的**单进程单线程**（Single process, single thread）操作系统。**Java 运行时环境（JVM）**才是单进程多线程（Single process, multiple threads）的典型代表。

**3. In a multithreaded environment, a process is defined as the unit of resource allocation and a unit of protection.**
*   **中文翻译**：在多线程环境中，进程被定义为资源分配单位和保护单位。
*   **答案**：**True (正确)**
*   **知识点讲解**：多线程模型将进程的两个核心属性分开了。进程依然拥有独立的虚拟地址空间、文件句柄和其他系统资源，并负责资源隔离与保护；而线程只拥有执行所必需的最小状态（如程序计数器、栈、寄存器上下文）。

**4. The concept of thread synchronization is required in multithreaded systems because threads of a single process share the process's process control block (PCB).**
*   **中文翻译**：多线程系统需要线程同步的概念，因为单个进程的线程共享该进程的进程控制块 (PCB)。
*   **答案**：**False (错误)**
*   **知识点讲解**：线程需要同步的根本原因**不是**共享 PCB，而是因为它们**共享该进程的内存地址空间（Address Space）和全局变量等资源**。并发访问共享内存中的数据会导致竞争条件，因此需要互斥和同步机制。每个线程实际上有自己的线程控制块（TCB）。

**5. In a pure User-Level Thread (ULT) facility, all of the work of thread management is done by the application, but the kernel is aware of the existence of threads.**
*   **中文翻译**：在纯用户级线程 (ULT) 机制中，所有线程管理工作都由应用程序完成，但内核知道线程的存在。
*   **答案**：**False (错误)**
*   **知识点讲解**：在纯用户级线程 (ULT) 模型中，线程管理完全由用户空间的线程库（Thread Library）负责，**内核对 ULT 一无所知（The kernel is unaware of the existence of threads）**。内核依然把该应用程序当成一个单线程的普通进程进行调度。

**6. In the field of distributed operating system design, the One-to-Many (Thread-to-Process) relationship is particularly interesting because it involves the concept of thread migration.**
*   **中文翻译**：在分布式操作系统设计领域，一对多（线程对进程）关系特别有趣，因为它涉及线程迁移（thread migration）的概念。
*   **答案**：**True (正确)**
*   **知识点讲解**：在“一对多”模型（如 Ra 操作系统）中，一个逻辑线程可以跨越多个进程甚至多台机器的边界。这种机制允许一个线程在不同节点的地址空间中移动执行，这就是线程迁移。

**7. One disadvantage to the master/slave shared-memory multiprocessor architecture is that the failure of the master brings down the whole system.**
*   **中文翻译**：主/从（master/slave）共享内存多处理器架构的一个缺点是，主处理器的故障会导致整个系统崩溃。
*   **答案**：**True (正确)**
*   **知识点讲解**：在主从架构中，主处理器（Master）负责所有的内核功能、调度和 I/O 管理，从处理器（Slaves）仅执行用户程序。如果 Master 宕机，整个系统将失去核心管理能力，从而全面崩溃，存在单点故障（Single Point of Failure）。

**8. In a symmetric multiprocessing (SMP) system, each processor has access only to a private main memory area.**
*   **中文翻译**：在对称多处理 (SMP) 系统中，每个处理器只能访问私有的主存区域。
*   **答案**：**False (错误)**
*   **知识点讲解**：SMP 架构的核心特征之一就是**共享主存（Shared Memory）**。所有的处理器不仅有均等的地位，还可以通过同一个系统总线或互连网络访问同一个全局主存空间（以及共享的 I/O 设备）。

**9. An SMP O/S manages processor and other resources so that the user may view the system in the same fashion as a multiprogramming uniprocessor system.**
*   **中文翻译**：SMP 操作系统管理处理器和其他资源，以便用户可以像查看多道程序单处理器系统一样查看该系统。
*   **答案**：**True (正确)**
*   **知识点讲解**：SMP 操作系统必须对用户提供透明性。底层的多处理器对用户程序是隐藏的，程序员和用户感觉就像在使用一个速度更快的单处理器系统，不需要修改应用程序代码。

**10. The primary advantage of the basic microkernel design over layered kernel designs involves increased performance.**
*   **中文翻译**：与分层内核设计相比，基本微内核设计的主要优势在于提高了性能。
*   **答案**：**False (错误)**
*   **知识点讲解**：微内核（Microkernel）的**主要缺点恰恰是性能开销大**。由于大多数系统服务被移到了用户空间，服务请求需要通过内核的进程间通信（IPC，通常是消息传递）来进行，导致频繁的上下文切换和模式切换。微内核的优势在于**扩展性、灵活性、可移植性和可靠性**，而非性能。

**11. The philosophy underlying the microkernel is that only absolutely essential core operating system functions should be in the kernel.**
*   **中文翻译**：微内核的基础哲学是，内核中只应包含绝对必要的操作系统核心功能。
*   **答案**：**True (正确)**
*   **知识点讲解**：微内核设计将文件系统、设备驱动、网络协议栈等功能移出内核空间，内核仅保留最基本的功能，如地址空间管理、进程间通信（IPC）和基本的调度。

**12. The basic form of communication between processes or threads in a microkernel O/S is messages.**
*   **中文翻译**：在微内核操作系统中，进程或线程之间基本的通信形式是消息（messages）。
*   **答案**：**True (正确)**
*   **知识点讲解**：在微内核中，由于各个系统服务作为独立的用户级服务器运行，它们之间以及它们与客户端程序之间的通信必须依赖于底层的消息传递机制（Message Passing IPC）。

**13. Linux makes no distinction between a process and a thread.**
*   **中文翻译**：Linux 对进程和线程不作区分。
*   **答案**：**True (正确)**
*   **知识点讲解**：在 Linux 内核层面，没有传统意义上独立的“线程”数据结构。它将进程和线程统称为**任务（Task）**，都使用 `task_struct` 结构来表示。线程只是被视作与其他任务共享某些资源（如虚拟内存、打开的文件）的进程（通常通过 `clone()` 系统调用创建）。

**14. Windows 2000 is an object-oriented O/S, but only processes (not threads) are implemented as objects in the WIN2K O/S.**
*   **中文翻译**：Windows 2000 是一个面向对象的操作系统，但在 WIN2K OS 中只有进程（而非线程）被实现为对象。
*   **答案**：**False (错误)**
*   **知识点讲解**：Windows (从 NT/2000 起) 高度依赖对象架构。不仅进程是对象（Process Object），**线程本身也是被内核管理的对象（Thread Object）**。

**15. In the Solaris O/S, a User-Level Thread (ULT) in the active state is assigned to a Light-Weight Process (LWP) and executes while the underlying kernel thread executes.**
*   **中文翻译**：在 Solaris 操作系统中，处于活动状态的用户级线程 (ULT) 被分配给轻量级进程 (LWP)，并在底层内核线程执行时执行。
*   **答案**：**True (正确)**
*   **知识点讲解**：Solaris 采用经典的**多对多（M:N）模型**。应用程序创建许多 ULT，而操作系统维护一组 LWP（每个 LWP 映射到一个真正的 Kernel Thread）。活跃的 ULT 会被复用绑定（绑定执行）到某个 LWP 上从而获得 CPU 时间。

---

## 二、 Multiple Choice Questions (单选题)

**1. The concept of a process in an operating system embodies two primary characteristics, one of which is:**
a. Multithreading
b. Resource ownership
c. Symmetric multiprocessing
d. None of the above
*   **中文翻译**：操作系统中的进程概念体现了两个主要特征，其中之一是：
    a. 多线程
    b. 资源所有权 (Resource ownership)
    c. 对称多处理
    d. 以上都不是
*   **答案**：**b. Resource ownership**
*   **知识点讲解**：传统的进程概念包含两个核心独立特征：一是**资源所有权 (Resource ownership)**，二是**调度/执行 (Scheduling/Execution)**。多线程技术就是把这两者分离，进程拥有资源，线程负责执行。

**2. An example of a system that implements a single process with multiple threads is:**
a. WIN 2000
b. Solaris
c. Java
d. All of the above
*   **中文翻译**：实现单进程多线程的系统的一个例子是：
    a. Windows 2000 (支持多进程多线程)
    b. Solaris (支持多进程多线程)
    c. Java (运行时环境是单进程多线程)
    d. 以上都是
*   **答案**：**c. Java**
*   **知识点讲解**：早期的系统分类中，MS-DOS 是 1:1（单进程单线程）；传统的 UNIX 是 N:1（多进程单线程）；Java 运行环境（JVM 本身运行为一个进程）内部支持多个执行流，体现了 1:N（单进程多线程）的概念；现代 OS (Win/Solaris/Linux) 则是 N:M（多进程多线程）。

**3. Which of the following is true regarding the relationship between processes and threads:**
a. It takes far less time to create a new thread in an existing process than to create a new process
b. It takes less time to terminate a process than a thread
c. It takes less time to switch between two different processes than to switch between two threads within the same process
d. All of the above
*   **中文翻译**：关于进程和线程之间的关系，以下哪项是正确的：
    a. 在现有进程中创建新线程比创建新进程花费的时间要少得多。
    b. 终止进程比终止线程花费的时间少。（错误，线程轻量）
    c. 在两个不同进程之间切换的时间比在同一进程的两个线程之间切换的时间少。（错误，进程上下文切换重于线程）
    d. 以上都是
*   **答案**：**a. It takes far less time to create a new thread in an existing process than to create a new process**
*   **知识点讲解**：线程是轻量级的。由于线程共享了地址空间和系统资源，创建线程无需复制页表、分配大块内存等，因此创建、终止、切换线程的开销都远**低于**进程。

**4. The basic thread operation related to the change in thread state that occurs when a thread needs to wait for an event is referred to as the:**
a. Unblock operation
b. Spawn operation
c. Block operation
d. None of the above
*   **中文翻译**：当线程需要等待某个事件时发生的状态更改相关的基本线程操作被称为：
*   **答案**：**c. Block operation**
*   **知识点讲解**：线程与进程类似，有基本的生命周期操作。等待事件（如 I/O 或锁）时，会执行 **阻塞 (Block)** 操作；当事件发生时，会执行 **解除阻塞 (Unblock)** 操作；派生新线程称为 **产生 (Spawn)**。

**5. One of the disadvantages of User-Level Threads (ULTs) compared to Kernel-Level Threads (KLTs) is:**
a. Scheduling is application specific
b. When a ULT executes a system call, all threads in the process are blocked
c. Thread switching does not require kernel mode privileges
d. All of the above
*   **中文翻译**：与内核级线程 (KLT) 相比，用户级线程 (ULT) 的缺点之一是：
    a. 调度是特定于应用程序的（这是优点）
    b. 当一个 ULT 执行系统调用时，进程中的所有线程都会被阻塞（致命缺点）
    c. 线程切换不需要内核模式权限（这是优点）
    d. 以上都是
*   **答案**：**b. When a ULT executes a system call, all threads in the process are blocked**
*   **知识点讲解**：ULT 对内核不可见，内核只知道包含这些线程的整个进程。因此，如果进程中的某一个 ULT 发起了阻塞式的系统调用（如读取文件），内核就会阻塞整个进程，导致进程内的其他 ULT 全部停滞，无法利用多处理器的并发优势。

**6. In the Linux O/S, multiple threads may be created and executed within a single process. This is an example of the following Thread-to-Process relationship:**
a. 1:1
b. 1:M
c. M:N
d. None of the above
*   **中文翻译**：在 Linux 操作系统中，可以在单个进程内创建和执行多个线程。这是以下哪种线程与进程关系的示例：
*   **答案**：**a. 1:1**
*   **知识点讲解**：在 Linux 的设计中（通过 NPTL，Native POSIX Thread Library），实现了 **1:1（One-to-One）模型**。每一个用户空间的线程都直接对应一个内核空间的 `task_struct`（即内核可调度的独立实体）。

**7. The computer system category where a single processor executes a single instruction stream to operate on data stored in a single memory is called:**
a. Single Instruction Single Data (SISD) stream
b. Single Instruction Multiple Data (SIMD) stream
c. Multiple Instruction Single Data (MISD) stream
d. None of the above
*   **中文翻译**：单处理器执行单条指令流来操作存储在单一内存中的数据的计算机系统类别被称为：
*   **答案**：**a. Single Instruction Single Data (SISD) stream**
*   **知识点讲解**：这是弗林分类法（Flynn's Taxonomy）中最传统的单机架构：单指令流、单数据流 (SISD)。常见的桌面单核 CPU 即属于此类。

**8. In a SMP system, each processor maintains a local cache and must alert all other processors that a change to cache update has taken place. This is referred to as the:**
a. Interconnection mechanism problem
b. Synchronization mechanism problem
c. Cache coherency problem
d. None of the above
*   **中文翻译**：在 SMP 系统中，每个处理器维护一个本地缓存，并且必须向所有其他处理器发出警报，表明缓存更新已发生更改。这被称为：
*   **答案**：**c. Cache coherency problem**
*   **知识点讲解**：这是多处理器系统中经典的**缓存一致性问题（Cache Coherency Problem）**。由于内存数据可能缓存在多个处理器的私有 L1/L2 缓存中，如果一个处理器修改了数据，必须通过总线嗅探（Snooping）或目录协议等机制让其他处理器的缓存失效或更新，以防止读取脏数据。

**9. Key issues involved in the design of multiprocessor operating systems include:**
a. Scheduling
b. Synchronization
c. Reliability and fault tolerance
d. All of the above
*   **中文翻译**：多处理器操作系统设计中涉及的关键问题包括：
*   **答案**：**d. All of the above**
*   **知识点讲解**：SMP 操作系统要比单核复杂得多。必须处理好进程/线程分配到哪个 CPU (**Scheduling**)、并发访问内核资源的锁冲突 (**Synchronization**) 以及某个 CPU 宕机不影响整体系统的容错机制 (**Reliability and fault tolerance**)。

**10. Early operating systems that were designed with little concern about structure are typically referred to as:**
a. Monolithic operating systems
b. Layered operating systems
c. Kernel operating systems
d. All of the above
*   **中文翻译**：早期设计时很少考虑结构的操作系统通常被称为：
*   **答案**：**a. Monolithic operating systems**
*   **知识点讲解**：早期的操作系统功能混杂在一起，全部代码运行在内核态，缺乏清晰的模块化边界，这种庞大且无明确结构的系统被称为**单体内核（Monolithic kernel / OS）**。

**11. A benefit of the microkernel organization is:**
a. Extensibility
b. Portability
c. Flexibility
d. All of the above
*   **中文翻译**：微内核组织的优点是：
*   **答案**：**d. All of the above**
*   **知识点讲解**：微内核的主要优点：**可扩展性 (Extensibility)** 方便增加新功能（只需新增用户态服务器）；**可移植性 (Portability)** 因为硬件相关代码最小化；**灵活性 (Flexibility)** 允许根据需求裁剪系统组件。

**12. In low-level microkernel memory management, an example of an operation that can support external paging and virtual memory management is the:**
a. Grant operation
b. Map operation
c. Flush operation
d. All of the above
*   **中文翻译**：在底层的微内核内存管理中，能够支持外部调页和虚拟内存管理的内存操作例子是：
*   **答案**：**d. All of the above**
*   **知识点讲解**：以著名的 Mach 微内核为例，它为了让用户空间程序接管复杂的虚拟内存管理，提供了三条基本的底层原语：**Grant (授权)** 允许传递页框使用权；**Map (映射)** 允许共享页框；**Flush (刷新)** 允许回收页框。

**13. In a W2K system, the state that a thread enters when it has been unblocked and the resource for which it has been blocked is not yet available is called the:**
a. Transition state
b. Waiting state
c. Standby state
d. None of the above
*   **中文翻译**：在 Windows 2000 系统中，当线程被解除阻塞但其所需资源（通常指内存）尚不可用时，它进入的状态被称为：
*   **答案**：**a. Transition state**
*   **知识点讲解**：在 Windows 线程状态机中，当线程从阻塞（Wait）中被唤醒准备执行，但它的内核栈被换出到磁盘（Page Out）还没载入物理内存时，它会处于一种短暂的 **转换状态 (Transition)**，待内存加载完毕后才转入就绪态 (Ready)。

**14. In a Solaris system, a User-Level Thread (ULT) that enters the active state is assigned to a:**
a. Kernel thread
b. Heavy-Weight Process (HWP)
c. Light-Weight Process (LWP)
d. None of the above
*   **中文翻译**：在 Solaris 系统中，进入活动状态的用户级线程 (ULT) 被分配给：
*   **答案**：**c. Light-Weight Process (LWP)**
*   **知识点讲解**：在 Solaris M:N 模型中，ULT 不直接与底层 Kernel Thread 交互，它们被复用和调度到中间层的 **轻量级进程 (LWP)** 上执行。

**15. In a Linux system, when a new process is cloned, the two processes share the same:**
a. Process identifier
b. Virtual memory
c. task_struct data structure
d. All of the above
*   **中文翻译**：在 Linux 系统中，当使用 clone 克隆一个新进程时，这两个进程共享相同的：
*   **答案**：**b. Virtual memory**
*   **知识点讲解**：Linux 使用 `clone()` 系统调用来创建线程。通过传递特定标志（如 `CLONE_VM`），新老任务（Task）可以**共享同一个虚拟内存空间 (Virtual memory)**。但它们依然有各自的 `task_struct` 结构和内部唯一的进程标识符 (PID/TID)。

---

## 三、 Fill-In-The-Blank Questions (填空题)

**1. In an operating system, the unit of dispatching is usually referred to as a \_\_\_\_\_\_\_\_ while the unit of resource ownership is usually referred to as a process or task.**
*   **中文翻译**：在操作系统中，调度的单位通常被称为 \_\_\_\_\_\_\_\_，而资源所有权的单位通常被称为进程或任务。
*   **答案**：**thread (或 lightweight process)**
*   **知识点讲解**：再次强调了现代 OS 中将调度单位（**线程**）与资源分配单位（进程）进行解耦的设计。

**2. An example of an operating system that supports a single user process and a single thread is \_\_\_\_\_\_\_\_.**
*   **中文翻译**：支持单用户进程和单线程的操作系统的一个例子是 \_\_\_\_\_\_\_\_。
*   **答案**：**MS-DOS**
*   **知识点讲解**：MS-DOS 是典型的单任务、单线程操作系统，同一时间只能执行一个程序流。

**3. An example of an operating system that supports multiple user processes and multiple threads is \_\_\_\_\_\_\_\_.**
*   **中文翻译**：支持多个用户进程和多个线程的操作系统的一个例子是 \_\_\_\_\_\_\_\_。
*   **答案**：**Windows 2000 / Solaris / Linux / Mac OS** *(填任何一个现代 OS 即可)*
*   **知识点讲解**：目前主流的通用操作系统全部采用了多进程且每个进程支持多线程（M:N 架构）的设计模型。

**4. It is necessary to \_\_\_\_\_\_\_\_ the activities of various threads so they do not interfere with each other or corrupt data structures.**
*   **中文翻译**：必须 \_\_\_\_\_\_\_\_ 各个线程的活动，以便它们不会相互干扰或破坏数据结构。
*   **答案**：**synchronize (同步)**
*   **知识点讲解**：由于线程共享内存，并发访问共享数据会引发竞态条件。必须采用互斥锁、信号量等机制对线程行为进行**同步 (synchronize)**，保证数据一致性。

**5. A process that cannot execute until some event occurs is said to be in the \_\_\_\_\_\_\_\_ state.**
*   **中文翻译**：在发生某事件之前无法执行的进程被称为处于 \_\_\_\_\_\_\_\_ 状态。
*   **答案**：**blocked (阻塞) / waiting (等待)**
*   **知识点讲解**：当进程或线程请求 I/O 操作或试图获取一把被占用的锁时，它将被 OS 挂起，交出 CPU 控制权，进入**阻塞 (blocked)** 状态，直到等待的事件完成。

**6. The Clouds O/S implements the concept of a thread as primarily an entity that can move among address spaces which represents the \_\_\_\_\_\_\_\_ Thread-to-Process relationship.**
*   **中文翻译**：Clouds 操作系统主要将线程的概念实现为可以在地址空间之间移动的实体，这代表了 \_\_\_\_\_\_\_\_ 线程对进程关系。
*   **答案**：**One-to-Many (1:M / 一对多)**
*   **知识点讲解**：在分布式/基于对象的操作系统（如 Clouds、Ra）中，一个执行线索（Thread）可以从一个对象的方法调用进入另一个对象，也就是穿梭于不同进程的地址空间中，形成**一（线程）对多（进程）**的模型。

**7. In a \_\_\_\_\_\_\_\_ system, the kernel can execute on any processor, and typically each processor does self-scheduling from the pool of available processes or threads.**
*   **中文翻译**：在 \_\_\_\_\_\_\_\_ 系统中，内核可以在任何处理器上执行，并且通常每个处理器都从可用进程或线程池中进行自我调度。
*   **答案**：**Symmetric Multiprocessing (SMP / 对称多处理)**
*   **知识点讲解**：区别于主从架构，在 **SMP** 系统中所有 CPU 都是平等的，任何 CPU 都能执行操作系统内核代码，它们共享一个全局的就绪队列，自主进行调度和任务获取。

**8. In most modern computer systems, processors generally have at least one level of \_\_\_\_\_\_\_\_ that is private to the processor.**
*   **中文翻译**：在大多数现代计算机系统中，处理器通常具有至少一级对处理器私有的 \_\_\_\_\_\_\_\_。
*   **答案**：**cache (缓存)**
*   **知识点讲解**：现代多核处理器中，L1 Cache（甚至 L2 Cache）通常是每个核心（Core）私有的，而 L3 Cache 则是多个核心共享的。这就引出了前文提到的缓存一致性问题。

**9. With multiple active processes in an SMP system having potential access to shared address space or shared I/O resources, care must be taken to provide effective \_\_\_\_\_\_\_\_.**
*   **中文翻译**：由于 SMP 系统中有多个活动进程潜在地访问共享地址空间或共享 I/O 资源，因此必须小心提供有效的 \_\_\_\_\_\_\_\_。
*   **答案**：**synchronization (同步机制)**
*   **知识点讲解**：在真正的硬件并行（SMP）下，不仅同一进程的线程需要同步，整个 OS 内核级别的自旋锁（Spinlock）、互斥量等**同步 (synchronization)** 原语对于保护共享内核数据结构至关重要。

**10. In the \_\_\_\_\_\_\_\_ O/S architecture, functions are organized hierarchically and interaction only takes place between adjacent sections.**
*   **中文翻译**：在 \_\_\_\_\_\_\_\_ 操作系统架构中，功能是按层次化组织的，并且交互仅在相邻部分之间发生。
*   **答案**：**layered (分层)**
*   **知识点讲解**：这是早期的**分层式设计 (Layered architecture)**（如 Multics 早期的某些概念）。上层仅依赖下层提供的服务，限制了各模块之间的无序调用，方便调试和维护，但严格的层次跨越会损害性能。

**11. One advantage of the microkernel architecture is \_\_\_\_\_\_\_\_ allowing the addition of new services as well as the provision of multiple services in the same functional area.**
*   **中文翻译**：微内核架构的一个优点是 \_\_\_\_\_\_\_\_，允许添加新服务以及在同一功能区域提供多个服务。
*   **答案**：**extensibility (可扩展性)**
*   **知识点讲解**：因为微内核的绝大多数服务是以用户态进程（服务器）运行的，要支持一个新的文件系统或网络协议，只需要添加一个新的用户态服务器即可，不需要修改内核代码，这就是极佳的**可扩展性 (extensibility)**。

**12. The basic form of communication between processes or threads in a microkernel O/S is \_\_\_\_\_\_\_\_.**
*   **中文翻译**：在微内核操作系统中，进程或线程之间基本的通信形式是 \_\_\_\_\_\_\_\_。
*   **答案**：**messages (或 message passing / 消息)**
*   **知识点讲解**：所有系统服务请求（如客户端请求文件服务）在微内核中都被打包成**消息 (messages)** 进行发送和接收。

**13. In a Linux system, if the process has been terminated but, for some reason, still must have its task structure in the process table is in the \_\_\_\_\_\_\_\_ state.**
*   **中文翻译**：在 Linux 系统中，如果进程已终止，但由于某种原因仍必须将其任务结构保存在进程表中，则它处于 \_\_\_\_\_\_\_\_ 状态。
*   **答案**：**zombie (僵尸)**
*   **知识点讲解**：当 Linux 进程终止后，内核会释放它的绝大部分资源（内存、文件），但必须保留一个空的骨架（退出码等在 `task_struct` 中），等待它的父进程调用 `wait()` 来收集。在这期间，它处于 **僵尸 (zombie)** 状态。

**14. In a Solaris system, a User-Level Thread (ULT) in the active state is assigned to a(n) \_\_\_\_\_\_\_\_ and executes while the underlying kernel thread executes.**
*   **中文翻译**：在 Solaris 系统中，处于活动状态的用户级线程 (ULT) 被分配给 \_\_\_\_\_\_\_\_，并在底层内核线程执行时执行。
*   **答案**：**LWP (Light-Weight Process / 轻量级进程)**
*   **知识点讲解**：Solaris 线程库调度器将处于就绪态的 ULT 放置在一个活动队列中，然后将它们一对一地绑定到可用的 **LWP** 虚拟处理器上执行。

**15. In a Windows 2000 system, a process that has been selected to run next on a particular process moves from the Ready state to the \_\_\_\_\_\_\_\_ state.**
*   **中文翻译**：在 Windows 2000 系统中，被选择为要在特定处理器上接下来运行的线程（原题表述有微瑕，此处应指 thread 被调度）从就绪状态移动到 \_\_\_\_\_\_\_\_ 状态。
*   **答案**：**Standby (备用 / 挂起待命)**
*   **知识点讲解**：在 Windows 操作系统的线程状态机中，当一个就绪（Ready）线程被调度器选中，准备在某颗 CPU 上执行，但在进行实际上下文切换的极短时间窗口内，它会处于 **备用 (Standby)** 状态。一旦上下文切换完成，即变为运行态 (Running)。