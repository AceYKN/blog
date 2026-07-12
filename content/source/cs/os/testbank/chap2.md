---
title: Chap. 2
order: 2
---

# Chapter 2 - Operating System Overview

## 一、 True / False Questions (判断题)

**1. An operating system controls the execution of applications and acts as an interface between applications and the computer hardware.**
*   **中文翻译**：操作系统控制应用程序的执行，并作为应用程序与计算机硬件之间的接口。
*   **答案**：**True (正确)**
*   **详细解析**：这是操作系统的最基本定义。操作系统的两个主要目标是：为应用程序和用户提供一个方便的抽象接口（屏蔽底层硬件的复杂性），以及作为资源管理器来控制硬件和软件资源的分配与执行。

**2. The operating system maintains information that can be used for billing purposes on multi-user systems.**
*   **中文翻译**：操作系统维护的信息可用于多用户系统上的计费目的。
*   **答案**：**True (正确)**
*   **详细解析**：操作系统的服务之一是**记账 (Accounting)**。在一个共享的多用户或多任务系统中，操作系统会收集各类资源（如 CPU 时间、内存使用量、I/O 操作次数）的使用统计信息。这些信息既可以用于性能监控和优化，也可以用于对用户的资源消耗进行计费。

**3. The operating system typically runs in parallel with application programs, on it's own special O/S processor.**
*   **中文翻译**：操作系统通常与应用程序并行运行在它自己专用的 OS 处理器上。
*   **答案**：**False (错误)**
*   **详细解析**：在传统的计算机体系结构中，操作系统**并不是**运行在一个完全隔离的、专用的处理器上。相反，操作系统和用户应用程序共享同一个（或同一组）CPU。操作系统通过**中断 (Interrupts)** 和上下文切换机制，交替地与应用程序分时使用 CPU。当操作系统放弃 CPU 时，它必须依赖硬件中断才能重新夺回对处理器的控制权。

**4. One of the driving forces in operating system evolution is advancement in the underlying hardware technology.**
*   **中文翻译**：操作系统演进的驱动力之一是底层硬件技术的进步。
*   **答案**：**True (正确)**
*   **详细解析**：操作系统的演进主要由三个因素驱动：底层硬件的升级和新硬件的出现（例如从单核到多核、新型存储设备）、新服务的需求，以及修复系统中的软件缺陷 (Bugs)。因此，硬件的进步绝对是核心驱动力。

**5. In the first computers, users interacted directly with the hardware and operating systems did not exist.**
*   **中文翻译**：在早期的计算机中，用户直接与硬件交互，不存在操作系统。
*   **答案**：**True (正确)**
*   **详细解析**：在第一代计算机（20世纪40年代末到50年代中期的真空管计算机）时期，还没有操作系统的概念。程序员直接在控制台（Console）上通过拨动开关和插入接线板来与纯硬件交互，这被称为**串行处理 (Serial Processing)** 时代。

**6. In a batch-processing system, the phrase "control is passed to a job" means that the processor is now fetching and executing instructions in a user program.**
*   **中文翻译**：在批处理系统中，“控制权传递给作业”这句话意味着处理器现在正在获取并执行用户程序中的指令。
*   **答案**：**True (正确)**
*   **详细解析**：在早期的简单批处理系统中，存在一个常驻监控程序 (Resident Monitor)。当监控程序完成了一个作业的加载和设置后，它会将程序计数器 (PC) 指向用户程序的起始地址。这就是所谓的“交出控制权”，此时 CPU 开始执行用户的代码，直到程序结束或出错，控制权才交还给监控程序。

**7. Uniprogramming typically provides better utilization of system resources than multiprogramming.**
*   **中文翻译**：单道程序设计通常比多道程序设计提供更好的系统资源利用率。
*   **答案**：**False (错误)**
*   **详细解析**：恰恰相反。**单道程序设计 (Uniprogramming)** 意味着内存中只有一个程序，当该程序进行 I/O 操作时，CPU 只能闲置等待，资源利用率极低。**多道程序设计 (Multiprogramming)** 允许多个程序同时驻留内存，当一个程序等待 I/O 时，CPU 可以切换去执行另一个程序，从而极大**提高**了 CPU 和系统资源的利用率。

