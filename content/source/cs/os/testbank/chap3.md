---
title: Chap. 3
order: 3
---

# Chapter 3 - Process Description and Control

## True / False Questions (判断题)

**1. 题目**: The principal function of the processor is to execute machine instructions residing in main memory.

**翻译**: 处理器的主要功能是执行驻留在主存中的机器指令。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 处理器的基本功能。

*   **详解**: 计算机系统的核心目标是执行程序，而程序是由一系列机器指令构成的。处理器（CPU）的基本工作周期就是从主存（Main Memory）中不断地获取（Fetch）指令并执行（Execute）它们。

**2. 题目**: A process trace is a listing of the sequence of instructions that execute for that process.

**翻译**: 进程轨迹（Process trace）是该进程执行的指令序列的列表。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 进程轨迹（Process Trace）的定义。

*   **详解**: 在操作系统中，为了描述和理解单个进程的行为，我们通常使用“轨迹（Trace）”这一概念。它精确地记录了该进程在处理器上运行时的机器指令序列。

**3. 题目**: The principal responsibility of the operating system is to control the execution of processes.

**翻译**: 操作系统的主要职责是控制进程的执行。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 操作系统的职责。

*   **详解**: 操作系统作为资源管理器，其最核心的任务之一就是管理和调度多个进程的执行，确保它们公平、高效且互不干扰地使用处理器和其他系统资源。

**4. 题目**: When one process spawns another, the spawning process is referred to as the child process and the spawned process is referred to as the parent process.

**翻译**: 当一个进程派生（spawn）另一个进程时，派生进程被称为子进程，被派生的进程被称为父进程。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 进程的创建（Process Spawning）。

*   **详解**: 概念颠倒了。发起创建动作（spawning）的原进程是“父进程（Parent process）”，而被创建出来的新进程是“子进程（Child process）”。

**5. 题目**: Round-Robin processing refers to a method of thread prioritization for scheduling.

**翻译**: 轮转（Round-Robin）处理指的是一种用于调度的线程优先级排序方法。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 轮转调度算法（Round-Robin Scheduling）。

*   **详解**: 轮转（Round-Robin）是一种基于时间片（Time Slicing）的公平调度算法，它不依赖于静态或动态的“优先级（prioritization）”。在这种机制下，就绪队列中的每个进程（或线程）被轮流分配一个固定大小的时间片来执行，时间片用完即被剥夺执行权。

**6. 题目**: The primary difference between the Two-State Process Model and the Five-State Process Model is that the latter splits the Running state into two new states: Ready and Blocked.

**翻译**: 两态进程模型和五态进程模型之间的主要区别在于，后者将“运行（Running）”状态拆分为两个新状态：就绪（Ready）和阻塞（Blocked）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 进程状态模型。

*   **详解**: 描述错误。两态模型包含“运行（Running）”和“非运行（Not Running）”。五态模型实际上是将“非运行（Not Running）”状态进行了细分，拆分成了“就绪（Ready）”和“阻塞/等待（Blocked/Waiting）”，而不是拆分“运行”状态。

**7. 题目**: One solution to the problem of limited main memory space is swapping, which involves moving all or part of a process from main memory to secondary memory.

**翻译**: 解决主存空间有限问题的一种方法是交换（swapping），它涉及将进程的全部或部分从主存移动到辅助存储器。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 内存交换（Swapping）与挂起状态（Suspend）。

*   **详解**: 当主存中所有的进程都处于阻塞状态，且没有足够的空闲内存来加载新的就绪进程时，操作系统会将一部分被阻塞的进程“交换（Swap）”到磁盘（辅助存储器）上，以腾出物理内存，这一过程是解决内存短缺的经典技术。

**8. 题目**: In order to define the control structures (e.g., tables) that the O/S needs to manage processes and resources, it must have access to configuration data during initialization.

**翻译**: 为了定义操作系统管理进程和资源所需的控制结构（例如，表），它必须在初始化期间能够访问配置数据。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 操作系统控制结构的建立。

*   **详解**: 操作系统在启动和初始化（Initialization）阶段，需要读取系统的硬件配置信息（如内存容量、设备类型和数量等），才能准确地在内存中分配和建立起内存表、I/O表、文件表和进程表等控制结构。

**9. 题目**: The Process Image refers to the binary form of the program code.

**翻译**: 进程映像（Process Image）指的是程序代码的二进制形式。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 进程映像的组成。

