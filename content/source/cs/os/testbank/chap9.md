---
title: Chap. 9
order: 9
---

# Chapter 9 Uniprocessor Scheduling

## True / False Questions (是非题)

**1. Scheduling affects the performance of a system because it determines which processes will wait and which will progress.**
*   **中文翻译**：调度会影响系统的性能，因为它决定了哪些进程需要等待，哪些进程可以继续执行。
*   **答案**：True
*   **解析**：
    *   **Concept Check (概念检查)**：调度的核心目的是在多道程序环境中分配处理器资源。
    *   **The 'Why' (为什么)**：系统性能（如吞吐量、响应时间）直接受进程队列管理的影响，调度决定了进程状态的转换。
    *   **Common Pitfalls (常见陷阱)**：不要误以为调度只是简单的“排队”，它实际上是决定系统整体效率的核心机制。

**2. The short-term scheduler may limit the degree of multiprogramming to provide satisfactory service to the current set of processes.**
*   **中文翻译**：短期调度程序可能会限制多道程序设计的程度，以向当前进程集提供令人满意的服务。
*   **答案**：False
*   **解析**：
    *   **Concept Check (概念检查)**：操作系统的三级调度：长期调度（Long-term）、中期调度（Medium-term）和短期调度（Short-term）。
    *   **The 'Why' (为什么)**：控制多道程序设计程度（Degree of Multiprogramming）的是**长期调度程序**（决定接纳多少新进程）和**中期调度程序**（决定多少进程驻留主存）。短期调度（分派器）只负责在当前“就绪”进程中挑一个执行。
    *   **Common Pitfalls (常见陷阱)**：极易混淆三种调度的职责。记住：长期管“门槛”，中期管“内外（内存/外存）”，短期管“上CPU”。

**3. Medium-term scheduling is part of the system swapping function.**
*   **中文翻译**：中期调度是系统交换（Swapping）功能的一部分。
*   **答案**：True
*   **解析**：
    *   **Concept Check (概念检查)**：中期调度决定将哪些进程部分或全部换入（Swap-in）或换出（Swap-out）主存。
    *   **The 'Why' (为什么)**：通过交换，中期调度能够有效管理主存空间和多道程序设计的程度，当内存不足时将进程挂起至磁盘。

**4. The long-term scheduler is invoked whenever an event occurs that may lead to the suspension or preemption of the currently running process.**
*   **中文翻译**：每当发生可能导致当前运行进程挂起或被抢占的事件时，都会调用长期调度程序。
*   **答案**：False
*   **解析**：
    *   **Concept Check (概念检查)**：调度触发的时机。
    *   **The 'Why' (为什么)**：处理中断、挂起或抢占等频繁发生的事件时，调用的是**短期调度程序 (Short-term scheduler)**。长期调度只有在作业/进程创建时才被偶尔调用。

**5. The main objective of short-term scheduling is to allocate processor time in such a way as to optimize one or more aspects of system behavior.**
*   **中文翻译**：短期调度的主要目标是以优化系统行为的一个或多个方面的方式来分配处理器时间。
*   **答案**：True
*   **解析**：
    *   **Concept Check (概念检查)**：短期调度标准（Scheduling Criteria），如响应时间、周转时间、吞吐量等。
    *   **The 'Why' (为什么)**：分派CPU资源时，必须基于某种策略（如FCFS、SPN）来最大化CPU利用率或最小化用户等待时间。

**6. One problem with a pure priority scheduling scheme is that lower-priority processes may suffer deadlock.**
*   **中文翻译**：纯优先级调度方案的一个问题是，较低优先级的进程可能会遭受死锁。
*   **答案**：False
*   **解析**：
    *   **Concept Check (概念检查)**：死锁 (Deadlock) 与饥饿 (Starvation) 的区别。
    *   **The 'Why' (为什么)**：低优先级进程因为一直有高优先级进程抢占CPU而无法运行，这叫做**饥饿 (Starvation)**，而不是死锁。死锁通常指多个进程互相等待对方持有的资源而永远僵持。
    *   **Common Pitfalls (常见陷阱)**：把“一直等不到资源”一律叫死锁。死锁是“互相等”，饥饿是“单方面一直被插队”。

