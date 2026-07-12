---
title: Chap. 11
order: 11
---

# Chapter 11 - I/O Management and Disk Scheduling

## True / False Questions (判断题)

**1. 题目**: One general grouping of external I/O devices that communicate with computer systems is the Human Readable category, which includes disk drives and tape drives.

**翻译**: 与计算机系统通信的外部 I/O 设备的一个通用分组是人类可读（Human Readable）类别，其中包括磁盘驱动器和磁带驱动器。

**答案**: **False (错误)**

**解析**:

*   **知识点**: I/O 设备的分类。

*   **详解**: 外部 I/O 设备通常被分为三大类：
    1. **人类可读（Human Readable）**：适合与人类用户交互的设备，如屏幕、打印机、键盘、鼠标。
    2. **机器可读（Machine Readable）**：适合与电子设备通信的设备，如**磁盘驱动器、磁带驱动器**、传感器等。
    3. **通信（Communication）**：适用于与远程设备通信的设备，如调制解调器、网卡。
    因此，磁盘和磁带属于机器可读类别，而非人类可读类别。

**2. 题目**: In the Direct Memory Access (DMA) I/O technique, a DMA module controls the exchange of data between main memory and the I/O module.

**翻译**: 在直接内存访问（DMA）I/O 技术中，DMA 模块控制主存和 I/O 模块之间的数据交换。

**答案**: **True (正确)**

**解析**:

*   **知识点**: DMA (Direct Memory Access) 工作原理。

*   **详解**: DMA 技术的设计初衷就是将处理器从繁重的数据搬运中解放出来。处理器只需向 DMA 模块发送一条包含读/写类型、设备地址、内存起始地址和数据量等信息的命令，随后 DMA 模块将完全接管系统总线，直接在主存和 I/O 设备之间传送数据块。

**3. 题目**: In the evolution of the I/O function, the general tendency is for the processor to become more involved in I/O operations.

**翻译**: 在 I/O 功能的演变中，总体趋势是处理器越来越多地参与到 I/O 操作中。

**答案**: **False (错误)**

**解析**:

*   **知识点**: I/O 功能的演进。

*   **详解**: 趋势恰恰相反。I/O 系统的演进方向是让处理器**越来越少（less involved）**地参与 I/O 操作。演进路径为：程序控制 I/O -> 中断驱动 I/O -> DMA -> I/O 通道 -> I/O 处理器。每一步都在进一步将 I/O 控制权下放给独立的硬件，以提高系统的并行性和 CPU 的利用率。

**4. 题目**: A separate bus, other than the system bus, is provided for DMA transfers in the "Single bus, detached DMA" configuration.

**翻译**: 在“单总线，分离 DMA（Single bus, detached DMA）”配置中，除了系统总线外，还提供了一条独立的总线用于 DMA 传输。

**答案**: **False (错误)**

**解析**:

*   **知识点**: DMA 总线配置。

*   **详解**: “单总线，分离 DMA”指的是所有模块（包括处理器、主存、DMA 模块和所有 I/O 模块）都共享**同一条**系统总线。当 DMA 需要传输数据时，它必须与处理器竞争这条唯一的系统总线。没有提供额外的独立总线。

**5. 题目**: The two primary objectives that are paramount in designing the I/O facility of a computer system are effectiveness and generality.

**翻译**: 在设计计算机系统的 I/O 设施时，至关重要的两个主要目标是有效性（effectiveness）和通用性（generality）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: I/O 设计目标。

*   **详解**: 教科书中明确指出，I/O 设计的两个首要目标是**效率（Efficiency）**和**通用性（Generality）**。I/O 操作往往是计算机系统的性能瓶颈，因此极度强调“效率”；同时为了操作系统能以统一的接口管理五花八门的设备，强调“通用性”。题目使用的词汇是 effectiveness，严格的术语应为 efficiency。

**6. 题目**: The logical I/O module, as defined in the hierarchical structure that manages I/O on local peripheral devices, deals with the device as a logical resource and is not concerned with the details of actually controlling the device.

**翻译**: 在管理本地外围设备 I/O 的分层结构中定义的逻辑 I/O 模块，将设备作为逻辑资源来处理，并且不关心实际控制该设备的细节。

**答案**: **True (正确)**

**解析**:

*   **知识点**: I/O 软件的层次结构。