*   **详解**: 进程映像不仅仅包含程序代码的二进制形式（User Program）。根据教科书定义，它是一个包含了四个要素的完整实体：用户程序（User Program）、用户数据（User Data）、系统栈（System Stack）以及进程控制块（Process Control Block, PCB）。

**10. 题目**: The portion of the Process Control Block that consists of the contents of the processor registers is called the Process Control Information.

**翻译**: 进程控制块中包含处理器寄存器内容的部分称为进程控制信息（Process Control Information）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 进程控制块（PCB）的结构。

*   **详解**: 教科书中将 PCB 分为三大类：进程标识（Process Identification）、处理器状态信息（Processor State Information）和进程控制信息（Process Control Information）。其中，保存处理器寄存器（如程序计数器、PSW等）内容的区域被称为**处理器状态信息（Processor State Information）**。

**11. 题目**: The less-privileged processor execution mode is often referred to as kernel mode.

**翻译**: 权限较低的处理器执行模式通常被称为内核模式（kernel mode）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 处理器执行模式。

*   **详解**: 权限较低的模式是“用户模式（User mode）”。“内核模式（Kernel mode）”（或称系统模式、控制模式）是权限最高的模式，允许执行特权指令和访问受保护的内存区域。

**12. 题目**: The primary process table contains one entry per process, unless the process spawns a new process, in which case the table contains multiple entries for the parent process.

**翻译**: 主进程表为每个进程包含一个条目，除非该进程派生了一个新进程，在这种情况下，表中将为父进程包含多个条目。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 进程表（Process Table）。

*   **详解**: 无论进程是否派生了新进程，**每个进程在进程表中只占据一个条目（Entry）**。当父进程派生子进程时，操作系统会为子进程在进程表中分配一个全新的、独立的条目，而不是给父进程增加条目。

**13. 题目**: One kind of system interrupt, the trap, relates to an error or exception condition in the currently running process.

**翻译**: 一种系统中断——陷阱（trap），与当前正在运行的进程中的错误或异常情况有关。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 陷阱（Trap）的定义。

*   **详解**: 中断分为异步中断（通常由外部 I/O 硬件引发）和同步中断。同步中断通常被称为“陷阱（Trap）”，它是由正在执行的指令引发的异常情况，如除以零、非法内存访问等。

**14. 题目**: In the Nonprocess Kernel approach to defining the relationship between the O/S and the User Process, the O/S code is executed as a separate entity that operates in privileged mode.

**翻译**: 在定义操作系统与用户进程之间关系的“无进程内核（Nonprocess Kernel）”方法中，操作系统代码作为在特权模式下运行的独立实体来执行。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 操作系统的执行模型。

*   **详解**: 传统系统（如早期系统）采用 Nonprocess Kernel 模型。在这种模型下，操作系统的内核独立于任何用户进程之外运行。当发生中断或系统调用时，当前进程的状态被保存，控制权转移到内核，内核作为一个享有特权的独立代码实体进行处理。

**15. 题目**: A typical UNIX system employs two Running states, to indicate whether the process is executing in user mode or kernel mode.

**翻译**: 典型的 UNIX 系统使用两种运行状态，以指示进程是在用户模式还是内核模式下执行。

**答案**: **True (正确)**

**解析**:

*   **知识点**: UNIX 进程状态模型。

*   **详解**: UNIX SVR4 进程状态模型在“Running”状态上进行了细化，分为“User Running（用户态运行）”和“Kernel Running（内核态运行）”。进程发生系统调用或被中断时，会从 User Running 切换到 Kernel Running。

---

## Multiple Choice Questions (单选题)

**1. 题目**: The behavior of a processor can be characterized by examining:
a. A single process trace
b. Multiple process traces
c. The interleaving of the process traces
d. All of the above

**翻译**: 处理器的行为可以通过检查以下哪项来表征：
a. 单个进程的轨迹
b. 多个进程的轨迹
c. 进程轨迹的交织（interleaving）
d. 以上所有

**答案**: **c. The interleaving of the process traces**

**解析**:

*   **知识点**: 处理器的行为。

*   **详解**: 单个进程的轨迹只能描述该进程本身的行为。处理器是在多个进程之间不断切换的，因此要描述**处理器**在宏观上的整体行为，必须观察所有活跃进程的轨迹是如何在时间轴上交织（interleaving）执行的。

**2. 题目**: The behavior of an individual process can be characterized by examining:
a. A single process trace
b. Multiple process traces
c. The interleaving of the process traces
d. All of the above