**8. In a time sharing system, a user's program is preempted at regular intervals, but due to relatively slow human reaction time this occurrence is usually transparent to the user.**
*   **中文翻译**：在分时系统中，用户的程序会定期被抢占，但由于人类的反应时间相对较慢，这种情况对用户来说通常是透明的。
*   **答案**：**True (正确)**
*   **详细解析**：**分时系统 (Time Sharing System)** 通过时钟中断将 CPU 时间划分为极短的时间片 (Time slices)。每个用户的程序轮流执行一个时间片。由于时间片非常短（如几十毫秒），切换速度远快于人类的感知和反应速度，因此每个用户都感觉自己独占了整个计算机。

**9. A process can be defined as a unit of activity characterized by a single sequential thread of execution, a current state, and an associated set of system resources.**
*   **中文翻译**：进程可以定义为一个活动单元，其特征是具有单一的顺序执行线程、当前状态以及一组关联的系统资源。
*   **答案**：**True (正确)**
*   **详细解析**：这是经典操作系统中对**进程 (Process)** 的标准定义。一个进程包含了可执行代码、程序数据、执行上下文（即状态和寄存器内容）以及它所拥有的系统资源（如内存、文件句柄等）。

**10. A virtual memory address typically consists of a page number and an offset within the page.**
*   **中文翻译**：虚拟内存地址通常由页号和页内偏移量组成。
*   **答案**：**True (正确)**
*   **详细解析**：在分页 (Paging) 虚拟内存管理中，逻辑地址被划分为两部分：**页号 (Page Number)**，用于在页表中查找对应的物理页框号；以及**偏移量 (Offset)**，表示在这一页内部的相对地址。偏移量在虚拟地址和物理地址中是完全相同的。

**11. Implementing priority levels is a common strategy for short-term scheduling, which involves assigning each process in the queue to the processor according to its level of importance.**
*   **中文翻译**：实现优先级是短期调度的常见策略，这涉及根据队列中每个进程的重要性级别将其分配给处理器。
*   **答案**：**True (正确)**
*   **详细解析**：**短期调度器 (Short-term scheduler / Dispatcher)** 决定哪个处于“就绪”状态的进程将获得 CPU。为其分配优先级（Priority levels）是操作系统的核心调度策略之一，确保关键或高优先级的任务能优先执行。

**12. Complex operating systems today typically consist of a few thousand lines of instructions.**
*   **中文翻译**：如今复杂的操作系统通常包含几千行指令。
*   **答案**：**False (错误)**
*   **详细解析**：现代操作系统是极其庞大且复杂的软件工程。例如 Windows 或 Linux 内核的代码量都是在**数千万行 (Millions of lines)** 级别，而不是区区几千行。早期的“软件危机”正是源于这种庞大规模带来的维护困难。

**13. A monolithic kernel architecture assigns only a few essential functions to the kernel, including address spaces, interprocess communication and basic scheduling.**
*   **中文翻译**：单体内核 (monolithic kernel) 架构只将少数基本功能分配给内核，包括地址空间、进程间通信和基本调度。
*   **答案**：**False (错误)**
*   **详细解析**：题目描述的是**微内核 (Microkernel)** 架构的特点。**单体内核 (Monolithic Kernel)** 正好相反，它将几乎所有的操作系统服务（如文件系统、设备驱动、网络协议栈等）全部打包在一个巨大的内核地址空间中运行。

**14. The hardware abstraction layer (HAL) maps between generic hardware commands/responses and those unique to a specific platform.**
*   **中文翻译**：硬件抽象层 (HAL) 在通用硬件命令/响应与特定平台独有的命令/响应之间进行映射。
*   **答案**：**True (正确)**
*   **详细解析**：**HAL (Hardware Abstraction Layer)** 是一层位于操作系统内核底部的软件。它隔离了硬件的差异，为上层操作系统提供了一个统一的、通用的硬件接口，使得操作系统具有高度的可移植性 (Portability)。

