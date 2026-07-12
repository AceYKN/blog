---
title: Chap. 5
order: 5
---

# Chapter 5 - Concurrency: Mutual Exclusion and Synchronization

## True / False Questions (判断题)

**1. 题目**: Distributed processing can be defined as the management of multiple processes executing on multiple, distributed computer systems.

**翻译**: 分布式处理可以被定义为对在多个分布式计算机系统上执行的多个进程的管理。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 并发（Concurrency）的上下文。

*   **详解**: 并发出现在三种不同的上下文中：多应用程序（Multiple applications）、结构化应用程序（Structured applications）和操作系统结构（OS structure）。而在硬件层面，它可以运行在单处理器、多处理器以及**分布式处理（Distributed processing）**系统中。分布式处理正是指管理在多个物理上分离的计算机节点上执行的多个进程。

**2. 题目**: Both process interleaving and process overlapping are examples of concurrent processes and both present the same basic problems.

**翻译**: 进程交替（interleaving）和进程重叠（overlapping）都是并发进程的例子，并且它们都呈现出相同的基本问题。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 并发的特性。

*   **详解**: 在单处理器系统中，并发表现为进程的交替执行（Interleaving）；在多处理器系统中，并发表现为进程的重叠执行（Overlapping）。尽管物理执行方式不同，但由于它们都可以以不可预测的相对速度运行并共享资源，因此它们面临着完全相同的基本同步和互斥问题。

**3. 题目**: Concurrency issues are a concern on multiprocessor systems, but do not impact uniprocessor systems.

**翻译**: 并发问题是多处理器系统中的一个隐患，但不会影响单处理器系统。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 单处理器中的并发。

*   **详解**: 即使在单处理器系统中，由于进程的交替执行（Interleaving）被中断机制打断，一个进程在更新共享变量的中间状态时可能会被挂起，另一个进程随之介入，这同样会导致严重的数据不一致和并发问题。

**4. 题目**: Starvation refers to the situation where competing processes are denied access to a resource due to scheduling problems.

**翻译**: 饥饿（Starvation）指的是竞争进程由于调度问题而被拒绝访问资源的情况。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 饥饿的定义。

*   **详解**: 当三个或更多进程竞争资源时，如果某两个或多个进程不断地互相交替获得资源，导致另一个处于等待状态的进程无限期地被调度器“忽略”，从而永远得不到执行机会，这种情况就称为饥饿。

**5. 题目**: Any facility or capability that is to provide support for mutual exclusion must make certain assumptions about relative process speeds and the number of processors in the system.

**翻译**: 任何提供互斥支持的设施或能力都必须对相对进程速度和系统中处理器的数量做出一定的假设。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 互斥（Mutual Exclusion）的必要条件。

*   **详解**: 教科书中明确列出了互斥机制必须满足的六个条件，其中之一就是：**绝不能对相对的进程执行速度或处理器的数量做任何假设（No assumptions can be made about relative process speeds or number of processors）**。互斥机制必须在任何情况下都坚如磐石。

**6. 题目**: Peterson's Algorithm for solving mutual exclusion is only valid for two processes and cannot be generalized to the case of n processes.

**翻译**: 用于解决互斥问题的 Peterson 算法仅对两个进程有效，不能推广到 n 个进程的情况。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 软件互斥解决方案（Peterson's Algorithm）。

*   **详解**: Peterson 算法最初是为了优雅地解决两个进程的互斥问题而设计的，但它在理论上是可以被扩展并推广到解决 $n$ 个进程的互斥问题的（尽管在实际现代系统中我们通常倾向于使用硬件原语或信号量，因为推广后的软件算法开销较大）。

**7. 题目**: In a uniprocessor machine, concurrent processes cannot be overlapped; they can only be interleaved.

**翻译**: 在单处理器机器中，并发进程不能重叠；它们只能交替执行。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 单处理器 vs 多处理器并发。

