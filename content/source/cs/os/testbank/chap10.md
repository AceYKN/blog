---
title: Chap. 10
order: 10
---

# Chapter 10 - Multiprocessor and Real-Time Scheduling

## True / False Questions (判断题)

**1. 题目**: The term cluster refers to a set of processors that share a common main memory and are under the integrated control of an operating system.

**翻译**: 术语“集群（cluster）”指的是一组共享公共主存并在操作系统的统一控制下运行的处理器集合。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 多处理器系统的分类（集群与紧密耦合）。

*   **详解**: 集群（Cluster）或松散耦合多处理器（Loosely coupled multiprocessor）是由一组相对自治的系统组成的，**每个处理器都有自己独立的主存**和 I/O 通道。共享公共主存并在同一个 OS 控制下的是**紧密耦合多处理器（Tightly coupled multiprocessor）**，如 SMP（对称多处理器）。

**2. 题目**: A good way of classifying multiprocessors and placing them in context with other architectures is to consider the synchronization granularity between processes in a system.

**翻译**: 对多处理器进行分类并将其与其他架构联系起来的一个好方法是，考虑系统中进程之间的同步粒度（synchronization granularity）。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 多处理器的同步粒度。

*   **详解**: 教科书中指出，根据进程间交互的频率和同步的粒度，可以很好地对并行性进行分类，包括细粒度（Fine-grained）、中粒度（Medium-grained）、粗粒度（Coarse-grained）、非常粗粒度（Very coarse-grained）和独立并行（Independent parallelism）。

**3. 题目**: In a system in which many processors are available, the primary concern shifts from ensuring maximum processor usage to providing the best average performance to all applications.

**翻译**: 在有许多可用处理器的系统中，主要关注点从确保最大的处理器使用率转向为所有应用程序提供最佳的平均性能。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 多处理器调度的目标。

*   **详解**: 在单处理器系统中，由于 CPU 是稀缺资源，调度器的重要目标是保持 CPU 忙碌（高利用率）。而在多处理器系统中，处理器的充裕使得“压榨每一个 CPU 周期”不再是首要任务，核心目标变成了如何高效地分配应用，降低开销，并优化整体应用的平均响应时间和性能。

**4. 题目**: A general conclusion of studies comparing multiprocessor and uniprocessor systems under various conditions is that the specific process scheduling discipline employed becomes much more important as the number of processors increase.

**翻译**: 在各种条件下比较多处理器和单处理器系统的研究得出的一个普遍结论是：随着处理器数量的增加，所采用的具体进程调度策略变得越来越重要。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 多处理器调度的影响。

*   **详解**: 结论恰恰相反。研究表明，随着系统中处理器数量的增加，单处理器中极其重要的那些复杂调度策略（如计算各种动态优先级）的影响力**会随之下降（decreases）**。在多处理器系统中，使用简单的 FCFS（先来先服务）配合合理的负载均衡，往往比复杂的单核调度算法效果更好。

**5. 题目**: In the Load Sharing multiprocessor scheduling and assignment approach, processes are assigned to a specific processor.

**翻译**: 在负载共享（Load Sharing）多处理器调度和分配方法中，进程被分配给特定的处理器。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 负载共享（Load Sharing）。

*   **详解**: 负载共享是多处理器调度中最常用的机制之一。它的核心是维护一个**全局的就绪队列**。进程/线程**并不**绑定到任何特定的处理器上。当任何一个处理器空闲时，它就会去全局队列中抓取下一个可用的线程来执行。

**6. 题目**: One advantage to the Load Sharing multiprocessor scheduling and assignment approach is that no centralized scheduler is required.

**翻译**: 负载共享多处理器调度和分配方法的一个优点是它不需要集中式的调度器。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 负载共享的优势。

*   **详解**: 负载共享机制下，每个处理器自己负责进行上下文切换和从全局队列中挑选线程。这意味着系统不需要一个专职的、唯一的“中央调度器”进程来发号施令，这避免了调度器成为单一瓶颈。

**7. 题目**: The processor allocation problem on a multiprocessor more closely resembles the memory allocation problem on a uniprocessor than the scheduling problem on a uniprocessor.