**15. Linux is one example of a modern UNIX system that implements a modular architecture.**
*   **中文翻译**：Linux 是实现了模块化架构的现代 UNIX 系统的例子之一。
*   **答案**：**True (正确)**
*   **详细解析**：虽然 Linux 本质上是一个**单体内核 (Monolithic kernel)**，但为了解决单体内核过于庞大、不够灵活的问题，Linux 引入了**可加载内核模块 (Loadable Kernel Modules, LKMs)** 机制。这赋予了 Linux 模块化 (Modular) 的架构特征，允许在运行时动态加载和卸载功能（如驱动程序）。

---

## 二、 Multiple Choice Questions (单选题)

**1. A primary objective of an operating system is:**
a. Convenience
b. Efficiency
c. Ability to evolve
d. All of the above
*   **中文翻译**：操作系统的主要目标是：
    a. 方便性 (Convenience)
    b. 高效性 (Efficiency)
    c. 演进能力 (Ability to evolve)
    d. 以上皆是
*   **答案**：**d. All of the above**
*   **详细解析**：这三个正是操作系统设计的三大核心目标。方便性指使得计算机更容易被用户使用；高效性指更好地管理计算机系统资源；演进能力指操作系统结构应该允许在不影响服务的情况下，有效开发、测试和引入新的系统功能。

**2. The operating system provides many types of services to end-users, programmers and system designers, including:**
a. Built-in user applications
b. Error detection and response
c. Relational database capabilities with the internal file system
d. All of the above
*   **中文翻译**：操作系统向终端用户、程序员和系统设计者提供多种类型的服务，包括：
    a. 内置用户应用程序
    b. 错误检测和响应
    c. 带有内部文件系统的关系数据库功能
    d. 以上皆是
*   **答案**：**b. Error detection and response**
*   **详细解析**：操作系统的核心服务包括程序开发、程序执行、访问 I/O 设备、文件访问控制、系统访问、**错误检测和响应 (Error detection and response)** 以及记账。它通常不包含也不提供内置的用户级应用（如文字处理）或关系数据库服务（这些属于应用层或中间件层）。

**3. The operating system is unusual in it's role as a control mechanism, in that:**
a. It runs on a special processor, completely separated from the rest of the system
b. It frequently relinquishes control of the system processor and must depend on the processor to regain control of the system
c. It never relinquishes control of the system processor
d. None of the above
*   **中文翻译**：操作系统作为一种控制机制，其不寻常之处在于：
*   **答案**：**b. It frequently relinquishes control of the system processor and must depend on the processor to regain control of the system**
*   **详细解析**：操作系统本身也是一套程序代码。为了让用户程序能够运行，操作系统必须将 CPU 的**控制权交出 (relinquish control)**。一旦交出，操作系统本身就不在运行了，它必须依靠底层硬件的定时器中断或系统调用等机制，才能强行打断用户程序，重新夺回对 CPU 的控制。

**4. Operating systems must evolve over time because:**
a. Hardware must be replaced when it fails
b. Users will only purchase software that has a current copyright date
c. New hardware is designed and implemented in the computer system
d. All of the above
*   **中文翻译**：操作系统必须随着时间演进，因为：
*   **答案**：**c. New hardware is designed and implemented in the computer system**
*   **详细解析**：操作系统的演进主要由于硬件的升级和新型硬件的出现（例如从机械硬盘到 SSD，从单核到多核架构）。选项 a 描述的是硬件故障替换，不需要 OS 演进；选项 b 是无稽之谈。因此 c 是正确的。

**5. A major problem with early serial processing systems was:**
a. Setup time
b. Lack of input devices
c. Inability to get hardcopy output
d. All of the above
*   **中文翻译**：早期串行处理系统的一个主要问题是：
*   **答案**：**a. Setup time**
*   **详细解析**：早期的计算机没有操作系统，程序员必须手动挂载磁带、设置开关。**建立时间 (Setup time)** （即准备运行一个程序所花费的物理人工时间）往往比程序实际执行的时间还要长，导致极大的浪费。这是推动早期批处理系统诞生的核心痛点。