*   **详解**: 因为单处理器（Uniprocessor）在任何一个给定的物理时刻只能执行一条指令，所以多个进程只能通过时间片轮转进行上下文切换（交替执行），无法像在多核系统上那样真正地在同一时刻一起执行（重叠执行）。

**8. 题目**: Weak semaphores guarantee freedom from starvation, but strong semaphores do not.

**翻译**: 弱信号量（Weak semaphores）保证免于饥饿，但强信号量（strong semaphores）不能。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 信号量（Semaphores）的分类。

*   **详解**: 完全说反了。**强信号量（Strong semaphores）**要求被阻塞的进程队列遵循先进先出（FIFO）原则，因此保证了排队的进程最终一定会得到资源，从而**避免饥饿**。而**弱信号量（Weak semaphores）**对阻塞队列的唤醒顺序没有规定，因此可能会导致某个进程被无限期滞留（发生饥饿）。

**9. 题目**: A finite circular buffer and an infinite buffer are two ways to implement a data storage area for the classic Producer/Consumer Problem.

**翻译**: 有限循环缓冲区和无限缓冲区是为经典的生产者/消费者问题实现数据存储区的两种方法。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 生产者/消费者问题（Producer/Consumer Problem）。

*   **详解**: 教科书中在探讨生产者/消费者问题时，针对共享缓冲区的设计给出了两种经典的理论场景：一种是无限大缓冲区（不需要考虑缓冲区满的问题），另一种是更符合实际情况的有限循环缓冲区（需要同时处理缓冲区空和缓冲区满的同步问题）。

**10. 题目**: The major difficulty with semaphores is that wait and signal operations may be scattered throughout a program and it is difficult to see the overall effect of these operations on the semaphores they affect.

**翻译**: 信号量的主要困难在于 wait 和 signal 操作可能散布在整个程序中，很难看出这些操作对它们所影响的信号量的整体效果。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 信号量的缺点与管程（Monitors）的引入动机。

*   **详解**: 信号量非常强大且灵活，但这也是它的致命弱点。程序员必须小心翼翼地在代码的各个地方配对使用 `wait`（P操作）和 `signal`（V操作），一旦漏掉一个或顺序写反，就会导致死锁或互斥失效。这种分散性使得程序极难调试和证明正确性，这也促使了**管程（Monitor）**这种更高级的结构化同步机制的诞生。

**11. 题目**: Message passing provides both synchronization and communication, which are fundamental requirements for interacting processes.

**翻译**: 消息传递（Message passing）同时提供了同步和通信功能，这是交互进程的基本要求。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 消息传递（Message Passing）。

*   **详解**: 消息传递机制非常优雅，它将互斥（通过阻塞接收等同步机制实现）和数据交换（通信）合二为一，使得它在分布式系统、共享内存多处理器和单处理器系统中都非常适用。

**12. 题目**: In a message passing system, one queuing discipline alternative is to allow the receiver to inspect the message queue and select which message to receive next.

**翻译**: 在消息传递系统中，一种队列规则的替代方案是允许接收者检查消息队列并选择下一步接收哪条消息。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 消息队列的管理。

*   **详解**: 虽然最简单的队列规则是 FIFO（先进先出），但许多消息传递系统允许基于优先级或者消息类型进行选择性接收（Selective Receipt）。接收者可以检查邮箱/队列，并根据特定的条件（如发件人ID或消息标签）提取消息。

**13. 题目**: In the communications mechanism of a message passing system, only the receiver of the communication can be blocking.

**翻译**: 在消息传递系统的通信机制中，只有通信的接收者可以被阻塞（blocking）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 消息传递的同步类型。

*   **详解**: 消息传递分为阻塞（Blocking）和非阻塞（Non-blocking）。不仅仅是接收者可以被阻塞（等待消息到来），**发送者同样也可以被阻塞**（例如：Blocking Send要求发送者阻塞，直到接收者确实收到了该消息）。

**14. 题目**: In indirect addressing, as applied to message passing, messages are sent to a temporary shared data structure typically known as a mailbox.