**翻译**: 多处理器上的处理器分配问题比单处理器上的调度问题更类似于单处理器上的内存分配问题。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 处理器分配。

*   **详解**: 在单处理器中，内存是分成多个块分配给程序的。而在多处理器系统中，多个同构的处理器就像多个可用的硬件块一样，需要将它们“分配（allocate）”给不同的并发应用。这种资源维度的分配逻辑确实与内存分配高度相似。

**8. 题目**: In Dynamic Scheduling, the operating system leaves all scheduling decisions to the application.

**翻译**: 在动态调度（Dynamic Scheduling）中，操作系统将所有的调度决策留给应用程序。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 动态调度（Dynamic Scheduling）。

*   **详解**: 在动态调度中，调度是由操作系统和应用程序**共同参与（joint effort）**的。操作系统负责动态地将一组处理器分配给一个作业，而应用程序（或运行库）自身负责判断哪些线程可以在这些分配到的处理器上执行。OS 并没有“完全撒手不管”。

**9. 题目**: A soft real-time task is one which will be terminated if the deadline is missed.

**翻译**: 软实时任务（soft real-time task）是指如果错过了截止时间就会被终止的任务。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 软实时与硬实时。

*   **详解**: 如果错过了截止时间会导致系统崩溃或致命错误，并且任务必须严格完成的任务是**硬实时任务（Hard real-time task）**。**软实时任务（Soft real-time task）**即使错过了截止时间，虽然不希望发生，但系统仍能容忍其继续执行并产生价值，不会被强制终止。

**10. 题目**: An operating system is deterministic to the extent that it performs operations at fixed, predetermined times or within predetermined time intervals.

**翻译**: 操作系统在一定程度上是确定性的（deterministic），即它在固定的、预定的时间或在预定的时间间隔内执行操作。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 实时操作系统的确定性。

*   **详解**: 确定性是实时操作系统（RTOS）的重要指标。它指的是系统响应内部或外部事件的时序是可预测的、固定的或有明确的上限时间保证的。

**11. 题目**: Dynamic best effort scheduling is the approach used by many real-time systems that are currently commercially available.

**翻译**: 动态尽力而为（Dynamic best effort）调度是目前许多商业可用的实时系统所采用的方法。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 实时调度方法。

*   **详解**: 目前绝大多数商用的实时操作系统采用的并非是动态尽力而为，而是**静态优先级驱动抢占式调度（Static priority-driven preemptive approach）**，因为这种方式的开销小且行为完全可预测。

**12. 题目**: T/F-A particularly useful metric in evaluating real-time operating systems is the frequency of task dispatching and interrupt handling.

**翻译**: 评估实时操作系统的一个特别有用的指标是任务分派和中断处理的频率（frequency）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 实时操作系统的评估指标。

*   **详解**: 评估实时操作系统的关键不仅是事件发生的“频率”，更重要的是**延迟（Latency）**或**响应时间（Responsiveness）**——即从中断发生到操作系统处理该中断并分派相关任务所需的时间（上下文切换时间等）。

**13. 题目**: A promising method of resolving multitask scheduling conflicts for periodic tasks is called Deadline Scheduling.

**翻译**: 解决周期性任务的多任务调度冲突的一种很有前途的方法叫做截止时间调度（Deadline Scheduling）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 周期性任务的实时调度。

*   **详解**: 针对周期性任务（Periodic tasks），业界最经典、最被广泛认可和应用的方法是**速率单调调度（Rate Monotonic Scheduling, RMS）**，而不是泛泛而指的 Deadline Scheduling。

**14. 题目**: Linux builds on the traditional UNIX scheduling described in Chapter 9 by adding two scheduling classes for soft real-time scheduling: SCHED_FIFO and SCHED_RR.

**翻译**: Linux 在第 9 章描述的传统 UNIX 调度的基础上，通过添加两个用于软实时调度的调度类进行构建：SCHED_FIFO 和 SCHED_RR。

**答案**: **True (正确)**

**解析**:

*   **知识点**: Linux 实时调度策略。

*   **详解**: POSIX 标准（Linux 遵循）定义了三种调度策略：`SCHED_OTHER` 用于普通的分时任务，而 `SCHED_FIFO`（先进先出）和 `SCHED_RR`（轮转）则是专门为了满足软实时（POSIX realtime）任务调度而添加的。