**6. An example of a hardware feature that is desirable in a batch-processing system is:**
a. Privileged instructions
b. A completely accessible memory area
c. Large clock cycles
d. None of the above
*   **中文翻译**：在批处理系统中，期望拥有的硬件特性示例是：
*   **答案**：**a. Privileged instructions**
*   **详细解析**：为了让常驻监控程序 (Monitor) 能够控制系统并防止用户程序恶意干扰，硬件必须支持**特权指令 (Privileged instructions)**。只有在监控程序运行（内核态）时才能执行这些指令（如控制 I/O），用户程序试图执行时将引发异常。这保证了批处理监控程序的权威性。

**7. A computer hardware feature that is vital to the effective operation of a multiprogramming operating system is:**
a. Very large memory
b. Multiple processors
c. I/O interrupts and DMA
d. All of the above
*   **中文翻译**：对于多道程序操作系统有效运行至关重要的计算机硬件特征是：
*   **答案**：**c. I/O interrupts and DMA**
*   **详细解析**：多道程序设计的核心思想是：当一个进程进行 I/O 时，CPU 可以切换去执行另一个进程。要实现这一点，必须依赖 **I/O 中断 (I/O interrupts)** 和 **DMA (直接内存访问)** 技术。有了 DMA，CPU 可以将 I/O 工作委托给控制器，自己去执行其他程序；当 I/O 完成时，控制器通过中断通知 CPU。

**8. The principle objective of a time sharing, multiprogramming system is to:**
a. Maximize response time
b. Maximize processor use
c. Provide exclusive access to hardware
d. None of the above
*   **中文翻译**：分时、多道程序系统的主要目标是：
*   **答案**：**d. None of the above**
*   **详细解析**：**分时系统 (Time sharing system)** 的主要目标是**最小化响应时间 (Minimize response time)**，让每个交互式用户都感觉系统响应迅速。选项 a 荒谬地说要“最大化响应时间”。选项 b（最大化处理器使用率）是**批处理 (Batch multiprogramming)** 系统的主要目标。因此选项均不正确。

**9. Which of the following major line of computer system development created problems in timing and synchronization that contributed to the development of the concept of the process?**
a. Multiprogramming batch operation systems
b. Time sharing systems
c. Real time transaction systems
d. All of the above
*   **中文翻译**：以下哪条主要的计算机系统发展路线产生了时序和同步问题，从而促成了“进程”概念的发展？
*   **答案**：**d. All of the above**
*   **详细解析**：**多道批处理系统**、**分时系统**以及**实时事务系统**，由于在内存中并发执行多个程序，并且频繁交替使用 CPU，导致系统状态极度复杂。中断处理、并发资源的争抢导致了严重的同步、死锁和时序错乱问题。这直接促使计算机科学家们抽象出了**进程 (Process)** 的概念，以便更系统地管理并发状态。

**10. The paging system in a memory management system provides for dynamic mapping between a virtual address used in a program and:**
a. A virtual address in main memory
b. A real address in main memory
c. A real address in a program
d. None of the above
*   **中文翻译**：内存管理系统中的分页机制提供了程序中使用的虚拟地址与什么之间的动态映射：
*   **答案**：**b. A real address in main memory**
*   **详细解析**：**分页机制 (Paging system)** 的核心功能就是通过硬件中的页表，将程序看到的虚拟地址（逻辑地址）在运行时动态地映射为**主存中的实地址 / 物理地址 (A real address in main memory)**。

**11. Relative to information protection and security in computer systems, access control typically refers to:**
a. Proving that security mechanisms perform according to specification
b. The flow of data within the system
c. Regulating user and process access to various aspects of the system
d. None of the above
*   **中文翻译**：相对于计算机系统中的信息保护和安全性，访问控制通常指：
*   **答案**：**c. Regulating user and process access to various aspects of the system**
*   **详细解析**：**访问控制 (Access Control)** 指的是对用户、程序或进程在计算机系统中访问各类资源（如文件、内存段等）的权限进行监管和限制。选项 a 描述的是保证/证明 (Assurance)，选项 b 描述的是信息流控制。