*   **详解**: “逻辑 I/O (Logical I/O)”层提供了一个简单的、高级的接口来操作设备（将其视为逻辑上的块集合或字符流），并隐藏了特定于物理设备的底层控制细节（如磁头移动、寻道等细节交由 Device I/O 层处理）。

**7. 题目**: Disks and tapes are examples of stream-oriented I/O devices.

**翻译**: 磁盘和磁带是面向流的（stream-oriented）I/O 设备的例子。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 面向块与面向流的 I/O 设备。

*   **详解**: 磁盘和磁带是将信息保存在固定大小的数据块中，并以块为单位进行寻址和传输的，它们是典型的**面向块（Block-oriented）**设备。面向流（Stream-oriented）设备是以不可寻址的字节流形式传输数据的设备，如终端、打印机、通信端口和鼠标。

**8. 题目**: Double buffering refers to the concept of using two buffers to alternatively fill and empty in order to facilitate the buffering of an I/O request.

**翻译**: 双缓冲（Double buffering）指的是使用两个缓冲区交替填充和清空的概念，以促进 I/O 请求的缓冲。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 双缓冲技术。

*   **详解**: 这也称为缓冲交换（Buffer swapping）。当一个进程从一个缓冲区读取数据时，操作系统可以将后续的 I/O 数据同时填入第二个缓冲区。这种交替并行极大地平滑了数据流，避免了进程因等待数据而挂起。

**9. 题目**: In the operation of a disk drive, Seek Time is the sum of rotational delay and access time.

**翻译**: 在磁盘驱动器的操作中，寻道时间（Seek Time）是旋转延迟（rotational delay）和存取时间（access time）的总和。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 磁盘性能参数。

*   **详解**: 物理公式颠倒了。正确的公式是：**存取时间（Access Time） = 寻道时间（Seek Time） + 旋转延迟（Rotational Delay）**。存取时间是将读写头定位到正确扇区所需等待的总时间。

**10. 题目**: Random scheduling is useful as a benchmark against which to evaluate other disk scheduling policies because it provides a worst-case scenario.

**翻译**: 随机调度（Random scheduling）作为评估其他磁盘调度策略的基准很有用，因为它提供了一个最坏情况的场景。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 随机调度策略的作用。

*   **详解**: 在生产环境中没有人会真正使用完全随机的顺序去读取磁盘磁道。它仅仅在理论分析和基准测试中被使用，用来模拟调度效率的最下限（最差情况）。如果一个新算法的表现不比随机调度强多少，说明该算法极其失败。

**11. 题目**: In the C-SCAN disk scheduling algorithm, the disk arm is required to move in one direction only until it reaches the last track or there are no more requests to service in that direction, then it reverses direction and the scan proceeds in the opposite direction in the same fashion.

**翻译**: 在 C-SCAN 磁盘调度算法中，磁盘臂需要仅沿一个方向移动，直到到达最后一个磁道或该方向上没有更多要服务的请求，然后它反转方向并以相同的方式沿相反方向进行扫描。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 磁盘调度算法（SCAN 与 C-SCAN）。

*   **详解**: 题目描述的算法是 **SCAN（电梯算法）**，它在两个方向上都进行处理。而 **C-SCAN（循环扫描）** 的行为是：磁头只在一个方向上响应请求。当磁头移动到磁盘一端时，它会立刻“空载”返回到磁盘的另一端起点，**在返回途中不处理任何请求**，形成一个逻辑上的单向循环环路，这减少了极端磁道请求的饥饿时间。

**12. 题目**: The unique contribution of RAID is that it effectively addresses the need for redundancy in data storage.

**翻译**: RAID 的独特贡献在于它有效地满足了数据存储中对冗余（redundancy）的需求。

**答案**: **False (错误)**

**解析**:

*   **知识点**: RAID 的设计目标。

*   **详解**: RAID（独立磁盘冗余阵列）解决的绝不仅仅是冗余需求。它有两个同样重要的独特贡献：**性能提升（Performance）**和**冗余（Redundancy）**。通过条带化（Striping）在多个磁盘上并行读写，它极大地提高了 I/O 速度（甚至 RAID 0 根本就没有提供冗余，完全是为了性能）。

**13. 题目**: Cache memory is smaller and faster than main memory and is interposed between main memory and secondary storage.

**翻译**: 高速缓存（Cache memory）比主存更小、更快，它介于主存和辅助存储之间。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 存储器层次结构。