**翻译**: 单个进程的行为可以通过检查以下哪项来表征：
a. 单个进程的轨迹
b. 多个进程的轨迹
c. 进程轨迹的交织
d. 以上所有

**答案**: **a. A single process trace**

**解析**:

*   **知识点**: 进程的行为。

*   **详解**: 进程的“轨迹（Trace）”是针对特定进程的指令执行序列，只需研究这一个特定的 Trace 就可以完全了解该进程个体的行为。

**3. 题目**: The basic Two-State Process Model defines two possible states for a process in relationship to the processor:
a. Running and Executing
b. Running and Not Running
c. Executing and Waiting
d. None of the above

**翻译**: 基本的两态进程模型定义了进程相对于处理器的两种可能状态：
a. 运行（Running）和执行（Executing）
b. 运行（Running）和非运行（Not Running）
c. 执行（Executing）和等待（Waiting）
d. 以上都不是

**答案**: **b. Running and Not Running**

**解析**:

*   **知识点**: 两态进程模型（Two-State Process Model）。

*   **详解**: 最简单的操作系统进程模型只区分进程当前是否占用 CPU，即“Running（正在运行）”和“Not Running（未在运行，位于队列中排队）”。

**4. 题目**: There are a number of conditions that can lead to process termination, including:
a. Normal completion
b. Bounds violation
c. Parent termination
d. All of the above

**翻译**: 有许多条件可能导致进程终止，包括：
a. 正常完成
b. 越界违规（内存越界）
c. 父进程终止
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: 进程终止的原因。

*   **详解**: 进程可能因为多种原因退出，包括：自身执行完毕（Normal completion）、出现致命错误如访问了不属于自己的内存（Bounds violation），或者因为它的父进程被终止，操作系统连带终止了所有子进程（Parent termination）。

**5. 题目**: In the Five-State Process Model, the following represents a valid state transition:
a. Running -> Blocked
b. New -> Running
c. New -> Blocked
d. All of the above

**翻译**: 在五态进程模型中，以下哪项代表有效的状态转换：
a. 运行 -> 阻塞
b. 新建 -> 运行
c. 新建 -> 阻塞
d. 以上所有

**答案**: **a. Running -> Blocked**

**解析**:

*   **知识点**: 五态模型中的状态转换。

*   **详解**: 
    *   `Running -> Blocked` 是有效的：正在运行的进程发起 I/O 请求或等待某事件时会发生此转换。
    *   `New -> Running` 无效：新建进程必须先进入 `Ready` 队列，由调度器选中后才能 `Running`。
    *   `New -> Blocked` 无效：新建进程还未执行，不可能发起等待事件。

**6. 题目**: In a Process Model that implements two suspend states, a valid state transition is represented by:
a. Ready/Suspend -> Ready
b. Running -> Ready/Suspend
c. Ready -> Ready/Suspend
d. All of the above

**翻译**: 在实现了两个挂起状态的进程模型中，有效的状态转换由以下哪项表示：
a. 就绪/挂起 -> 就绪
b. 运行 -> 就绪/挂起
c. 就绪 -> 就绪/挂起
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: 七态模型（引入挂起状态）。

*   **详解**: 
    *   `Ready/Suspend -> Ready`：当主存有足够空间，操作系统将外存中挂起的就绪进程换入主存。
    *   `Running -> Ready/Suspend`：一个正在运行的进程可能因为优先级较低或为了腾出内存而被直接抢占并挂起到外存。
    *   `Ready -> Ready/Suspend`：主存空间紧张时，操作系统会将内存中等待执行的就绪进程挂起到外存。

**7. 题目**: The scheduling strategy where each process in the queue is given a certain amount of time, in turn, to execute and then returned to the queue, unless blocked is referred to as:
a. Prioritization
b. Round-Robin
c. LIFO
d. All of the above

**翻译**: 队列中的每个进程依次获得一定的时间量来执行，除非被阻塞，否则随后返回队列，这种调度策略被称为：
a. 优先级排序
b. 轮转（Round-Robin）
c. 后进先出（LIFO）
d. 以上所有

**答案**: **b. Round-Robin**

**解析**:

*   **知识点**: 轮转调度算法。

*   **详解**: 这正是轮转算法（Round-Robin）的经典定义。操作系统为每个进程分配一个时间片（Time Slice/Quantum），时间耗尽发生时钟中断，进程被剥夺执行权并送回就绪队列的末尾排队。

**8. 题目**: A Memory Table is an O/S control structure that is used by the O/S to:
a. Manage I/O devices
b. Manage processes
c. Provide information about system files
d. None of the above