**12. A common problem with full-featured operating systems, due to their size and difficulty of the tasks they address, is:**
a. Chronically late in delivery
b. Latent bugs that show up in the field
c. Sub-par performance
d. All of the above
*   **中文翻译**：由于其规模庞大以及所处理任务的难度，全功能操作系统存在的一个共同问题是：
*   **答案**：**d. All of the above**
*   **详细解析**：历史上著名的**软件危机 (Software Crisis)** 表明，开发庞大的操作系统（如 IBM 的 OS/360 时代）往往伴随着严重的管理问题：开发总是延期 (Chronically late)，上线后暴露出无数潜伏的 Bug (Latent bugs)，并且由于系统过于庞杂而导致性能低下 (Sub-par performance)。

**13. A technique in which a process, executing an application, is divided into threads that can run concurrently is called:**
a. Multithreading
b. Multiprocessing
c. Symmetric multiprocessing (SMP)
d. None of the above
*   **中文翻译**：将执行应用程序的进程划分为可以并发运行的多个线程的技术被称为：
*   **答案**：**a. Multithreading**
*   **详细解析**：**多线程 (Multithreading)** 是一种技术，它将执行应用程序的一个大进程拆分成多个可以并发独立调度的执行线索（线程）。这极大提高了程序的并发性和响应能力。

**14. WIN2K supports several types of user applications, including:**
a. WIN32
b. Linux
c. System 10
d. None of the above
*   **中文翻译**：Windows 2000 (WIN2K) 支持几种类型的用户应用程序，包括：
*   **答案**：**a. WIN32**
*   **详细解析**：Windows 2000 基于 Windows NT 架构，它设计了环境子系统 (Environmental Subsystems) 以支持多种应用程序 API。其中最主要的是原生的 **Win32** 子系统。它还包含 POSIX 和 OS/2 子系统，但并不支持原生运行 Linux 应用。

**15. Key to the success of Linux has been it's character as a free software package available under the auspices of the:**
a. World Wide Web Consortium
b. Free Software Foundation
c. Berkeley Software Distribution
d. None of the above
*   **中文翻译**：Linux 成功的关键在于其作为免费软件包的特性，该软件包在以下哪个组织的主持下提供：
*   **答案**：**b. Free Software Foundation**
*   **详细解析**：Linux 能够取得巨大成功并形成完整的操作系统生态，极大程度上是因为它采用了**自由软件基金会 (Free Software Foundation, FSF)** 制定的 GNU 通用公共许可证 (GPL)。此外，Linux 内核与 FSF 的 GNU 软件工具（如 GCC 编译器、Shell 等）结合，才构成了完整的 GNU/Linux 操作系统。

---

## 三、 Fill-In-The-Blank Questions (填空题)

**1. The operating system's \_\_\_\_\_\_\_\_ refers to its inherent flexibility in permitting functional modifications to the system without interruption of services.**
*   **中文翻译**：操作系统的 \_\_\_\_\_\_\_\_ 指的是其固有的灵活性，允许在不中断服务的情况下对系统进行功能修改。
*   **答案**：**ability to evolve (演进能力)** 或 **extensibility (可扩展性)**
*   **详细解析**：前面提到，操作系统的三大目标是方便、高效以及 **演进能力 (Ability to evolve)**。它意味着系统架构有足够的弹性，可以在不造成破坏的情况下集成新特性。

**2. The operating system masks the details of the \_\_\_\_\_\_\_\_ from the application programmer.**
*   **中文翻译**：操作系统向应用程序员屏蔽了 \_\_\_\_\_\_\_\_ 的细节。
*   **答案**：**hardware (硬件)**
*   **详细解析**：应用程序员不需要知道硬盘的磁道和扇区如何转动，也不需要知道网卡如何发包，因为 OS 提供了一层抽象，完全屏蔽了底层**硬件 (hardware)** 的复杂性。