**7. The selection function determines which process, among ready processes, is selected next for execution.**
*   **中文翻译**：选择函数（Selection function）决定在就绪进程中选择哪一个进行下一次执行。
*   **答案**：True
*   **解析**：
    *   **Concept Check (概念检查)**：调度算法的两个核心维度：选择函数 (Selection Function) 和决策模式 (Decision Mode，如抢占/非抢占)。
    *   **The 'Why' (为什么)**：选择函数通过某种评估（如等待时间长短、所需服务时间长短）挑选出胜出者。

**8. First-come-first-served (FCFS) is a simple scheduling policy that tends to favor I/O-bound processes over processor bound processes.**
*   **中文翻译**：先来先服务（FCFS）是一种简单的调度策略，它倾向于偏好 I/O 密集型进程，而不是处理器密集型进程。
*   **答案**：False
*   **解析**：
    *   **Concept Check (概念检查)**：FCFS对不同类型进程的公平性。
    *   **The 'Why' (为什么)**：FCFS 实际上偏好**处理器密集型 (Processor-bound)** 进程。因为非抢占式的特性，一个长CPU密集型进程一旦获取CPU就会一直运行，导致后面短的 I/O 密集型进程长时间等待，极大降低了 I/O 设备的利用率。

**9. Round Robin is a scheduling technique is also known as time slicing, because each process is given a slice of time before being preempted.**
*   **中文翻译**：轮转（Round Robin）是一种调度技术，也称为时间片轮转（time slicing），因为每个进程在被抢占之前都会被分配一个时间片。
*   **答案**：True
*   **解析**：
    *   **Concept Check (概念检查)**：Round Robin (RR) 的基本原理。
    *   **The 'Why' (为什么)**：为防止长进程霸占CPU，系统设置一个固定的时间量子 (Time Quantum)，时间一到强制切走，这就是 Time Slicing。

**10. The Shortest Process Next (SPN) scheduling policy is often used for time-sharing and transaction processing environments because of the lack of preemption.**
*   **中文翻译**：由于缺乏抢占性，最短进程优先（SPN）调度策略通常用于分时和事务处理环境。
*   **答案**：False
*   **解析**：
    *   **Concept Check (概念检查)**：不同调度环境的需求。
    *   **The 'Why' (为什么)**：分时和交互式环境**必须**具有抢占性（如Round Robin），以保证用户的响应时间。SPN是**非抢占式**的，会导致长进程一旦执行就不会被中断，无法满足分时环境对快速响应的要求。

**11. The Shortest Remaining Time (SRT) scheduling policy is a preemptive version of the Shortest Process Next (SPN) scheduling policy.**
*   **中文翻译**：最短剩余时间（SRT）调度策略是最短进程优先（SPN）调度策略的抢占式版本。
*   **答案**：True
*   **解析**：
    *   **Concept Check (概念检查)**：SRT与SPN的联系与区别。
    *   **The 'Why' (为什么)**：SPN是在CPU空闲时挑最短的执行且不可剥夺；SRT不仅挑最短的，如果新来的进程比当前进程剩余的时间还短，它会**剥夺（Preempt）**当前进程。

**12. In the Highest Response Ratio Next (HRRN) scheduling policy, longer jobs are favored, because they yield a larger ratio from the smaller denominator in the equation.**
*   **中文翻译**：在最高响应比优先（HRRN）调度策略中，较长的作业更受偏好，因为它们在公式中由较小的分母产生较大的比率。
*   **答案**：False
*   **解析**：
    *   **Concept Check (概念检查)**：响应比公式 $R = (w + s) / s$，其中 $w$ 是等待时间，$s$ 是预期的服务时间（作业长度）。
    *   **The 'Why' (为什么)**：公式中分母是 $s$。当 $s$ 较**小**（意味着是**短作业**）时，分数才更大。因此HRRN是偏好短作业的，但随着 $w$（等待时间）的增加，长作业的响应比也会提高，从而避免了长作业饥饿。