**翻译**: 在应用于消息传递的间接寻址中，消息被发送到一个通常被称为邮箱（mailbox）的临时共享数据结构中。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 消息传递的寻址方式（Indirect Addressing）。

*   **详解**: 与直接寻址（明确指定目标进程ID）不同，间接寻址（Indirect Addressing）解耦了发送方和接收方。发送方将消息发往一个称为**邮箱（Mailbox）或端口（Port）**的共享结构，接收方从中读取，这支持了一对多、多对一等复杂的通信模式。

**15. 题目**: The Producer/Consumer problem is typically considered a special case of the Readers/Writes problem, with only one reader and one writer.

**翻译**: 生产者/消费者问题通常被认为是读者/写者问题的一个特例，即只有一个读者和一个写者。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 读者/写者问题与生产者/消费者问题的区别。

*   **详解**: 它们有本质区别。在读者/写者问题中，读者仅仅是“读取”数据，不会改变数据，因此允许多个读者同时访问。而在生产者/消费者问题中，消费者读取数据的同时实际上是将数据从缓冲区中“消耗（删除）”并修改指针，这是一种**写操作（写入状态）**。因此，不能将消费者简单等同于不改变数据的“读者”。

---

## Multiple Choice Questions (单选题)

**1. 题目**: Concurrency plays a major part in which of the following specific contexts:
a. Multiple applications
b. Structured applications
c. O/S structure
d. All of the above

**翻译**: 并发在以下哪些特定的上下文中扮演着主要角色：
a. 多应用程序（Multiple applications）
b. 结构化应用程序（Structured applications）
c. 操作系统结构（O/S structure）
d. 以上所有

**答案**: **d. All of the above**

**解析**: 根据教科书第一节“并发原理”，并发的概念适用于这三种上下文：允许多个应用程序分时运行、将单个应用程序设计为一组并发进程以实现模块化（Structured applications），以及将操作系统本身实现为一组并发的系统进程。

**2. 题目**: Examples of solutions to the concurrency problem that do not involve busy waiting are the following:
a. Semaphores and monitors
b. Message passing and caching
c. Producers and consumers
d. None of the above

**翻译**: 以下是不涉及忙等待（busy waiting）的并发问题解决方案的例子：
a. 信号量和管程（Semaphores and monitors）
b. 消息传递和缓存（Message passing and caching）
c. 生产者和消费者（Producers and consumers）
d. 以上都不是

**答案**: **a. Semaphores and monitors**

**解析**: 忙等待（如 Peterson 算法或基于自旋锁的硬件指令）会白白浪费 CPU 周期。而信号量（Semaphores）和管程（Monitors）通常基于操作系统的阻塞/唤醒机制实现，如果进程无法进入临界区，它会被挂起放入等待队列，从而避免了忙等待。

**3. 题目**: A basic echo procedure (that echoes a typed character to the screen) running on a multiprocessor system can produce erroneous output if:
a. Two processes deadlock while in the echo code
b. Access to the echo procedure is unsynchronized
c. Access to the echo procedure is synchronized
d. None of the above

**翻译**: 在多处理器系统上运行的基本回显程序（将键入的字符回显到屏幕）如果在以下情况下会产生错误的输出：
a. 两个进程在回显代码中发生死锁
b. 对回显程序的访问未同步（unsynchronized）
c. 对回显程序的访问已同步（synchronized）
d. 以上都不是

**答案**: **b. Access to the echo procedure is unsynchronized**

**解析**: 教科书中用了一个经典的 `echo` 程序的例子。如果两个进程并发且未同步地访问同一个 `echo` 函数（共享全局变量或输入/输出缓冲区），它们的指令可能会交错执行，导致字符被覆盖或打印混乱的错误输出。

**4. 题目**: In order to implement mutual exclusion on a critical resource for competing processes, only one program at a time should be allowed:
a. In the critical section of the program
b. To perform message passing
c. To Exhibit cooperation
d. None of the above