**3. The \_\_\_\_\_\_\_\_ is the portion of the operating system that remains in main memory during system operation.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 是操作系统在系统运行期间驻留在主存中的那部分。
*   **答案**：**kernel (内核) / nucleus (核心)**
*   **详细解析**：操作系统包含大量工具和实用程序，但真正控制系统并始终常驻内存（不可被换出到磁盘）的核心代码块被称为**内核 (Kernel)**。

**4. An operating system should be \_\_\_\_\_\_\_\_ in construction, allowing it greater flexibility in the evolutionary process.**
*   **中文翻译**：操作系统的构建应该是 \_\_\_\_\_\_\_\_ 的，从而使其在演进过程中具有更大的灵活性。
*   **答案**：**modular (模块化)**
*   **详细解析**：为了应对不断演进的需求，操作系统必须打破单块结构的僵化，采用 **模块化 (modular)** 构建。这使得可以独立替换或升级某个特定的子系统（如文件系统、网络栈）。

**5. The earliest computers employed \_\_\_\_\_\_\_\_ processing, a name derived by the way the users were forced to access the systems.**
*   **中文翻译**：最早的计算机采用 \_\_\_\_\_\_\_\_ 处理，该名称来源于用户被迫访问系统的方式。
*   **答案**：**serial (串行)**
*   **详细解析**：第一代计算机中，用户必须提前预约机房时间，一个人接一个人地排队使用，程序的执行是一个接着一个的串行流，故称 **串行处理 (Serial processing)**。

**6. The special type of programming language used to provide instructions to a monitor in a batch-processing scheme is called \_\_\_\_\_\_\_\_.**
*   **中文翻译**：在批处理方案中，用于向监控程序提供指令的特殊类型的编程语言称为 \_\_\_\_\_\_\_\_。
*   **答案**：**Job Control Language / JCL (作业控制语言)**
*   **详细解析**：在打孔卡片的批处理时代，为了告诉监控程序该加载什么编译器、执行哪个用户程序、输出到哪里，操作员会编写一组特定的控制卡片，这些卡片上使用的控制语法被称为 **作业控制语言 (JCL)**。

**7. The central theme of modern operating systems, based on the concept of switching among multiple programs in memory, is called \_\_\_\_\_\_\_\_.**
*   **中文翻译**：现代操作系统的核心主题是基于在内存中的多个程序之间进行切换的概念，这被称为 \_\_\_\_\_\_\_\_。
*   **答案**：**multiprogramming (多道程序设计)**
*   **详细解析**：**多道程序设计 (Multiprogramming)** 是现代 OS 的基石。它利用硬件的 I/O 阻塞时间差，在内存的多个作业之间穿梭执行，是提升单处理机性能的最伟大飞跃。

**8. In a time-sharing, multiprogramming system, users interact with the system through \_\_\_\_\_\_\_\_.**
*   **中文翻译**：在分时多道程序系统中，用户通过 \_\_\_\_\_\_\_\_ 与系统交互。
*   **答案**：**terminals (终端)**
*   **详细解析**：分时系统的初衷就是让多个用户能够同时、交互式地使用主机。用户坐在各自的显示器/键盘设备面前与主机通信，这些设备被称为 **终端 (terminals)**。

**9. A process consists of three elements: an executable program, associated data, and a(n) \_\_\_\_\_\_\_\_ which includes all information needed by the operating system and processor to manage and execute the process.**
*   **中文翻译**：一个进程由三个元素组成：可执行程序、相关数据，以及一个 \_\_\_\_\_\_\_\_，其中包含操作系统和处理器管理和执行该进程所需的所有信息。
*   **答案**：**execution context (执行上下文) / process control block (进程控制块)**
*   **详细解析**：根据经典教材的定义，构成进程的核心三要素是程序代码、数据，以及**执行上下文 (Execution Context)**。这个上下文在操作系统内部由数据结构 **PCB (进程控制块)** 来表示，包含了寄存器状态、优先级、内存映射等重要元数据。