**翻译**: 内存表（Memory Table）是操作系统的一种控制结构，被操作系统用来：
a. 管理 I/O 设备
b. 管理进程
c. 提供有关系统文件的信息
d. 以上都不是

**答案**: **d. None of the above**

**解析**:

*   **知识点**: 操作系统的控制表。

*   **详解**: 内存表（Memory Table）专门用于跟踪主存（Main Memory）和外存（Secondary Memory）的分配情况、保护属性及虚拟内存映射，而不是用来管理 I/O（I/O表）、管理进程（进程表）或提供文件信息（文件表）。因此前三个选项均不正确。

**9. 题目**: The Process Image element that contains the collection of attributes needed by the O/S to control a particular process is called the:
a. User Data
b. System Stack
c. Process Control Block
d. None of the above

**翻译**: 进程映像中包含操作系统控制特定进程所需的一组属性的元素被称为：
a. 用户数据
b. 系统栈
c. 进程控制块
d. 以上都不是

**答案**: **c. Process Control Block**

**解析**:

*   **知识点**: 进程控制块（PCB）的作用。

*   **详解**: 操作系统为了管理和调度进程，需要一种数据结构来记录进程的所有关键属性（如状态、PC、寄存器、优先级、内存指针等），这个数据结构就是 PCB。

**10. 题目**: The Process Image element that contains the modifiable part of the user space is called the:
a. User Program
b. System Stack
c. Process Control Block
d. None of the above

**翻译**: 进程映像中包含用户空间可修改部分的元素被称为：
a. 用户数据（User Program 在此题选项为 a，但题意指向 User Data。Wait! 选项 a 是 User Program。但前面提到的四大元素是 User Data, User Program, System Stack, PCB）
*注意原文选项*：a. User Program / b. System Stack / c. Process Control Block / d. None of the above。如果题目选项中没有 "User Data"，那么可修改的部分应该是 User Data，答案就是 d。
**仔细审题**：
题目："The Process Image element that contains the modifiable part of the user space is called the:"
a. User Program （不可修改的代码段）
b. System Stack （属于内核控制，用于系统调用上下文）
c. Process Control Block （属于操作系统内核管理）
d. None of the above

**答案**: **d. None of the above**

**解析**:

*   **知识点**: 进程映像的组成部分。

*   **详解**: 进程映像由四部分组成：User Program（代码，通常是只读的）、User Data（用户数据，是可修改的用户空间部分）、System Stack 和 PCB。因为选项中没有提供“User Data”，故选 d。

**11. 题目**: The processor execution mode that user programs typically execute in is referred to as:
a. User mode
b. System mode
c. Kernel mode
d. None of the above

**翻译**: 用户程序通常在其中执行的处理器执行模式被称为：
a. 用户模式
b. 系统模式
c. 内核模式
d. 以上都不是

**答案**: **a. User mode**

**解析**:

*   **知识点**: 处理器特权级。

*   **详解**: 为了安全性和保护操作系统不受恶意或错误程序的破坏，普通的用户级应用程序都运行在受限的“用户模式（User mode）”下。

**12. 题目**: One step in the procedure for creating a new process involves:
a. Initializing the process control block
b. Allocating space for the process
c. Assigning a unique identifier
d. All of the above

**翻译**: 创建新进程过程中的一个步骤涉及：
a. 初始化进程控制块
b. 为进程分配空间
c. 分配一个唯一的标识符
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: 进程的创建步骤。

*   **详解**: 当操作系统创建新进程时，必须：为新进程分配一个唯一的进程ID (c)；为进程的代码、数据、栈和PCB分配内存空间 (b)；最后初始化该进程的PCB结构 (a) 等。因此全选。

**13. 题目**: A process switch may occur when the system encounters an interrupt condition, such as that generated by a:
a. Memory fault
b. Supervisor call
c. Trap
d. All of the above

**翻译**: 当系统遇到中断条件时可能会发生进程切换，例如由以下情况生成的中断：
a. 内存错误（Memory fault）
b. 访管调用（Supervisor call，即系统调用）
c. 陷阱（Trap）
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: 引起进程切换的事件。

*   **详解**: 能够中断当前进程执行并将控制权交还给操作系统的机制包括：普通中断（时钟或I/O）、陷阱/异常（Trap，例如除零错误或缺页引发的 Memory fault），以及进程主动发起的访管调用（Supervisor call）。这些事件发生后，操作系统内核可能会根据情况决定进行进程切换。