**翻译**: 为了对竞争进程的关键资源实施互斥，在同一时间只应允许一个程序：
a. 处于程序的临界区（critical section）中
b. 执行消息传递
c. 展现协作
d. 以上都不是

**答案**: **a. In the critical section of the program**

**解析**: 临界区（Critical Section）指的是访问共享资源的那段代码。互斥的核心原则就是确保任何时刻最多只能有一个进程在执行它自己的那段临界区代码。

**5. 题目**: The following requirement must be met by any facility or capability that is to provide support for mutual exclusion:
a. Only one process at a time can be allowed into a critical code section
b. A process remains in its critical code section for a finite time only
c. No assumptions can be made about relative process speeds
d. All of the above

**翻译**: 任何提供互斥支持的设施或能力都必须满足以下要求：
a. 一次只允许一个进程进入关键代码区
b. 进程在其关键代码区中只停留有限的时间
c. 不能对相对进程速度做任何假设
d. 以上所有

**答案**: **d. All of the above**

**解析**: 互斥的六大基本要求中包含了：必须强制互斥（a）、不能产生死锁或饥饿（意味着进程只能在临界区停留有限时间 b）、以及不能对处理器速度做假设（c）。故全选。

**6. 题目**: Processes that are designed to be able to pass execution control back and forth between themselves are referred to as:
a. Threads
b. Coroutines
c. Busy waiting processes
d. None of the above

**翻译**: 被设计为能够在彼此之间来回传递执行控制权的进程被称为：
a. 线程（Threads）
b. 协程（Coroutines）
c. 忙等待进程（Busy waiting processes）
d. 以上都不是

**答案**: **b. Coroutines**

**解析**: 协程（Coroutine）是一种程序组件，它们通过显式的移交控制权（如 yield 操作）在彼此之间协作切换。教科书在探讨并发机制（特别是消息传递或单线程内的并发逻辑）时提到了这种协作模型。

**7. 题目**: In a uniprocessor system, mutual exclusion can be guaranteed by:
a. Overlapping processes
b. Interleaving processes
c. Disabling interrupts
d. All of the above

**翻译**: 在单处理器系统中，互斥可以通过以下方式来保证：
a. 重叠进程
b. 交替进程
c. 禁用中断（Disabling interrupts）
d. 以上所有

**答案**: **c. Disabling interrupts**

**解析**: 在单处理器上，并发进程仅仅是通过被时钟中断等机制打断来实现交替执行的。如果在进程进入临界区前关闭系统中断（Disabling interrupts），那么该进程就不会被抢占，从而简单粗暴地保证了互斥（但不适用于多核系统，且代价高昂）。

**8. 题目**: A semaphore that does not specify the order in which processes are removed from the queue is called a:
a. Weak semaphore
b. Strong semaphore
c. Binary semaphore
d. None of the above

**翻译**: 未指定进程从队列中移除的顺序的信号量被称为：
a. 弱信号量（Weak semaphore）
b. 强信号量（Strong semaphore）
c. 二元信号量（Binary semaphore）
d. 以上都不是

**答案**: **a. Weak semaphore**

**解析**: 如前述判断题所述，不规定唤醒策略（如不保证 FIFO）的信号量称为弱信号量（Weak semaphore），可能导致饥饿。

**9. 题目**: The finite circular buffer is used to implement which of the following basic queuing strategies:
a. FILO
b. LIFO
c. FIFO
d. None of the above

**翻译**: 有限循环缓冲区用于实现以下哪种基本的队列策略：
a. 先进后出（FILO）
b. 后进先出（LIFO）
c. 先进先出（FIFO）
d. 以上都不是

**答案**: **c. FIFO**

**解析**: 在生产者/消费者模型中，有限循环缓冲区通过头指针（消费者读）和尾指针（生产者写）进行管理。最先被生产进入缓冲区的数据项总是最先被消费者取出，因此它实现的是先进先出（FIFO）队列。