**10. \_\_\_\_\_\_\_\_ is a facility that allows programs to address memory from a logical point of view, without regard to the physical amount of main memory.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 是一种机制，它允许程序从逻辑角度寻址内存，而不必考虑主存的实际物理容量。
*   **答案**：**Virtual memory (虚拟内存)**
*   **详细解析**：**虚拟内存 (Virtual memory)** 通过磁盘充当后备存储，将物理内存扩展成一个庞大且统一的逻辑空间。程序员只需面对这块逻辑空间，无需担心内存不够用或物理地址冲突的问题。

**11. The \_\_\_\_\_\_\_\_ queue in the operating system scheduling system consists of processes that are in main memory.**
*   **中文翻译**：在操作系统调度系统中，\_\_\_\_\_\_\_\_ 队列包含位于主存中的进程。
*   **答案**：**ready (就绪)**
*   **详细解析**：进程调度模型中，所有已被加载进主存、万事俱备只欠 CPU 资源的进程，会被操作系统组织在一个等待队列中，这个队列被称为 **就绪队列 (Ready queue)**。

**12. The interface to an operating system is often referred to as a \_\_\_\_\_\_\_\_ because it separates the user from O/S details and presents the O/S simply as a collection of services.**
*   **中文翻译**：操作系统的接口通常被称为 \_\_\_\_\_\_\_\_，因为它将用户与 OS 细节分离开来，并仅将 OS 呈现为一系列服务。
*   **答案**：**shell (外壳)**
*   **详细解析**：正如坚果的外壳包裹着核心一样，操作系统的外围接口程序（无论是命令行接口 CLI 还是图形用户接口 GUI）被称为 **Shell**。它负责接收用户命令，解释后传递给内部的 Kernel (内核)。

**13. A \_\_\_\_\_\_\_\_ operating system provides the illusion of a single main memory space and a single secondary memory space, plus other unified access facilities.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 操作系统提供了单一主存空间和单一辅助存储空间的假象，以及其他统一的访问设施。
*   **答案**：**distributed (分布式)**
*   **详细解析**：在多台物理独立的计算机通过网络相连时，**分布式操作系统 (Distributed OS)** 可以将它们聚合成一个虚拟的单机系统。用户感觉就像在使用一台拥有巨大内存和硬盘的巨型计算机，这是分布式系统最高级的透明性表现。

**14. The executive, protected subsystems and applications in a WIN2K system are structured using the \_\_\_\_\_\_\_\_ computing model, which is a common model for distributed computing.**
*   **中文翻译**：WIN2K 系统中的执行体、受保护的子系统和应用程序是使用 \_\_\_\_\_\_\_\_ 计算模型构建的，这是一种分布式计算的常见模型。
*   **答案**：**client/server (客户端/服务器 或 C/S)**
*   **详细解析**：Windows NT / 2000 的微内核风格架构深度应用了 **客户端/服务器 (Client/Server)** 模型。用户应用程序（客户端）通过发送消息或 RPC，向环境子系统（服务器）请求服务（如文件读写、创建进程），即使它们运行在同一台机器上。

**15. Most UNIX systems are \_\_\_\_\_\_\_\_ in that they include virtually all of the O/S functionality in a single large block of code that runs in a single process with a single address space.**
*   **中文翻译**：大多数 UNIX 系统都是 \_\_\_\_\_\_\_\_ 的，因为它们几乎将所有的操作系统功能包含在一个庞大的代码块中，该代码块运行在具有单一地址空间的单个进程中。
*   **答案**：**monolithic (单体 / 宏内核)**
*   **详细解析**：传统的 UNIX 操作系统（如 System V、BSD、Linux 的基础核心）采用的都是 **单体内核 (Monolithic Kernel)** 架构。所有的驱动、文件系统、调度、IPC 等都在一个特权级下的连续地址空间中执行。它的优点是内部调用效率极高，缺点是体积庞大、其中一个模块崩溃可能导致整个内核崩溃。