**15. 题目**: Priorities in W2K are organized into two bands, or classes: non-real-time and variable.

**翻译**: 在 W2K（Windows 2000/Windows NT内核）中，优先级被组织成两个频段或类：非实时（non-real-time）和可变（variable）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: Windows 优先级类。

*   **详解**: Windows 的优先级分为 0 到 31。它们被组织为两个大类：16-31 为**实时类（Real-time class）**，1-15 为**可变类（Variable class）**（0是用于空闲线程的特殊级别）。所以应该是 Real-time 和 variable。

---

## Multiple Choice Questions (单选题)

**1. 题目**: A multiprocessor system in which there is a master, general-purpose processor that controls and receives services from other processors in the system is referred to as:
a. Tightly coupled multiprocessing
b. Loosely coupled multiprocessing
c. Functionally specialized multiprocessing
d. None of the above

**翻译**: 在一个多处理器系统中，如果存在一个通用的主处理器来控制系统中的其他处理器并从中接收服务，这种系统被称为：
a. 紧密耦合多处理
b. 松散耦合多处理
c. 功能专用多处理（Functionally specialized multiprocessing）
d. 以上都不是

**答案**: **c. Functionally specialized multiprocessing**

**解析**:

*   **知识点**: 多处理器的硬件架构分类。

*   **详解**: 当系统具有一个主 CPU（Master）而辅以其他专门用于特定任务（如 I/O 处理、协处理）的从处理器时，这种不对称的、具有专职分工的系统被分类为“功能专用多处理系统”。

**2. 题目**: The category of parallelism in multiprocessors in which there is no explicit synchronization among processes is termed:
a. Independent parallelism
b. Coarse-grained parallelism
c. Fine-grained parallelism
d. None of the above

**翻译**: 在多处理器并行的类别中，进程之间没有显式同步的并行类别被称为：
a. 独立并行（Independent parallelism）
b. 粗粒度并行
c. 细粒度并行
d. 以上都不是

**答案**: **a. Independent parallelism**

**解析**:

*   **知识点**: 同步粒度。

*   **详解**: 独立并行（Independent parallelism）是指在系统上同时运行多个毫无关联的进程（如多个不同用户运行各自的程序）。它们之间不需要通信，也不需要显式同步。

**3. 题目**: Scheduling on a multiprocessor involves which of the following design issues:
a. The assignment of processes to processors
b. The use of multiprogramming on individual processors
c. The actual dispatching of a process
d. All of the above

**翻译**: 多处理器上的调度涉及以下哪些设计问题：
a. 将进程分配给处理器
b. 在各个处理器上使用多道程序设计
c. 进程的实际分派（dispatching）
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: 多处理器调度的复杂性。

*   **详解**: 多处理器调度必须解决三大核心问题：将哪个进程分配给哪个 CPU（分配）、CPU 内部是否以及如何采用分时切换（多道程序）、以及分派器具体的行为逻辑。这三个维度缺一不可。

**4. 题目**: Studies show that, as the number of processors in a system increases, the importance of the selection of the specific process scheduling discipline employed:
a. Increases
b. Decreases
c. Stays the same - no impact
d. All of the above

**翻译**: 研究表明，随着系统中处理器数量的增加，所采用的具体进程调度策略选择的重要性：
a. 增加
b. 减少（Decreases）
c. 保持不变 - 没有影响
d. 以上所有

**答案**: **b. Decreases**

**解析**:

*   **知识点**: 调度策略在多处理器中的影响。

*   **详解**: 如前文所述，在多核/多处理器中，算力不再是绝对瓶颈。复杂的调度算法带来的微小优化会被其带来的开销抵消，因此具体的进程调度规则（如用 SJF 还是 FCFS）的重要性比在单核中要低。

**5. 题目**: Which of the following statements about the Dedicated Processor Assignment multiprocessor scheduling and assignment approach is true?
a. Each program is assigned one processor
b. Related threads are scheduled to run on a set of processors at the same time
c. Each processor is returned to the available pool as its assigned thread completes
d. None of the above