**13. A disadvantage of simulation is that results for a given “run” only apply to that particular collection of processes under that particular set of assumptions.**
*   **中文翻译**：模拟的一个缺点是，给定“运行”的结果仅适用于该特定假设集下的特定进程集合。
*   **答案**：True
*   **解析**：
    *   **Concept Check (概念检查)**：模拟建模（Simulation Modeling）的局限性。
    *   **The 'Why' (为什么)**：模拟使用的是特制的随机数和特定的概率分布。因此，结论往往只对本次输入的特征集有效，缺乏像数学分析模型那样普适的解析解。

**14. In “fair share” scheduling, each user is assigned a weighting of some sort that defines that user’s share of system resources as a fraction of the total usage of those resources.**
*   **中文翻译**：在“公平共享（fair share）”调度中，会为每个用户分配某种权重，该权重定义了该用户在系统资源总使用量中所占的份额。
*   **答案**：True
*   **解析**：
    *   **Concept Check (概念检查)**：Fair-share Scheduling 的资源分配理念。
    *   **The 'Why' (为什么)**：在多用户系统中，有时不仅需要考虑进程级别的公平，还需要考虑“用户（或进程组）”级别的公平，所以按照用户权重分配 CPU 时间是 Fair-share 的核心。

**15. The traditional UNIX scheduler, such as those used in SVR3 and 4.3 BSD UNIX systems, employs single level feedback using round robin.**
*   **中文翻译**：传统的 UNIX 调度程序（例如在 SVR3 和 4.3 BSD UNIX 系统中使用的调度程序）采用使用轮转的单级反馈。
*   **答案**：False
*   **解析**：
    *   **Concept Check (概念检查)**：传统 UNIX 调度的机制。
    *   **The 'Why' (为什么)**：传统 UNIX 使用的是**多级反馈队列（Multilevel Feedback）**，它将进程划分为不同的固定优先级带（如 Swapper, Block I/O, User processes等），并在带内进行轮转。

---

## Multiple Choice Questions (选择题)

**1. The type of scheduling that involves the decision to add a process to those that are at least partially in main memory and therefore available for execution is referred to as:**
a. Long-term scheduling  b. Medium-term scheduling  c. I/O scheduling  d. None of the above
*   **中文翻译**：决定将进程添加到至少部分驻留在主存中，因此可以被执行的进程池中的调度类型被称为：
    a. 长期调度  b. 中期调度  c. I/O 调度  d. 以上皆非
*   **答案**：b
*   **解析**：
    *   **Concept Check (概念检查)**：三级调度体系。
    *   **The 'Why' (为什么)**：将部分或全部映像载入“主存（Main Memory）”，这是内存管理中交换（Swapping-in）功能的一部分，属于**中期调度 (Medium-term scheduling)**。

**2. The decision as to which job to admit to the system next can be based on which of the following criteria:**
a. Simple FIFO  b. Priority  c. I/O requirements  d. All of the above
*   **中文翻译**：关于接下来接纳哪个作业进入系统的决定，可以基于以下哪些标准：
    a. 简单先进先出 (FIFO)  b. 优先级  c. I/O 需求  d. 以上皆是
*   **答案**：d
*   **解析**：
    *   **Concept Check (概念检查)**：长期调度（作业调度）的准入策略。
    *   **The 'Why' (为什么)**：接纳作业时不仅可以按排队顺序，也可以考虑优先级，甚至是I/O和CPU的平衡（混合I/O密集与CPU密集型以最大化利用率），因此所有策略都可以应用。

**3. Typically, the swapping-in function for processes is based on the need to manage:**
a. Process priorities  b. Virtual memory  c. The degree of multiprogramming  d. None of the above
*   **中文翻译**：通常，进程的换入（swapping-in）功能是基于管理什么的需求：
    a. 进程优先级  b. 虚拟内存  c. 多道程序设计的程度  d. 以上皆非
*   **答案**：c
*   **解析**：
    *   **Concept Check (概念检查)**：中期调度的目的。
    *   **The 'Why' (为什么)**：换出是为了腾出内存，换入（Swapping-in）是为了维持当前在内存中活跃竞跑的进程数量，即**多道程序设计的程度 (Degree of multiprogramming)**。