**10. 题目**: A chief characteristic of a monitor is:
a. A maximum of two processes may be executing in a monitor at a time
b. Local data variables of the monitor are accessible by any procedure requesting use of the monitor
c. A process enters the monitor by invoking one of its procedures
d. All of the above

**翻译**: 管程（monitor）的主要特征是：
a. 最多可以有两个进程同时在管程中执行
b. 请求使用管程的任何过程都可以访问管程的局部数据变量
c. 进程通过调用管程的某个过程（procedure）来进入管程
d. 以上所有

**答案**: **c. A process enters the monitor by invoking one of its procedures**

**解析**: 
*   a 错误：管程的本质特性是任何时刻**最多只允许一个（ONE）**进程在管程内部执行。
*   b 错误：管程的局部数据变量是**私有**的，外部无法直接访问，只能通过管程提供的入口过程来操作。
*   c 正确：进程只有通过调用管程封装好、暴露给外部的特定入口函数（procedures）才能进入管程。

**11. 题目**: In synchronization involving message passing, the sender of a message can be:
a. Either blocking or non-blocking
b. Only blocking
c. Only non-blocking
d. All of the above

**翻译**: 在涉及消息传递的同步中，消息的发送者可以是：
a. 阻塞的或非阻塞的（Either blocking or non-blocking）
b. 仅阻塞的
c. 仅非阻塞的
d. 以上所有

**答案**: **a. Either blocking or non-blocking**

**解析**: 消息传递的发送原语（Send Primitive）有两种形式：阻塞发送（发送方挂起直到消息被接收方提取）和非阻塞发送（发送方把消息丢给系统后立刻继续执行后续代码）。

**12. 题目**: In a system employing message passing, when a message is sent to a shared temporary data structure, this general approach is known as:
a. Direct addressing
b. Indirect addressing
c. Blocking
d. None of the above

**翻译**: 在采用消息传递的系统中，当消息被发送到一个共享的临时数据结构时，这种通用方法被称为：
a. 直接寻址
b. 间接寻址（Indirect addressing）
c. 阻塞
d. 以上都不是

**答案**: **b. Indirect addressing**

**解析**: 发送到一个作为中介的临时数据结构（如邮箱 Mailbox），而不是直接指向目标进程的进程标识符，这就是间接寻址（Indirect Addressing）的定义。

**13. 题目**: In a system employing message passing, the typical message is divided into two primary sections:
a. Header and mailbox
b. Body and mailbox
c. Destination ID and Source ID
d. None of the above

**翻译**: 在采用消息传递的系统中，典型的消息分为两个主要部分：
a. 头部和邮箱
b. 正文和邮箱
c. 目的地 ID 和源 ID
d. 以上都不是

**答案**: **d. None of the above**

**解析**: 在典型的消息传递模型中，一条消息通常由**首部（Header）**和**主体（Body）**两部分组成。Header 包含了控制信息（如目标 ID、源 ID、消息长度、控制类型），Body 包含了实际的有效载荷数据。由于选项中没有提供 "Header and Body" 这一组合，故选 d。

**14. 题目**: The Reader/Writer problem requires that certain conditions be satisfied, such as:
a. Readers may read from the file while writers are writing to it
b. Multiple writers may write to the file simultaneously
c. Any number of readers may simultaneously read from the file
d. None of the above

**翻译**: 读者/写者问题要求满足某些条件，例如：
a. 读者可以在写者写入文件时读取该文件
b. 多个写者可以同时向文件写入
c. 任意数量的读者可以同时读取该文件
d. 以上都不是

**答案**: **c. Any number of readers may simultaneously read from the file**

**解析**: 读者/写者问题的基本约束条件是：
1. 允许多个读者（Any number of readers）同时读取共享数据区（因此 c 正确）。
2. 一次只允许一个写者（排斥其他任何写者和读者，因此 a 和 b 错误）。