**翻译**: 关于专用处理器分配（Dedicated Processor Assignment）多处理器调度和分配方法，以下哪项陈述是正确的？
a. 每个程序被分配一个处理器
b. 相关的线程被安排在同一时间在一组处理器上运行
c. 每个处理器在其分配的线程完成时被返回到可用池中
d. 以上都不是

**答案**: **d. None of the above**

**解析**:

*   **知识点**: 专用处理器分配。

*   **详解**: 在专用处理器分配中，当一个应用程序被调度时，它的**每一个线程都会被分配一个独占的处理器**（a 错误）。b 描述的是群集调度（Gang Scheduling）的一般特征。c 错误的原因是，在 Dedicated Processor Assignment 中，即使某个线程提前结束，该处理器也会**保持空闲状态（被应用霸占）直到整个应用程序完成**，而不会立即归还给可用池。因此，所有选项都不准确。

**6. 题目**: A disadvantage of the Load Sharing multiprocessor scheduling and assignment approach is:
a. No centralized scheduler is required
b. The central queue can be a bottleneck due to mutual exclusion
c. The load must be distributed evenly across all processors
d. All of the above

**翻译**: 负载共享多处理器调度和分配方法的一个缺点是：
a. 不需要集中式的调度器
b. 由于互斥，中央队列可能成为瓶颈
c. 负载必须在所有处理器上均匀分布
d. 以上所有

**答案**: **b. The central queue can be a bottleneck due to mutual exclusion**

**解析**:

*   **知识点**: 负载共享机制的缺点。

*   **详解**: 负载共享所有的空闲 CPU 都去读取一个全局的就绪队列。为了保证数据一致性，必须在读取和修改队列时加上互斥锁（Mutual exclusion）。当处理器数量众多时，这个锁争用会非常激烈，导致中央队列成为系统性能瓶颈。

**7. 题目**: An extreme form of Gang Scheduling in which a group of processors is dedicated to a particular application for the duration of its execution is called:
a. Load Sharing
b. Dynamic Scheduling
c. Dedicated Processor Assignment
d. None of the above

**翻译**: 一种群集调度（Gang Scheduling）的极端形式，其中一组处理器在特定应用程序执行期间专门为其专用，这被称为：
a. 负载共享
b. 动态调度
c. 专用处理器分配（Dedicated Processor Assignment）
d. 以上都不是

**答案**: **c. Dedicated Processor Assignment**

**解析**:

*   **知识点**: 多处理器调度的分配策略。

*   **详解**: 群集调度是指将进程的所有线程同时调度运行。而它的“极端形式”就是给该应用的每个线程分配一个物理 CPU，并完全霸占这些 CPU 直到应用结束。这就是 Dedicated Processor Assignment。

**8. 题目**: An approach to multiprocessor scheduling and assignment in which both the operating system and the application are involved in making scheduling decisions is called:
a. Load Sharing
b. Dynamic Scheduling
c. Dedicated Processor Assignment
d. None of the above

**翻译**: 一种操作系统和应用程序都参与制定调度决策的多处理器调度和分配方法被称为：
a. 负载共享
b. 动态调度（Dynamic Scheduling）
c. 专用处理器分配
d. 以上都不是

**答案**: **b. Dynamic Scheduling**

**解析**:

*   **知识点**: 动态调度。

*   **详解**: 动态调度改变了单方面的调度逻辑。OS 负责把处理器资源分配给各个作业，而在作业内部，由应用程序自己的运行时库决定把哪个线程派发到哪个被分配到的处理器上去。

**9. 题目**: A task that, unless it meets its deadline may cause undesirable damage or a fatal error to the system, is called a(n):
a. Hard real-time task
b. Soft real-time task
c. Aperiodic task
d. None of the above

**翻译**: 除非满足其截止时间，否则可能会对系统造成不良损坏或致命错误的任务被称为：
a. 硬实时任务（Hard real-time task）
b. 软实时任务
c. 非周期性任务
d. 以上都不是

**答案**: **a. Hard real-time task**

**解析**:

*   **知识点**: 硬实时的定义。

*   **详解**: 硬实时（Hard real-time）系统的约束极其严格。例如医疗起搏器控制或导弹拦截系统，一旦错过 Deadline 就等同于系统失效甚至引发灾难。