**4. In terms of frequency of execution, the short-term scheduler is usually the one that executes:**
a. Most frequently  b. Least frequently  c. About the same as the other schedulers  d. None of the above
*   **中文翻译**：就执行频率而言，短期调度程序通常是：
    a. 执行最频繁的  b. 执行最不频繁的  c. 与其他调度程序差不多  d. 以上皆非
*   **答案**：a
*   **解析**：
    *   **Concept Check (概念检查)**：各级调度器的工作频率。
    *   **The 'Why' (为什么)**：短期调度（分派器）需要在每次时钟中断、I/O中断、系统调用等可能导致CPU易手的时刻被调用，因此是执行**最频繁 (Most frequently)** 的调度程序。

**5. Response time in an interactive system is an example of:**
a. System-oriented criteria for short-term scheduling policies
b. User-oriented criteria for short-term scheduling policies
c. System-oriented criteria for long-term scheduling policies
d. None of the above
*   **中文翻译**：交互式系统中的响应时间是以下的例子：
    a. 面向系统的短期调度策略标准
    b. 面向用户的短期调度策略标准
    c. 面向系统的长期调度策略标准
    d. 以上皆非
*   **答案**：b
*   **解析**：
    *   **Concept Check (概念检查)**：调度标准分类 (User-oriented vs. System-oriented)。
    *   **The 'Why' (为什么)**：**响应时间 (Response time)** 和 **周转时间 (Turnaround time)** 是用户最直接能感受到的性能指标，因此属于**面向用户 (User-oriented)** 的标准；而吞吐量、CPU利用率则属于面向系统的标准。

**6. A typical way to overcome starvation of lower-priority processes in a priority-based scheduling system is to:**
a. Change a process priority randomly
b. Change a process priority with its age
c. Round-robin cycling of processes in a priority queue
d. All of the above
*   **中文翻译**：在基于优先级的调度系统中，克服低优先级进程饥饿的典型方法是：
    a. 随机改变进程优先级
    b. 随进程年龄（等待时间）改变优先级
    c. 对优先级队列中的进程进行轮转循环
    d. 以上皆是
*   **答案**：b
*   **解析**：
    *   **Concept Check (概念检查)**：老化技术（Aging）。
    *   **The 'Why' (为什么)**：解决优先级调度引发的饥饿问题的最佳方式就是**老化 (Aging)**，即随着进程在就绪队列中等待时间的增长（年龄变大），逐渐提升其优先级，最终它总能获得CPU。

**7. Which of the following scheduling policies allow the O/S to interrupt the currently running process and move it to the Ready state?**
a. Preemptive  b. Non-Preemptive  c. First-come-first-served  d. None of the above
*   **中文翻译**：以下哪种调度策略允许操作系统中断当前运行的进程并将其移动到就绪状态？
    a. 抢占式 (Preemptive)  b. 非抢占式 (Non-Preemptive)  c. 先来先服务 (FCFS)  d. 以上皆非
*   **答案**：a
*   **解析**：
    *   **Concept Check (概念检查)**：决策模式（Decision Mode）。
    *   **The 'Why' (为什么)**：定义就是**抢占式 (Preemptive)**：操作系统有权强行剥夺正在运行进程的CPU使用权，以分配给另一个（往往是优先级更高或时间片已到的）进程。

**8. In terms of the queuing model, the total time that a process spends in a system (waiting time plus service time) is called:**
a. Normalized turnaround time (TAT)  b. Finish time (FT)  c. Turnaround or residence time (TAT)  d. None of the above
*   **中文翻译**：在排队模型中，一个进程在系统中花费的总时间（等待时间加上服务时间）被称为：
    a. 归一化周转时间  b. 完成时间  c. 周转时间或驻留时间  d. 以上皆非
*   **答案**：c
*   **解析**：
    *   **Concept Check (概念检查)**：性能评估的时间指标。
    *   **The 'Why' (为什么)**：驻留时间 (Residence time) 或 **周转时间 (Turnaround time)** 指的是一个任务从进入系统到完成并离开系统的总时长，包括了在就绪队列里排队等待的时间以及真正在CPU上运行的服务时间。