*   **详解**: 介于主存和辅助存储（如硬盘）之间，用于平滑磁盘 I/O 速度差异的缓存被称为**磁盘缓存（Disk Cache）**。而**高速缓存（Cache memory，如 L1/L2 Cache）**是介于 **处理器（CPU）和主存（Main Memory）** 之间的。

**14. 题目**: For buffered I/O in a UNIX system, two types of buffers are used: system buffer caches and character queues.

**翻译**: 对于 UNIX 系统中的缓冲 I/O，使用两种类型的缓冲区：系统缓冲缓存（system buffer caches）和字符队列（character queues）。

**答案**: **True (正确)**

**解析**:

*   **知识点**: UNIX 的 I/O 缓冲机制。

*   **详解**: UNIX 将 I/O 设备分为块设备（如磁盘和磁带）和字符设备（如终端和通信端口）。对应地，操作系统采用“系统缓冲缓存（System Buffer Cache）”来处理块 I/O，采用“字符队列（Character Queues）”来处理字符流 I/O。

**15. 题目**: In a W2K system, the synchronous mode of I/O operation is used whenever possible to optimize application performance.

**翻译**: 在 W2K 系统中，只要可能，就会使用同步模式的 I/O 操作来优化应用程序的性能。

**答案**: **False (错误)**

**解析**:

*   **知识点**: Windows 的 I/O 架构。

*   **详解**: 为了优化性能，Windows 提供了丰富的**异步（Asynchronous） I/O** 操作能力。异步 I/O 允许应用程序发起读写请求后立刻去执行其他计算任务，等 I/O 完成后再通过回调或事件得到通知，这能够极大地提升系统的并发吞吐量。因此系统鼓励使用的是异步而非同步模式。

---

## Multiple Choice Questions (单选题)

**1. 题目**: An example of the key differences that can exist across (and even in) classes of I/O devices is:
a. Data rate
b. Data representation
c. Error conditions
d. All of the above

**翻译**: 在各类 I/O 设备之间（甚至在类别内部）可能存在的关键差异的例子是：
a. 数据传输率 (Data rate)
b. 数据表示 (Data representation)
c. 错误条件 (Error conditions)
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: I/O 设备的多样性。

*   **详解**: 外部设备极具多样性。比如千兆网卡和鼠标的传输率（Data rate）有着天壤之别；不同的设备使用不同的数据编码形式（Data representation）；它们上报的机械或硬件故障（Error conditions）也截然不同。操作系统的 I/O 模块的一项大工程就是将这些差异屏蔽掉。

**2. 题目**: The I/O technique where the processor busy waits for an I/O operation to complete is called:
a. Programmed I/O
b. Interrupt-driven I/O
c. Direct memory access (DMA)
d. None of the above

**翻译**: 处理器通过“忙等待（busy waits）”来等待 I/O 操作完成的 I/O 技术被称为：
a. 程序控制 I/O (Programmed I/O)
b. 中断驱动 I/O
c. 直接内存访问 (DMA)
d. 以上都不是

**答案**: **a. Programmed I/O**

**解析**:

*   **知识点**: I/O 控制技术演进。

*   **详解**: 在最原始的**程序控制 I/O (Programmed I/O)** 模式下，处理器向 I/O 模块发送命令后，会进入一个死循环（忙等待），不断读取 I/O 模块的状态寄存器，直到操作完成。这极大地浪费了 CPU 时间。

**3. 题目**: The system configuration that includes an I/O module which is a separate processor with a specialized instruction set can be referred to using the following terminology:
a. Direct Memory Access (DMA)
b. I/O Channel
c. I/O Processor
d. All of the above

**翻译**: 包含一个作为独立处理器并具有专用指令集的 I/O 模块的系统配置，可以使用以下术语来指代：
a. DMA
b. I/O 通道 (I/O Channel)
c. I/O 处理器 (I/O Processor)
d. 以上所有

**答案**: **b. I/O Channel** *(注：I/O Channel 和 I/O Processor 在教科书演化步骤中是递进的，通常具有专门 I/O 指令集的代名词是 I/O 通道)*

**解析**:

*   **知识点**: I/O 通道（I/O Channel）。