**15. 题目**: A reason why the Producer/Consumer problem cannot be considered a special case of the Reader/Writer problem with a single writer (the producer) and a single reader (the consumer) is:
a. The producer and consumer must be both reader and writer
b. The consumer must perform writes while the reader performs reads
c. The Producer/Consumer problem doesn't deal with concurrency issues
d. None of the above

**翻译**: 为什么不能将生产者/消费者问题视为拥有单个写者（生产者）和单个读者（消费者）的读者/写者问题的特例，其原因是：
a. 生产者和消费者都必须同时是读者和写者
b. 消费者必须执行写操作，而读者执行读操作
c. 生产者/消费者问题不涉及并发问题
d. 以上都不是

**答案**: **a. The producer and consumer must be both reader and writer**

**解析**: 在缓冲区的操作中，消费者看似在“读取（消费）”数据，但实际上它必须调整队列的队头指针（或计数器），这是一次对共享状态的**写操作**。同理，生产者放入数据也是写操作。由于双方都在修改（Write）共享控制变量，这打破了单纯的“读者不修改任何状态”的前提，故 a 解释了这一本质差别。

---

## Fill-In-The-Blank Questions (填空题)

**1. 题目**: Many approaches to achieving mutual exclusion are software solutions that require the use of a technique called __________.

**翻译**: 实现互斥的许多方法都是软件解决方案，这些方案要求使用一种称为 __________ 的技术。

**答案**: **busy waiting (或 spin waiting)**

**解析**: 早期的纯软件算法（如 Dekker 算法、Peterson 算法）为了探测另一个进程是否已经退出临界区，必须在一个 while 循环中不断测试某个变量。这种不让出 CPU 而是持续消耗执行周期的技术叫做忙等待（Busy waiting）。

**2. 题目**: The basic requirement for support of concurrent process is the ability to enforce __________.

**翻译**: 支持并发进程的基本要求是能够强制执行 __________。

**答案**: **mutual exclusion**

**解析**: 互斥（Mutual Exclusion）是所有并发控制理论的基石。没有互斥，就无法保护共享状态免受由于交替执行引发的数据竞争破坏。

**3. 题目**: In order to protect shared variables (and other shared global resources) the system must control the __________.

**翻译**: 为了保护共享变量（以及其他共享全局资源），系统必须控制 __________。

**答案**: **access (或 critical sections)**

**解析**: 系统必须严格控制对这些共享资源的**访问（access）**，通常通过确保只有处于**临界区（critical sections）**的单个进程才能进行访问来实现。

**4. 题目**: The situation where Process 1 (P1) holds Resource 1 (R1), while P2 holds R2, and P1 needs R2 to complete and P2 needs R1 to complete is referred to as __________.

**翻译**: 进程 1（P1）持有资源 1（R1），同时 P2 持有 R2，并且 P1 需要 R2 才能完成，而 P2 需要 R1 才能完成的情况被称为 __________。

**答案**: **deadlock**

**解析**: 这是经典的死锁（Deadlock）状态的定义：两个或多个进程互相持有对方需要的资源，形成循环等待，导致系统永远停滞。

**5. 题目**: When only one process is allowed in its critical code section at a time, then __________ is enforced.

**翻译**: 当一次只允许一个进程进入其关键代码区时，这就强制执行了 __________。

**答案**: **mutual exclusion**

**解析**: 这是互斥（Mutual Exclusion）的标准定义。

**6. 题目**: The technique in which a process can do nothing until it gets permission to enter its critical section but continues to test the appropriate variable to gain entrance is called __________.

**翻译**: 进程在获得进入临界区的许可之前什么也做不了，但仍继续测试适当的变量以试图进入的技术称为 __________。

**答案**: **busy waiting (或 spin waiting)**

**解析**: 与第一题类似，这种在一个死循环中不断询问“我可以进去了吗？”的行为就是忙等待（Busy waiting）。

**7. 题目**: In multiprocessor configurations, special machine instructions that carry out two actions in a single instruction cycle are said to do so __________.