**9. In the Round Robin scheduling technique, the principle design issue is:**
a. Determining the fair distribution of time quanta to individual processes
b. Determining the method of cycling through a given set of processes
c. Determining the length of the time quantum
d. None of the above
*   **中文翻译**：在轮转 (Round Robin) 调度技术中，主要的系统设计问题是：
    a. 确定向各个进程公平分配时间片
    b. 确定循环遍历给定进程集的方法
    c. 确定时间片（quantum）的长度
    d. 以上皆非
*   **答案**：c
*   **解析**：
    *   **Concept Check (概念检查)**：Round Robin (RR) 算法的设计。
    *   **The 'Why' (为什么)**：RR算法唯一且最重要的参数就是**时间片的大小 (length of the time quantum)**。如果时间片太大，RR退化为FCFS；如果时间片太小，上下文切换（Context Switch）造成的开销将严重拖垮系统性能。

**10. One difficulty with the Shortest Process Next (SPN) scheduling technique is:**
a. The need to know or estimate required processing times for each process
b. The starvation of longer processes
c. The lack of preemption
d. All of the above
*   **中文翻译**：最短进程优先（SPN）调度技术的一个困难在于：
    a. 需要知道或估计每个进程所需的处理时间
    b. 长进程的饥饿
    c. 缺乏抢占
    d. 以上皆是
*   **答案**：d
*   **解析**：
    *   **Concept Check (概念检查)**：SPN算法的缺点。
    *   **The 'Why' (为什么)**：SPN是非抢占的（缺乏抢占），它会导致系统响应不佳；它绝对偏好短进程，因此不断涌入的短任务会导致长任务饿死（长进程饥饿）；最致命的是它在做决策时必须预先知道任务有多长，而在现实中这需要极其复杂的指数平均预测（需要估计时间）。所以三个选项都是它的短板。

**11. One difficulty with the Shortest Remaining Time (SRT) scheduling technique is:**
a. The need to know or estimate required processing times for each process
b. The starvation of shorter processes
c. The lack of preemption
d. All of the above
*   **中文翻译**：最短剩余时间（SRT）调度技术的一个困难在于：
    a. 需要知道或估计每个进程所需的处理时间
    b. 短进程的饥饿
    c. 缺乏抢占
    d. 以上皆是
*   **答案**：a
*   **解析**：
    *   **Concept Check (概念检查)**：SRT算法的特性与局限性。
    *   **The 'Why' (为什么)**：首先，SRT **具有** 抢占性（排除c）。其次，SRT偏好短进程，所以它会导致**长进程饥饿**，而不是短进程饥饿（排除b）。它唯一符合选项的难点和 SPN 一样，就是操作系统必须事先预测或知道进程到底需要执行多长时间。

**12. Which of the following scheduling policies require prior knowledge or estimation of process length:**
a. Shortest Remaining Time (SRT)  b. Shortest Process Next (SPN)  c. Highest Response Ratio Next (HRRN)  d. All of the above
*   **中文翻译**：以下哪种调度策略需要事先知道或估计进程长度：
    a. SRT  b. SPN  c. HRRN  d. 以上皆是
*   **答案**：d
*   **解析**：
    *   **Concept Check (概念检查)**：基于处理时间调度的算法共性。
    *   **The 'Why' (为什么)**：SPN挑总时间最短的，SRT挑剩余时间最短的，HRRN需要预估执行时间 $s$ 来计算响应比 $R=(w+s)/s$。这三种策略底层都极度依赖对执行时间的预测。

**13. It is impossible to make definitive comparisons of various scheduling policies due to dependence on factors such as:**
a. The probability distribution of service times of the various processes
b. The efficiency of the scheduling and context switching mechanisms
c. The nature of the I/O demand and performance of the I/O subsystem
d. All of the above
*   **中文翻译**：由于依赖以下因素，不可能对各种调度策略进行确定的（绝对的）比较：
    a. 各种进程服务时间的概率分布
    b. 调度和上下文切换机制的效率
    c. I/O需求的性质和I/O子系统的性能
    d. 以上皆是