**14. 题目**: In the Process Based O/S:
a. Major kernel functions are organized as separate functions
b. The User Process Image includes a kernel stack
c. O/S code and data are contained in the shared address space
d. None of the above

**翻译**: 在基于进程的操作系统（Process Based O/S）中：
a. 主要内核功能被组织为独立的函数
b. 用户进程映像包括一个内核栈
c. 操作系统代码和数据包含在共享地址空间中
d. 以上都不是

**答案**: **d. None of the above**

**解析**:

*   **知识点**: 操作系统架构模型（Process-based OS）。

*   **详解**: 
    *   在教科书中，“基于进程的操作系统（Process-based OS）”是将主要的内核功能组织为“独立的系统进程（separate system processes）”，而不是选项 a 所说的“独立的函数（functions）”。
    *   选项 b 和 c 描述的是另一种称为“Execution Within User Processes（在用户进程内执行）”的模型特征。
    *   由于选项 a 具有迷惑性的“functions”而不是“processes”，严格来说应选 d。

**15. 题目**: In a typical UNIX system, the element of the process image that contains the processor status information is the:
a. System-level context
b. Register context
c. User-level context
d. All of the above

**翻译**: 在典型的 UNIX 系统中，包含处理器状态信息的进程映像元素是：
a. 系统级上下文
b. 寄存器上下文
c. 用户级上下文
d. 以上所有

**答案**: **b. Register context**

**解析**:

*   **知识点**: UNIX System V 的进程控制块结构。

*   **详解**: 典型的 UNIX 系统将进程映像拆分为不同层次的上下文。包含 PC、程序状态字 PSW 和各通用寄存器值的部分，被称为“寄存器上下文（Register context）”。

---

## Fill-In-The-Blank Questions (填空题)

**1. 题目**: The listing of a sequence of instructions that execute for a particular process is called a __________.

**翻译**: 为特定进程执行的一系列指令序列的列表被称为__________。

**答案**: **trace (或 process trace)**

**解析**: 在操作系统中，我们用轨迹（trace）这个术语来宏观跟踪或刻画一个进程随着时间推移的指令执行序列。

**2. 题目**: The behavior of a processor can be characterized by examining the interleaving of the process __________ for the processes currently running on the system.

**翻译**: 处理器的行为可以通过检查系统上当前正在运行的进程的进程__________的交织情况来表征。

**答案**: **traces**

**解析**: 同上，处理器的宏观行为是通过多个进程的指令轨迹（traces）是如何被调度和交替（interleaving）执行来刻画的。

**3. 题目**: The portion of the operating system that selects the next process to run is called the __________.

**翻译**: 操作系统中负责选择下一个要运行的进程的部分被称为__________。

**答案**: **dispatcher (或 scheduler)**

**解析**: 调度器（scheduler）决定谁可以运行，而分派器（dispatcher）是实际执行状态切换并把CPU控制权交给该进程的内核组件。教科书通常将短期调度和实际上下文切换统称为 dispatcher 或 short-term scheduler。

**4. 题目**: When the O/S creates a process at the explicit request of an existing process, the action is referred to as __________.

**翻译**: 当操作系统在现有进程的显式请求下创建一个进程时，该操作被称为__________。

**答案**: **process spawning**

**解析**: 这是派生（spawning）的标准定义。当一个父进程调用 OS 服务（如 `fork`）来生成子进程时，我们称之为 process spawning。

**5. 题目**: A process that cannot execute until some event occurs is said to be in the __________ state.

**翻译**: 一个直到某个事件发生后才能执行的进程，据说处于__________状态。

**答案**: **Blocked (或 Waiting)**

**解析**: 当进程因为等待 I/O 完成或等待某种资源而无法继续执行时，操作系统会将其移入阻塞（Blocked）队列中，不再给它分配 CPU。

**6. 题目**: In a system that implements two suspend states, a process that has been swapped out of main memory and into secondary memory and that is also awaiting an event is in the __________ state.

**翻译**: 在实现了两个挂起状态的系统中，一个被换出主存并进入辅助存储器，且同时在等待一个事件的进程处于__________状态。

**答案**: **Blocked/Suspend**

**解析**: 在七态模型中，一个原本在内存中且被阻塞（Blocked）的进程，如果为了腾出内存空间被操作系统转移到了磁盘外存中，该进程就进入了阻塞/挂起（Blocked/Suspend）状态。

**7. 题目**: The scheduling strategy where each process in the queue is given a certain amount of time, in turn, to execute and then returned to the queue, unless blocked is referred to as __________.