**翻译**: 在多处理器配置中，在单个指令周期中执行两个操作的特殊机器指令被认为是以 __________ 方式执行的。

**答案**: **atomically**

**解析**: 硬件互斥机制（如 Test-and-Set 或 Exchange 指令）之所以能在多核下工作，是因为它们被硬件设计为**原子地（atomically）**执行。即读取和写入在同一个不可分割的周期内完成，不会被其他处理器打断。

**8. 题目**: A semaphore whose definition includes the FIFO policy for releasing blocked processes from the queue is called a __________.

**翻译**: 包含从队列中释放阻塞进程的 FIFO 策略的信号量定义被称为 __________。

**答案**: **strong semaphore**

**解析**: 强制使用先进先出（FIFO）队列以防止饥饿的信号量被归类为强信号量（Strong Semaphore）。

**9. 题目**: The Barbershop Problem uses __________ to implement concurrency.

**翻译**: 理发店问题（Barbershop Problem）使用 __________ 来实现并发控制。

**答案**: **semaphores**

**解析**: 理发店问题是经典的同步问题之一，教科书在附录等章节中通常用**信号量（semaphores）**（包括控制等待座椅数量、理发师就绪状态等信号量）来演示其解决方案。

**10. 题目**: A monitor supports __________ by the use of condition variables that are contained within the monitor and accessible only within the monitor.

**翻译**: 管程通过使用包含在管程内且仅在管程内可访问的条件变量（condition variables）来支持 __________。

**答案**: **synchronization**

**解析**: 管程本身利用管程锁（互斥锁）提供了互斥功能，而它额外引入**条件变量（Condition variables，带有 wait 和 signal 操作）**则是为了支持进程间的**同步（synchronization）**。

**11. 题目**: A blocking send, blocking receive message passing scenario is sometimes referred to as a __________.

**翻译**: 阻塞发送、阻塞接收的消息传递场景有时被称为 __________。

**答案**: **rendezvous**

**解析**: 当发送者必须等待接收者，且接收者必须等待发送者，两方在消息成功交接的那一刻在时间上实现了精确对齐，这种强同步的情况被称为**汇合（rendezvous）**。

**12. 题目**: The shared data structures that temporarily hold messages in a message passing system employing indirect addressing are generally referred to as __________.

**翻译**: 在采用间接寻址的消息传递系统中，临时保存消息的共享数据结构通常被称为 __________。

**答案**: **mailboxes (或 ports)**

**解析**: 间接通信需要一个中间媒介存放消息，最常见的叫法就是邮箱（mailboxes）或端口（ports）。

**13. 题目**: In the __________ addressing implementation of message passing, the "send" primitive includes a specific identifier of the destination process.

**翻译**: 在消息传递的 __________ 寻址实现中，“发送（send）”原语包含目标进程的特定标识符。

**答案**: **direct**

**解析**: 如果你需要指名道姓地把消息发给目标（如 `send(P, message)`），这被称为直接寻址（direct addressing）。

**14. 题目**: The classic concurrency problem that involves readers and writers that can both read from and write to a shared data area is the __________ Problem.

**翻译**: 涉及都可以读取和写入共享数据区的读者和写者的经典并发问题是 __________ 问题。

**答案**: **Readers/Writers**

**解析**: 探讨数据库或文件共享时，将进程分为只读和只写两大类的经典模型称为读者/写者问题（Readers/Writers Problem）。

**15. 题目**: The classic concurrency problem that involves multiple readers that can read from a shared data area when no single writer is exclusively writing to it is the __________ Problem.

**翻译**: 涉及当没有单一写者专门对其进行写入时、多个读者可以从共享数据区中进行读取的经典并发问题是 __________ 问题。

**答案**: **Readers/Writers**

**解析**: 这个问题和上一个是同一个术语（仅仅是对条件的进一步细化描述）。它仍然是指读者/写者问题（Readers/Writers Problem）。