**10. 题目**: Which of the following requirements of real-time operating systems is concerned with how long, after acknowledgement, it takes the O/S to service the interrupt?
a. Determinism
b. Responsiveness
c. Reliability
d. None of the above

**翻译**: 实时操作系统的以下哪项要求与操作系统在确认后需要多长时间来处理中断有关？
a. 确定性（Determinism）
b. 响应性（Responsiveness）
c. 可靠性（Reliability）
d. 以上都不是

**答案**: **b. Responsiveness**

**解析**:

*   **知识点**: 实时系统特性。

*   **详解**: 确定性（Determinism）是指中断多久之后能被**识别并确认**；而响应性（Responsiveness）是指中断确认之后，系统进行上下文切换并**实际开始执行**对应中断处理服务所需的时间。

**11. 题目**: The result of the schedulability analysis of the following approach is a schedule that determines, at run time, when a task must begin execution.
a. Static table-driven approach
b. Static priority-driven preemptive approach
c. Dynamic planning-based approach
d. None of the above

**翻译**: 以下哪种方法的可调度性分析结果是产生一个在运行时（run time）决定任务何时必须开始执行的调度？
a. 静态表驱动方法
b. 静态优先级驱动抢占式方法
c. 基于动态规划的方法（Dynamic planning-based approach）
d. 以上都不是

**答案**: **c. Dynamic planning-based approach**

**解析**:

*   **知识点**: 实时调度方法的分类。

*   **详解**: 
    *   静态表驱动：在离线编译时就算好了整张时间表。
    *   基于动态规划：允许任务在**运行时（run time）**动态到达。到达时，系统会动态地规划计算，看是否有可行的调度方案来满足它的截止时间。

**12. 题目**: Useful information about a task that might be used in real-time task scheduling includes:
a. Starting deadline
b. Resource requirements
c. Priority
d. All of the above

**翻译**: 可用于实时任务调度的、关于任务的有用信息包括：
a. 开始截止时间
b. 资源需求
c. 优先级
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: 实时任务属性。

*   **详解**: 为了构建可行的实时调度计划，调度器需要知道任务的确切限制：它必须在什么时候开始/结束、需要多少内存和 I/O 资源、以及它的重要级（优先级）。

**13. 题目**: A promising method of resolving multitask scheduling conflicts for periodic tasks is:
a. Deadline Scheduling (DS)
b. Rate Monotonic Scheduling (RMS)
c. Real-Time Scheduling (RTS)
d. All of the above

**翻译**: 解决周期性任务的多任务调度冲突的一种很有前途的方法是：
a. 截止时间调度 (DS)
b. 速率单调调度 (Rate Monotonic Scheduling, RMS)
c. 实时调度 (RTS)
d. 以上所有

**答案**: **b. Rate Monotonic Scheduling (RMS)**

**解析**:

*   **知识点**: RMS 算法。

*   **详解**: RMS（速率单调调度）是处理**周期性任务**的静态优先级最优算法。它根据任务周期的长短来分配优先级——周期越短（执行频率越快），优先级越高。

**14. 题目**: Linux builds on the traditional UNIX scheduling described in Chapter 9 by adding two scheduling classes for soft real-time scheduling:
a. SCHED_FIFO and SCHED_RR
b. SCHED_RR and SCHED_OTHER
c. SCHED_FIFO and SCHED_OTHER
d. All of the above

**翻译**: Linux 在第 9 章描述的传统 UNIX 调度的基础上，通过添加哪两个调度类来实现软实时调度：
a. SCHED_FIFO 和 SCHED_RR
b. SCHED_RR 和 SCHED_OTHER
c. SCHED_FIFO 和 SCHED_OTHER
d. 以上所有

**答案**: **a. SCHED_FIFO and SCHED_RR**

**解析**:

*   **知识点**: Linux 的 POSIX 调度策略。

*   **详解**: `SCHED_OTHER` 是传统的非实时分时调度。`SCHED_FIFO`（先进先出直到主动放弃或被更高优先级抢占）和 `SCHED_RR`（按时间片轮转的 FIFO）是专门针对实时任务的两种策略。