*   **详解**: 这是 I/O 演化的第四步。I/O 模块被增强为一个**独立的处理器（带有专门为 I/O 定制的指令集）**。中央处理器（CPU）指示该模块在内存中执行一个 I/O 程序，这个独立的模块就被称为 **I/O 通道（I/O Channel）**。如果它进一步获得了自己的本地内存，则被称为 I/O 处理器（I/O Processor）。

**4. 题目**: The bus configuration for DMA that provides no path other than the system bus between the DMA module(s) and I/O devices is:
a. Single bus, detached DMA
b. Single bus, integrated DMA-I/O
c. I/O bus
d. None of the above

**翻译**: DMA 模块和 I/O 设备之间除了系统总线外不提供其他路径的 DMA 总线配置是：
a. 单总线，分离 DMA (Single bus, detached DMA)
b. 单总线，集成 DMA-I/O
c. I/O 总线
d. 以上都不是

**答案**: **a. Single bus, detached DMA**

**解析**:

*   **知识点**: DMA 的系统架构方案。

*   **详解**: 如果 DMA 控制器完全独立于各个 I/O 模块，并且挂载在唯一的系统总线上，任何 I/O 模块与 DMA 模块之间交换数据都要通过系统总线。这就是开销最大的“单总线，分离 DMA”架构。

**5. 题目**: The primary objective in designing the I/O facility of a computer system that deals with the desire to handle all I/O devices in a uniform manner is referred to as:
a. Efficiency
b. Generality
c. Directory management
d. None of the above

**翻译**: 在设计计算机系统 I/O 设施时，处理希望以统一方式处理所有 I/O 设备的主要目标被称为：
a. 效率 (Efficiency)
b. 通用性 (Generality)
c. 目录管理
d. 以上都不是

**答案**: **b. Generality**

**解析**:

*   **知识点**: 通用性目标。

*   **详解**: 操作系统希望无论底层是磁盘、网卡还是打印机，用户程序都能用相同的接口（如 `open`, `read`, `write`, `close`）进行操作，这种对异构性进行统一抽象的性质就是**通用性（Generality）**。

**6. 题目**: In a hierarchical structure for managing I/O on a secondary storage device that supports a file system, the layer that is closest to the hardware is the:
a. Directory management layer
b. Device I/O layer
c. Physical organization layer
d. None of the above

**翻译**: 在管理支持文件系统的辅助存储设备 I/O 的分层结构中，最靠近硬件的层是：
a. 目录管理层
b. 设备 I/O 层 (Device I/O layer)
c. 物理组织层
d. 以上都不是

**答案**: **d. None of the above**

**解析**:

*   **知识点**: I/O 层次结构模型。

*   **详解**: 对于支持文件系统的辅助存储，教科书列出的逻辑层次由上至下通常为：目录管理 (Directory Management) -> 逻辑文件系统 (Logical File System) -> 物理组织 (Physical Organization) -> 设备 I/O (Device I/O) -> **调度和控制 (Scheduling and Control)**。最底层（最靠近硬件）是**调度和控制层**。由于 a, b, c 中没有该选项（Device I/O 只是倒数第二层），最严谨的答案是“以上都不是”。*(注：部分教辅资料可能直接选择 Device I/O，但严格遵循结构模型应为缺失底层)*

**7. 题目**: An example of a block-oriented I/O device is:
a. CD-ROM
b. Printer
c. Modem
d. All of the above

**翻译**: 面向块（block-oriented）的 I/O 设备的例子是：
a. CD-ROM
b. 打印机
c. 调制解调器
d. 以上所有

**答案**: **a. CD-ROM**

**解析**:

*   **知识点**: 块设备。

*   **详解**: 块设备是以固定大小的“块（Block）”为单位存储和传输数据的，并且可以通过地址进行随机访问。CD-ROM（光盘）和磁盘都是典型的块设备。打印机和调制解调器是传输字符流的字符设备。

**8. 题目**: The scenario where multiple buffers are used in an attempt to alleviate the problem of absorbing rapid bursts of I/O is typically referred to as:
a. Single buffering
b. Double buffering
c. Circular buffering
d. None of the above

**翻译**: 使用多个缓冲区试图缓解吸收快速爆发的 I/O 问题的场景通常被称为：
a. 单缓冲
b. 双缓冲
c. 循环缓冲 (Circular buffering)
d. 以上都不是

**答案**: **c. Circular buffering**

**解析**:

*   **知识点**: 循环缓冲。