*   **答案**：d
*   **解析**：
    *   **Concept Check (概念检查)**：调度算法性能评估的复杂性。
    *   **The 'Why' (为什么)**：在真实操作系统中，脱离具体的使用场景（如I/O情况、上下文切换硬件开销、任务到达分布）空谈哪种调度算法最优秀毫无意义，必须结合具体环境。

**14. The strategy that schedules processes based on their group affiliation is generally referred to as:**
a. Queuing analysis  b. Simulation modeling  c. Fair share scheduling  d. All of the above
*   **中文翻译**：基于进程的组属关系来调度进程的策略通常被称为：
    a. 排队分析  b. 模拟建模  c. 公平共享调度  d. 以上皆非
*   **答案**：c
*   **解析**：
    *   **Concept Check (概念检查)**：Fair-share Scheduling 的概念。
    *   **The 'Why' (为什么)**：当我们将同一用户（或同一部门）的多个进程绑定为一个Group，并基于组分配CPU权重时，这种在用户组层面而非单进程层面体现公平的调度就是**公平共享调度 (Fair Share Scheduling)**。

**15. The traditional UNIX scheduler divides processes into fixed bands of priority levels, with the highest priority band being the:**
a. Swapper band  b. File manipulation band  c. User process band  d. None of the above
*   **中文翻译**：传统 UNIX 调度程序将进程划分为固定优先级级别的带（bands），其中最高优先级带是：
    a. 交换程序带 (Swapper band)  b. 文件操作带  c. 用户进程带  d. 以上皆非
*   **答案**：a
*   **解析**：
    *   **Concept Check (概念检查)**：传统 UNIX SVR3/4.3 BSD 的多级反馈队列带划分。
    *   **The 'Why' (为什么)**：为了系统整体性能，传统UNIX严格划分优先级层次，其中管理系统底层内存流转的 **交换程序带 (Swapper band)** 拥有最高优先级，其次是块设备I/O控制，最后才是普通的用户进程带 (User process band)。

---

## Fill-In-The-Blank Questions (填空题)

**1. The task of assigning processes to the processor or processors over time, in a way that meets system objectives is called _________.**
*   **中文翻译**：随着时间的推移，以满足系统目标的方式将进程分配给一个或多个处理器的任务被称为_________。
*   **答案**：processor scheduling (处理器调度)
*   **解析**：这是调度的标准定义。

**2. The decision as to when to create a new process is generally driven by the desired degree of _________.**
*   **中文翻译**：关于何时创建新进程的决策通常由所需的_________程度所驱动。
*   **答案**：multiprogramming (多道程序设计)
*   **解析**：长期调度负责控制接纳的新进程数量，核心目的就是控制内存中并发进程的总量（多道程序设计度）。

**3. _________-term scheduling is part of the system swapping function.**
*   **中文翻译**：_________期调度是系统交换功能的一部分。
*   **答案**：Medium (中)
*   **解析**：中期调度控制进程在内存和外存之间的调入与调出。

**4. The _________-term scheduler is invoked whenever an event occurs that may lead to the suspension or preemption of the currently running process.**
*   **中文翻译**：每当发生可能导致当前运行进程挂起或被抢占的事件时，就会调用_________期调度程序。
*   **答案**：short (短)
*   **解析**：也就是分派器（Dispatcher），它在发生时钟中断、I/O中断等非常频繁的底层事件时触发。

**5. Response time and throughput are examples of _________-related criteria for short-term scheduling.**
*   **中文翻译**：响应时间和吞吐量是短期调度的与_________相关标准的例子。
*   **答案**：performance (性能)
*   **解析**：调度准则主要分为系统/用户导向（System-oriented vs. User-oriented）和与性能相关/无关（Performance-related vs. Non-performance-related）。这两个指标直接反映系统效能。

**6. In a system employing priority scheduling, the scheduler always selects the process with the _________ priority level for processing.**
*   **中文翻译**：在使用优先级调度的系统中，调度程序总是选择具有_________优先级级别的进程进行处理。
*   **答案**：highest (最高)
*   **解析**：显而易见，调度器始终从队列中挑最高优先级执行。