**翻译**: 队列中的每个进程依次获得一定的时间量来执行，除非被阻塞，否则随后返回队列，这种调度策略被称为__________。

**答案**: **Round-Robin**

**解析**: 这是轮转算法的经典定义，每个进程获得的固定时间量称为时间片（Time Quantum）。

**8. 题目**: The O/S control structure that the O/S uses to manage system processes is called the __________.

**翻译**: 操作系统用来管理系统进程的控制结构被称为__________。

**答案**: **Process Table**

**解析**: 操作系统使用进程表（Process Table）来维护系统中所有进程的目录。每个活跃进程在表中有一个条目，包含指向该进程映像（Process Image）的指针或其实际信息。

**9. 题目**: The User Data, User Program, System Stack and Process Control Block elements collectively make up what is referred to as the __________.

**翻译**: 用户数据、用户程序、系统栈和进程控制块元素共同构成了所谓的__________。

**答案**: **Process Image**

**解析**: 这四部分要素组合在一起构成了进程在物理内存或虚拟内存中存在的一个完整实体，操作系统理论中称之为“进程映像（Process Image）”。

**10. 题目**: The Process Identification, Processor State Information and the Process Control Information are the general categories that collectively make up what is referred to as the __________.

**翻译**: 进程标识、处理器状态信息和进程控制信息这几个通用类别，共同构成了所谓的__________。

**答案**: **Process Control Block (PCB)**

**解析**: 这是 PCB 的标准内部逻辑结构，PCB 是操作系统中最重要的控制数据结构。

**11. 题目**: The processor typically maintains the current operating mode (i.e., user or kernel) in the __________.

**翻译**: 处理器通常在__________中维护当前的运行模式（即用户模式或内核模式）。

**答案**: **Program Status Word (PSW)**

**解析**: 程序状态字（PSW）是一个硬件寄存器，其中包含条件码、中断使能位以及指示当前 CPU 执行处于核心态还是用户态的特权级别位（Mode bit）。

**12. 题目**: The first step in creating a new process is to assign a unique __________ to the new process.

**翻译**: 创建新进程的第一步是为新进程分配一个唯一的__________。

**答案**: **process identifier (或 process ID)**

**解析**: 为了能在进程表中添加新记录，操作系统必须首先生成一个当前未被使用的唯一的数字标识符（PID）。

**13. 题目**: The execution of a user process may be interrupted by a __________, which might be generated by the process requesting an I/O operation.

**翻译**: 用户进程的执行可能会被一个__________打断，这可能是由该进程请求 I/O 操作而生成的。

**答案**: **Supervisor call (或 system call)**

**解析**: 当用户进程需要操作系统服务（如请求 I/O 操作）时，它必须通过触发软中断来发起一个访管调用（Supervisor Call / System Call），这将引起 CPU 特权级切换并陷入操作系统。

**14. 题目**: In the __________ model for illustrating the relationship between the O/S and User Processes, the O/S has its own region of memory to use and its own system stack for controlling procedure calls and returns.

**翻译**: 在阐明操作系统与用户进程之间关系的__________模型中，操作系统拥有自己使用的内存区域，并拥有自己的系统栈用于控制过程调用和返回。

**答案**: **Nonprocess Kernel**

**解析**: “无进程内核（Nonprocess Kernel）”模型是一种传统的内核设计方式，其中内核在其专用的内存空间中作为一个实体执行，不运行在任何用户进程的上下文中。

**15. 题目**: In the __________ model for illustrating the relationship between the O/S and User Processes, the O/S has its own region of memory to use and its own system stack for controlling procedure calls and returns.
*(注：第 15 题在源文档中与第 14 题完全相同，故答案与解析一致)*

**翻译**: 在阐明操作系统与用户进程之间关系的__________模型中，操作系统拥有自己使用的内存区域，并拥有自己的系统栈用于控制过程调用和返回。

**答案**: **Nonprocess Kernel**

**解析**: 题目与前一题重复。考查的依然是 Nonprocess Kernel 结构模型。

**16. 题目**: Process creation in a typical UNIX system is made by means of a kernel system call named __________.

**翻译**: 在典型的 UNIX 系统中，进程创建是通过名为__________的内核系统调用来实现的。

**答案**: **fork**

**解析**: 在 UNIX 系操作系统中，`fork()` 是唯一的创建新进程的方式。它会精确克隆调用者（父进程）的内存空间，生成一个近乎完全相同的子进程映像。