*   **详解**: 虽然双缓冲能解决大部分问题，但当系统偶尔发生极其急促的 I/O 爆发（rapid bursts）且单个处理速度跟不上时，即使双缓冲也会溢出。此时将两个以上的缓冲区组织成环形队列使用，就是**循环缓冲（Circular buffering）**技术。

**9. 题目**: The aspect of disk performance that represents the time it takes to position the head at the desired track is known as:
a. Seek time
b. Rotational delay
c. Access time
d. None of the above

**翻译**: 代表将磁头定位到所需磁道所花费的时间的磁盘性能方面被称为：
a. 寻道时间 (Seek time)
b. 旋转延迟
c. 存取时间
d. 以上都不是

**答案**: **a. Seek time**

**解析**:

*   **知识点**: 寻道时间。

*   **详解**: 磁盘读写的机械动作中，移动磁盘臂使得读写磁头精确对准指定磁道（Track）或柱面的动作，其耗时就被称为**寻道时间（Seek time）**。

**10. 题目**: The following disk scheduling policy is useful as a benchmark against which to evaluate other disk scheduling policies because it provides a worst-case scenario:
a. FIFO scheduling
b. Priority scheduling
c. Random scheduling
d. None of the above

**翻译**: 以下磁盘调度策略作为评估其他磁盘调度策略的基准很有用，因为它提供了一个最坏情况场景：
a. FIFO 调度
b. 优先级调度
c. 随机调度 (Random scheduling)
d. 以上都不是

**答案**: **c. Random scheduling**

**解析**:

*   **知识点**: 随机调度算法。

*   **详解**: 同判断题第 10 题。完全随机的调度能产生最恶劣的平均寻道长度，是其他所有调度算法效果评估的反面基准（Worst-case benchmark）。

**11. 题目**: The disk scheduling algorithm that implements two subqueues in a measure to avoid the problem of "arm stickiness" is the:
a. C-SCAN policy
b. FSCAN policy
c. N-step-SCAN policy
d. All of the above

**翻译**: 为了避免“磁臂粘滞（arm stickiness）”问题而实现两个子队列的磁盘调度算法是：
a. C-SCAN 策略
b. FSCAN 策略
c. N-step-SCAN 策略
d. 以上所有

**答案**: **b. FSCAN policy**

**解析**:

*   **知识点**: FSCAN 算法原理。

*   **详解**: 如果在磁头扫描经过某个磁道时，系统不断有请求访问该磁道，磁头就会被“粘”在原地，这叫**磁臂粘滞现象（Arm stickiness）**。**FSCAN** 算法通过将请求队列严格分成两个独立的子队列来解决这个问题：磁头只处理第一个队列里的请求，而在扫描期间新到达的所有请求都被强行放入第二个空队列中等待下一轮。它使用了正好两个（Two subqueues）队列。

**12. 题目**: Which of the following RAID levels implement some form of parity calculation to introduce redundancy:
a. RAID Level 2
b. RAID Level 4
c. RAID Level 6
d. All of the above

**翻译**: 以下哪些 RAID 级别实现了某种形式的奇偶校验计算以引入冗余：
a. RAID 级别 2
b. RAID 级别 4
c. RAID 级别 6
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: 各种 RAID 的冗余校验技术。

*   **详解**:
    *   **RAID 2** 使用海明码（Hamming code），这本质上是多重奇偶校验位的计算。
    *   **RAID 4** 使用独立的一个校验盘存放数据的块级奇偶校验（Block-level parity）。
    *   **RAID 6** 使用双重分布式校验算法进行复杂的双校验计算以容忍两块磁盘同时损坏。它们都使用了校验。

**13. 题目**: The disk cache replacement strategy that replaces the block that has experienced the fewest references is called:
a. Least Recently Used (LRU)
b. Least Referenced (LR)
c. Least Frequently Used (LFU)
d. All of the above

**翻译**: 替换经历引用次数最少的块的磁盘缓存替换策略被称为：
a. 最近最少使用 (LRU)
b. 最少引用 (LR)
c. 最不经常使用 (Least Frequently Used, LFU)
d. 以上所有

**答案**: **c. Least Frequently Used (LFU)**

**解析**:

*   **知识点**: 缓存替换算法。

*   **详解**: 基于“最少引用次数（fewest references）”进行淘汰的策略称为最不经常使用算法（LFU）。它为每个块维护一个计数器，替换计数器值最低的缓存块。