**7. The _________, which has two general categories, specifies the instants in time at which the selection function is exercised.**
*   **中文翻译**：包含两大类的_________，指定了在何时执行选择函数的时刻。
*   **答案**：decision mode (决策模式)
*   **解析**：Decision Mode 决定了操作系统什么时候去剥夺CPU使用权，两大类即为抢占式 (Preemptive) 和非抢占式 (Non-preemptive)。

**8. In terms of the queuing model, the total time that a process spends in a system (waiting time plus service time) is called the _________.**
*   **中文翻译**：在排队模型中，一个进程在系统中花费的总时间（等待时间加上服务时间）被称为_________。
*   **答案**：turnaround time (或 residence time) (周转时间 / 驻留时间)
*   **解析**：这在计算系统各项评价指标时极其重要。

**9. The Round Robin scheduling technique is also known as _________, because each process is given a set amount of processor time before being preempted.**
*   **中文翻译**：轮转 (Round Robin) 调度技术也称为_________，因为每个进程在被抢占之前都被赋予了一定数量的处理器时间。
*   **答案**：time slicing (时间片轮转 / 时间分片)
*   **解析**：通过固定的时间片（Quantum）来轮流交替执行机制。

**10. _________ is a scheduling policy in which the process with the shortest expected processing time is selected next, but there is no preemption.**
*   **中文翻译**：_________是一种调度策略，其中接下来选择预期处理时间最短的进程，但没有抢占。
*   **答案**：Shortest process next 或 SPN (最短进程优先)
*   **解析**：区别于抢占版的SRT。

**11. _________ is a scheduling policy in which the process with the shortest expected processing time is selected next, and if a shorter process becomes ready in the system, the currently running process is preempted.**
*   **中文翻译**：_________是一种调度策略，其中接下来选择预期处理时间最短的进程，并且如果系统中有更短的进程就绪，则当前正在运行的进程将被抢占。
*   **答案**：Shortest remaining time 或 SRT (最短剩余时间)
*   **解析**：SPN的抢占版，极其偏好短任务，并提供良好的响应特性，但容易导致长任务饥饿。

**12. A scheduling mechanism that requires no prior knowledge of process length, yet can nevertheless favor shorter jobs, is known as the _________ scheduling mechanism.**
*   **中文翻译**：一种不需要事先知道进程长度，但仍然可以偏好较短作业的调度机制被称为_________调度机制。
*   **答案**：feedback (反馈 / 多级反馈队列)
*   **解析**：Feedback 将进程在多个不同时间片长度的优先级队列中降级流转。短任务会在最初的小时间片高优先级队列中迅速完成，而长任务会“沉底”，完美做到不知长短也能优待短任务。

**13. Some of the difficulties of analytic modeling are overcome by using _________, which allows a wide range of policies to be modeled.**
*   **中文翻译**：通过使用_________克服了解析建模的一些困难，它允许对广泛的策略进行建模。
*   **答案**：simulation (模拟 / 模拟建模)
*   **解析**：面对排队论和数学推导解决不了的复杂调度场景，通过跑代码做随机模拟（Simulation）是直观的手段。

**14. In _________ scheduling, each user is assigned a weighting of some sort that defines that user’s share of system resources as a fraction of the total usage of those resources.**
*   **中文翻译**：在_________调度中，为每个用户分配某种权重，该权重定义了该用户在系统资源总使用量中所占的份额。
*   **答案**：fair share (公平共享)
*   **解析**：面向用户群组维度的调度方法。

**15. The traditional UNIX scheduler, such as those used in SVR3 and 4.3 BSD UNIX systems, divides processes into fixed _________ of priority levels.**
*   **中文翻译**：传统的 UNIX 调度程序（例如在 SVR3 和 4.3 BSD UNIX 系统中使用的那些）将进程划分为固定优先级级别的_________。
*   **答案**：bands (带)
*   **解析**：如前述，划分为 Swapper band, User process band 等优先级固定带。