**15. 题目**: Priorities in W2K are organized into two bands, or classes:
a. Real-time and static
b. Real-time and variable
c. Non-real-time and variable
d. All of the above

**翻译**: 在 W2K（Windows）中，优先级被组织成两个频段或类：
a. 实时和静态
b. 实时和可变（Real-time and variable）
c. 非实时和可变
d. 以上所有

**答案**: **b. Real-time and variable**

**解析**:

*   **知识点**: Windows 优先级系统。

*   **详解**: Windows 的 32 个优先级级别被分为 Real-time class（16-31，优先级固定，不会因等待而提升）和 Variable class（1-15，动态优先级，会为了防止饥饿而进行优先级提升）。

---

## Fill-In-The-Blank Questions (填空题)

**1. 题目**: A collection of relatively autonomous systems, where each processor has its own main memory and I/O channels is called __________.

**翻译**: 一个由相对自治的系统组成的集合，其中每个处理器都有自己的主存和 I/O 通道，被称为 __________。

**答案**: **cluster (或 loosely coupled multiprocessor)**

**解析**: 具有独立主存和通道的系统通过网络连接起来就是集群（Cluster）或松散耦合多处理系统。

**2. 题目**: A system that implements a high degree of coordination and interaction among the threads of an application, as specified by the programmer, falls into the category of __________ parallelism.

**翻译**: 一个实现了应用程序线程之间高度协调和交互的系统（如程序员所指定的那样），属于 __________ 并行类别。

**答案**: **medium-grained**

**解析**: 教科书对并行粒度的定义中指出，单个应用程序的多个线程之间的高度交互并行属于**中等粒度（Medium-grained）**并行。细粒度通常指指令级别的并行。

**3. 题目**: The process assignment strategy where a process is permanently assigned to one processor from activation to completion is referred to as __________ assignment.

**翻译**: 从激活到完成，将一个进程永久地分配给一个处理器的进程分配策略被称为 __________ 分配。

**答案**: **Dedicated Processor (或 dedicated)**

**解析**: 将处理器从始至终死死绑定到一个应用的所有线程上，这就是“专用处理器分配（Dedicated Processor Assignment）”。

**4. 题目**: As the number of processors in a system increases, the impact of the specific scheduling discipline __________.

**翻译**: 随着系统中处理器数量的增加，特定调度策略的影响力会 __________。

**答案**: **decreases**

**解析**: 这是多处理器调度的一个重要结论。有了更多的 CPU，即使是最简单的 FCFS 也能跑得很好，复杂调度算法的边际效益在降低（decreases）。

**5. 题目**: The multiprocessor scheduling and assignment approach in which a set of related threads is scheduled to run on a set of processors at the same time is referred to as __________.

**翻译**: 一组相关的线程被安排在同一时间在一组处理器上运行的多处理器调度和分配方法被称为 __________。

**答案**: **gang scheduling (或 co-scheduling)**

**解析**: 为了避免并发线程间相互等待对方的消息而在阻塞和唤醒之间浪费大量上下文切换时间，系统将这组相关的线程一起调度（同时执行）。这种做法称为群集调度（Gang Scheduling）。

**6. 题目**: Using simulation methods, it has been determined that the __________ load balancing policy is superior to both the preemptive and non-preemptive versions of the Smallest Number of Threads First load balancing policy.

**翻译**: 使用仿真方法已经确定，__________ 负载均衡策略优于最少线程数优先（SNTF）负载均衡策略的抢占式和非抢占式版本。

**答案**: **FCFS (First-Come-First-Served)**

**解析**: 在动态多处理器调度研究中，先来先服务（FCFS）因其极低的系统开销和不需复杂的队列搜索，实际上优于那些看似更聪明的策略（如 SNTF）。

**7. 题目**: The term __________ has been applied to the simultaneous scheduling of the threads that make up a single process.

**翻译**: 术语 __________ 已被应用于对构成单个进程的多个线程进行同时调度的场景。

**答案**: **Gang Scheduling (或 co-scheduling)**

**解析**: 同第 5 题，同时调度同一进程下所有相关线程的技术称为群集调度。

**8. 题目**: Both Gang Scheduling and Dedicated Processor Assignment attack the scheduling problem by addressing the issue of __________ allocation.