**14. 题目**: In a UNIX system, which of the following types of I/O devices make use of character queues:
a. Disk drive
b. Tape drive
c. Communications lines
d. All of the above

**翻译**: 在 UNIX 系统中，以下哪种类型的 I/O 设备利用字符队列：
a. 磁盘驱动器
b. 磁带驱动器
c. 通信线路 (Communications lines)
d. 以上所有

**答案**: **c. Communications lines**

**解析**:

*   **知识点**: UNIX 缓冲 I/O 结构。

*   **详解**: 在 UNIX 中，磁盘和磁带等面向块的设备使用的是“系统缓冲缓存（System Buffer Caches）”。而通信线路、终端等面向字节流的字符设备，它们不处理定长数据块，因此系统为它们分配的是“字符队列（Character Queues）”。

**15. 题目**: In a W2K system, the I/O manager module that includes lazy write and lazy commit services to improve overall performance is the:
a. Cache manager
b. File system drivers
c. Hardware device drivers
d. None of the above

**翻译**: 在 W2K（Windows 2000内核系列）系统中，包含“延迟写入（lazy write）”和“延迟提交（lazy commit）”服务以提高整体性能的 I/O 管理器模块是：
a. 缓存管理器 (Cache manager)
b. 文件系统驱动程序
c. 硬件设备驱动程序
d. 以上都不是

**答案**: **a. Cache manager**

**解析**:

*   **知识点**: Windows I/O 管理器组件。

*   **详解**: Windows 的 **缓存管理器（Cache Manager）** 负责整合和管理整个系统的内存到磁盘的缓存架构。它提供的“延迟写（Lazy Write）”机制允许系统在 CPU 负载低时再将被修改的缓存数据刷回磁盘，极大地提高了感知上的写入性能。

---

## Fill-In-The-Blank Questions (填空题)

**1. 题目**: The term __________ refers to the speed with which data moves to and from the individual I/O device.

**翻译**: 术语 __________ 指的是数据流入和流出单个 I/O 设备的速度。

**答案**: **data rate**

**解析**: 数据传输率（Data rate）是衡量外部 I/O 性能最关键的物理指标。

**2. 题目**: In the __________ I/O technique, the processor issues an I/O request, continues with other work and eventually receives notification that the request was fulfilled.

**翻译**: 在 __________ I/O 技术中，处理器发出 I/O 请求，继续进行其他工作，并最终收到请求已完成的通知。

**答案**: **interrupt-driven**

**解析**: 中断驱动 I/O（Interrupt-driven I/O）解决了程序控制 I/O 的忙等待问题。设备完成工作后，通过硬件电平信号触发一个中断来“通知（notification）”处理器。

**3. 题目**: The term __________ characterizes a system configuration that includes an I/O module that is a separate processor with a specialized instruction set.

**翻译**: 术语 __________ 描述了一种系统配置，该配置包含一个作为具有专门指令集的独立处理器的 I/O 模块。

**答案**: **I/O channel (或 I/O processor)**

**解析**: 这种带有专属 I/O 指令的高级架构被称为 I/O 通道（I/O Channel）。

**4. 题目**: The bus configuration for DMA that provides no path other than the system bus between the DMA module(s) and I/O devices is called __________.

**翻译**: DMA 模块和 I/O 设备之间除了系统总线外不提供其他路径的 DMA 总线配置被称为 __________。

**答案**: **single-bus, detached DMA**

**解析**: 即单总线、分离 DMA。这种设计由于必须两度竞争系统总线（设备到 DMA，DMA 到内存），效率受到总线的严重制约。

**5. 题目**: The term __________ refers to the I/O design objective that focuses on preventing I/O from becoming a bottleneck in the system.

**翻译**: 术语 __________ 指的是致力于防止 I/O 成为系统瓶颈的 I/O 设计目标。

**答案**: **efficiency**

**解析**: 计算机操作中大多数等待时间都是由于缓慢的外部设备造成的，因此操作系统的 I/O 设计在各个层面上都极致追求效率（Efficiency）。

**6. 题目**: The __________ layer is the hierarchical layer that is closest to the hardware in most I/O management structures.

**翻译**: __________ 层是在大多数 I/O 管理结构中最靠近硬件的分层层。

**答案**: **scheduling and control**

**解析**: 在 I/O 软件的逻辑分层模型的最底部，“调度和控制层（Scheduling and Control layer）”直接和硬件的控制器/寄存器打交道，负责实际的中断处理和命令分派。

**7. 题目**: A hard drive is an example of a __________-oriented I/O device.

**翻译**: 硬盘驱动器是 __________ 导向的 I/O 设备的例子。

**答案**: **block**

**解析**: 磁盘（硬盘）是面向块（Block-oriented）存取数据的典型设备。

**8. 题目**: An improvement over single buffering is the technique known as __________, where two system buffers are assigned to the operation and one can be emptied while the other is filled.

**翻译**: 相对于单缓冲的一种改进是被称为 __________ 的技术，其中为操作分配了两个系统缓冲区，一个可以在填充时清空另一个。

**答案**: **double buffering (或 buffer swapping)**

**解析**: 双缓冲（Double buffering）允许 I/O 硬件和处理进程实现一定程度的真正并行操作。

**9. 题目**: The __________ of data to or from a disk depends on the rotation speed of the disk, the number of bytes on a track and the number of bytes to be transferred.

**翻译**: 进出磁盘的数据的 __________ 决于磁盘的旋转速度、磁道上的字节数以及要传输的字节数。

**答案**: **transfer time**

**解析**: 一旦磁头定位在目标扇区，数据开始通过磁头感应被读出，此期间消耗的时间称为传输时间（Transfer Time）。

**10. 题目**: __________ is useful as a benchmark against which to evaluate other disk scheduling policies because it provides a worst-case scenario.

**翻译**: __________ 作为评估其他磁盘调度策略的基准很有用，因为它提供了一个最坏情况场景。

**答案**: **Random scheduling**

**解析**: 随机调度（Random scheduling）作为理论上的性能地板基准。

**11. 题目**: The disk scheduling algorithm that implements exactly 2 subqueues in a measure to avoid the problem of "arm stickiness" is the __________ policy.

**翻译**: 为了避免“磁臂粘滞”问题而精确实现 2 个子队列的磁盘调度算法是 __________ 策略。

**答案**: **FSCAN**

**解析**: FSCAN 就是为了根治短距离高频请求造成的 SCAN/C-SCAN 的粘滞现象而设计的，严格将请求区分为当前队列（处理中）和下一轮队列（收集新请求）。

**12. 题目**: RAID Level __________ employs a Hamming code to correct single-bit errors and detect double-bit errors.

**翻译**: RAID 级别 __________ 采用海明码来纠正单比特错误并检测双比特错误。

**答案**: **2**

**解析**: RAID 2 在多块数据盘旁边使用多个独立的校验盘来存储海明码（Hamming Code），提供强大的内存级纠错能力（但因商业成本和现代硬盘内部自带ECC的原因极少被使用）。

**13. 题目**: A __________ is a buffer in main memory designed for the temporary storage of disk sectors.

**翻译**: __________ 是主存中的一个缓冲区，专为磁盘扇区的临时存储而设计。

**答案**: **disk cache**

**解析**: 磁盘缓存（Disk cache）是由操作系统在内存里划分出的一片区域，用来缓存近期被读取的磁盘扇区或预读后续扇区，大幅提升命中时的访问速度。

**14. 题目**: In a UNIX system, __________ I/O typically involves the DMA facility, with the transfer taking place directly between the I/O module and the process I/O area.

**翻译**: 在 UNIX 系统中，__________ I/O 通常涉及 DMA 设施，传输直接在 I/O 模块和进程 I/O 区域之间进行。

**答案**: **unbuffered**

**解析**: 当程序为了最高性能追求自己接管缓存管理时，可以使用无缓冲 I/O（Unbuffered I/O 或 Raw I/O），此时数据直接通过 DMA 从磁盘“绕过系统缓冲区”直达用户进程的地址空间。

**15. 题目**: In a W2K system, the term __________ refers to the fact that the system improves performance by recording updates in the cache and later writing the changes to disk when demand on the processor is low.

**翻译**: 在 W2K 系统中，术语 __________ 指的是系统通过在缓存中记录更新，然后在处理器需求低时将更改写入磁盘来提高性能的事实。

**答案**: **lazy write**

**解析**: 延迟写（Lazy write）是现代操作系统缓存管理的神兵利器，它将耗时的慢速写入聚合，并在系统空闲后台周期性地刷入磁盘。