**翻译**: 群集调度和专用处理器分配这两种机制，都是通过解决 __________ 分配问题来应对调度问题的。

**答案**: **processor**

**解析**: 这两种策略的本质思路是将问题转化为空间上的分配，它们更关心如何在空间上将并行的**处理器（Processor）**一次性地分配给应用程序。

**9. 题目**: A real-time task that has a deadline by which it must finish or start, or that may have a constraint on both start and finish time is called a(n) __________ task.

**翻译**: 一个具有必须完成或必须开始的截止时间，或者可能对开始和完成时间都有约束的实时任务被称为 __________ 任务。

**答案**: **aperiodic**

**解析**: 教科书根据时间到达模式将任务分为周期性和非周期性任务。非周期性任务（Aperiodic task）是突发的事件，它伴随着一个必须执行或结束的确切截止期限。

**10. 题目**: __________ is a characteristic that refers to the ability of a system to fail in such a way as to preserve as much capability and data as possible.

**翻译**: __________ 是一种特性，指的是系统以能够尽可能多地保留系统能力和数据的方式发生故障的能力。

**答案**: **Fail-soft operation**

**解析**: “故障弱化操作（Fail-soft operation）”是实时系统的一个关键特征。当系统无法承受所有负载或发生部分组件故障时，它会优雅地降级服务（例如优先保证最关键的硬实时任务运行），而不是全面崩溃。

**11. 题目**: A major drawback to the __________ real-time scheduling approach is that it cannot be known whether a timing constraint will be met until a deadline arrives or the task completes.

**翻译**: __________ 实时调度方法的一个主要缺点是：只有当截止时间到来或任务完成时，才能知道是否满足了时序约束。

**答案**: **dynamic best effort**

**解析**: 在动态尽力而为（dynamic best effort）调度中，系统不进行可行性分析，仅仅尝试尽快运行它认为最重要的任务。因此，你无法提前预知任务会不会超时。

**12. 题目**: It can be shown, for a given preemption strategy, using either starting or completion deadlines, that a policy of scheduling the task with the __________ deadline minimizes the fraction of tasks that miss their deadlines.

**翻译**: 可以证明，对于给定的抢占策略，无论使用开始截止时间还是完成截止时间，调度具有 __________ 截止时间的任务的策略能够使错过截止时间的任务比例最小化。

**答案**: **earliest**

**解析**: 这是最早截止期优先（Earliest Deadline First, EDF）调度算法的理论基础。总是优先调度最快要到期的任务。

**13. 题目**: The scheduling scheme that assigns priorities to tasks on the basis of their periods (i.e., amount of time between the arrival of instances of the task) is referred to as __________.

**翻译**: 基于任务周期（即任务实例到达之间的时间量）为任务分配优先级的调度方案被称为 __________。

**答案**: **Rate Monotonic (或 RM, Rate Monotonic Scheduling)**

**解析**: 速率单调（Rate Monotonic）调度是一种静态优先级调度策略，其核心原则就是：周期 $T$ 越短（速率 $1/T$ 越快），分配的静态优先级越高。

**14. 题目**: Linux builds on the traditional UNIX scheduling described in Chapter 9 by adding two additional scheduling classes (SCHED_FIFO and SCHED_RR) to accommodate __________ scheduling.

**翻译**: Linux 在第 9 章描述的传统 UNIX 调度的基础上，通过添加两个额外的调度类（SCHED_FIFO 和 SCHED_RR）来适应 __________ 调度。

**答案**: **real-time (或 soft real-time)**

**解析**: 这两个 POSIX 调度策略是专为实时系统应用（在 Linux 中主要体现为软实时任务）设计的。

**15. 题目**: On a uniprocessor system running W2K, if there is more than one thread at the highest priority level, then the processor is utilized in a __________ fashion amongst the available threads at that highest priority level.

**翻译**: 在运行 W2K 的单处理器系统上，如果在最高优先级上有多个线程，那么处理器将在该最高优先级上的可用线程之间以 __________ 方式被利用。

**答案**: **round-robin**

**解析**: 当多个具有相同优先级的线程处于就绪状态且它是全系统最高优先级时，Windows 分派器会在它们之间通过时间片轮转（Round-Robin）的方式进行调度。