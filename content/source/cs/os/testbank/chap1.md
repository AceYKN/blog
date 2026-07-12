---
title: Chap. 1
order: 1
---

# Chapter 1 - Computer System Overview

## 一、 True / False Questions (判断题)

**1. The operating system acts as an interface between the computer hardware and the human user.**
*   **中文翻译**：操作系统充当计算机硬件和人类用户之间的接口。
*   **答案**：**True (正确)**
*   **知识点讲解**：这是操作系统的核心定义之一。操作系统向用户（以及应用程序员）提供一个方便、抽象的接口，屏蔽了底层硬件的复杂细节（例如，你不需要知道如何控制硬盘磁头就能保存文件）。

**2. One of the processor's main functions is to exchange data with memory.**
*   **中文翻译**：处理器的主要功能之一是与内存交换数据。
*   **答案**：**True (正确)**
*   **知识点讲解**：处理器的基本操作包括：读取指令、读取数据（操作数）、处理数据、写回结果。在这个过程中，它必须通过系统总线频繁地与主存（Main Memory）进行数据交换。

**3. User-visible registers are typically accessible to system programs but are not typically available to application programs.**
*   **中文翻译**：用户可见寄存器通常可由系统程序访问，但通常不可供应用程序访问。
*   **答案**：**False (错误)**
*   **知识点讲解**：名字已经说明了，“**用户可见寄存器 (User-visible registers)**”正是设计给所有程序员（包括应用程序员）使用的，例如通用数据寄存器和地址寄存器。而**控制和状态寄存器 (Control/Status registers)**（如程序计数器 PC、指令寄存器 IR、程序状态字 PSW 的某些位）才是通常只允许系统程序（操作系统内核）在特权模式下修改的。

**4. Data registers are general purpose in nature, but may be restricted to specific tasks such as performing floating-point operations.**
*   **中文翻译**：数据寄存器本质上是通用的，但可能会被限制于特定任务，例如执行浮点运算。
*   **答案**：**True (正确)**
*   **知识点讲解**：数据寄存器可用于各种算术和逻辑操作。但在很多处理器架构中，为了效率，会将通用整数寄存器和专用的浮点寄存器（Floating-point registers）分开，后者专门用于执行特定的浮点运算任务。

**5. The Program Status Word contains status information in the form of condition codes, which are bits typically set by the programmer as a result of program operation.**
*   **中文翻译**：程序状态字 (PSW) 以条件码的形式包含状态信息，这些位通常是由程序员作为程序操作的结果设置的。
*   **答案**：**False (错误)**
*   **知识点讲解**：PSW 中的条件码（如进位标志 Carry、溢出标志 Overflow、零标志 Zero、负数标志 Sign）是由**处理器硬件自动设置的**，以反映最近一次算术或逻辑操作的结果。程序员可以测试（读取）这些位来进行条件跳转，但通常**不直接手动设置**它们。

**6. The processing required for a single instruction on a typical computer system is called the Execute Cycle.**
*   **中文翻译**：在典型的计算机系统上处理单个指令所需的过程被称为执行周期 (Execute Cycle)。
*   **答案**：**False (错误)**
*   **知识点讲解**：处理单个指令所需的完整过程被称为**指令周期 (Instruction Cycle)**。一个基本的指令周期至少包含两个步骤：**获取周期 (Fetch Cycle)** 和 **执行周期 (Execute Cycle)**。Execute Cycle 只是其中的一半。

**7. A fetched instruction is normally loaded into the Instruction Register (IR).**
*   **中文翻译**：获取的指令通常被加载到指令寄存器 (IR) 中。
*   **答案**：**True (正确)**
*   **知识点讲解**：这是指令执行的标准流程。处理器从内存中读取指令后，会将其存放在 CPU 内部的**指令寄存器 (Instruction Register, IR)** 中，随后解码并执行该指令。

**8. An interrupt is a mechanism used by system modules to signal the processor that normal processing should be temporarily suspended.**
*   **中文翻译**：中断是系统模块用来向处理器发出信号，指示应暂时中止正常处理的机制。
*   **答案**：**True (正确)**
*   **知识点讲解**：**中断 (Interrupt)** 允许 I/O 设备、计时器或其他硬件组件打断 CPU 当前的顺序执行流程，使其立刻去处理更高优先级或突发的紧急事件（即执行中断处理程序），处理完毕后再恢复原程序的执行。

**9. To accommodate interrupts, an extra fetch cycle is added to the instruction cycle.**
*   **中文翻译**：为了适应中断，指令周期中增加了一个额外的获取周期 (fetch cycle)。
*   **答案**：**False (错误)**
*   **知识点讲解**：为了处理中断，指令周期中增加的不是 fetch cycle，而是**中断周期 (Interrupt Cycle)**。在这个周期中，处理器会检查是否有中断挂起，如果有，则保存当前状态并跳转到中断处理程序。

**10. The minimum information that must be saved before the processor transfers control to the interrupt handler routine is the program status word (PSW) and the location of the current instruction.**
*   **中文翻译**：处理器将控制权转移给中断处理程序之前必须保存的最小信息是程序状态字 (PSW) 和当前指令的位置。
*   **答案**：**False (错误)**
*   **知识点讲解**：处理器必须保存 PSW 和**下一条将要执行的指令的位置**（即**程序计数器 PC** 的值），而不是“当前指令的位置”。如果保存的是当前指令，中断返回后就会重复执行同一条指令。

**11. One approach to dealing with multiple interrupts is to disable all interrupts while an interrupt is being processed.**
*   **中文翻译**：处理多个中断的一种方法是在处理中断时禁用所有中断。
*   **答案**：**True (正确)**
*   **知识点讲解**：这是处理多重中断最简单的方法：**顺序中断处理 (Sequential interrupt processing)**。在处理一个中断时关闭中断响应，其他中断只能排队等待。另一种更高级的方法是**嵌套中断 (Nested interrupts)**，允许高优先级中断打断低优先级中断。

**12. Multiprogramming allows the processor to make use of idle time caused by long-wait interrupt handling.**
*   **中文翻译**：多道程序设计允许处理器利用因长时间等待中断处理而造成的空闲时间。
*   **答案**：**True (正确)**
*   **知识点讲解**：这是**多道程序设计 (Multiprogramming)** 的核心优势。当一个程序（A）因为发起 I/O 操作而必须长时间等待时，CPU 可以切换去执行内存中的另一个程序（B），从而最大限度地减少了 CPU 的空闲浪费。

**13. In a two-level memory hierarchy, the Hit Ratio is defined as the fraction of all memory accesses found in the slower memory.**
*   **中文翻译**：在两级内存层次结构中，命中率 (Hit Ratio) 被定义为在较慢内存中找到的所有内存访问的比例。
*   **答案**：**False (错误)**
*   **知识点讲解**：命中率定义为在**较快/较高层内存（例如 Cache）**中找到所需数据的访问次数占总内存访问次数的比例。如果在慢速内存中才找到，那叫缺失 (Miss)。

**14. Cache memory exploits the principle of locality by providing a small, fast memory between the processor and main memory.**
*   **中文翻译**：高速缓存 (Cache memory) 利用局部性原理，在处理器和主存之间提供了一个小型快速的内存。
*   **答案**：**True (正确)**
*   **知识点讲解**：**局部性原理 (Principle of Locality)**（分为时间局部性和空间局部性）表明程序在短期内倾向于集中访问一小部分内存区域。Cache 正是利用这一点，将最可能被访问的数据保留在靠近 CPU 的高速区域，极大提升了系统速度。

**15. In cache memory design, block size refers to the unit of data exchanged between cache and main memory.**
*   **中文翻译**：在高速缓存设计中，块大小 (block size) 指的是在缓存和主存之间交换数据的单位。
*   **答案**：**True (正确)**
*   **知识点讲解**：主存被划分为固定大小的**块 (Blocks)**，Cache 被划分为同样大小的**槽/行 (Slots/Lines)**。Cache 和主存之间的数据传输不是按字节，而是按整个 Block 为单位进行的。

**16. The primary problem with programmed I/O is that the processor must wait for the I/O module to become ready and must repeatedly interrogate the status of the I/O module while waiting.**
*   **中文翻译**：可编程 I/O (programmed I/O) 的主要问题是，处理器必须等待 I/O 模块准备就绪，并在等待时必须重复询问 I/O 模块的状态。
*   **答案**：**True (正确)**
*   **知识点讲解**：在**程序控制 I/O (Programmed I/O)** 中，CPU 发出 I/O 指令后，必须通过一个循环不断读取状态寄存器来检查 I/O 是否完成（即轮询 Polling）。这会导致 CPU 时间被大量浪费在无意义的等待上（忙等 busy-waiting）。

---

## 二、 Multiple Choice Questions (单选题)

**1. The general role of an operating system is to:**
a. Act as an interface between various computers
b. Provide a set of services to system users
c. Manage files for application programs
d. None of the above
*   **中文翻译**：操作系统的一般作用是：
*   **答案**：**b. Provide a set of services to system users**
*   **知识点讲解**：操作系统最宏观的作用是作为资源管理器和用户接口，为系统用户（包括终端用户和应用程序）提供一组系统服务（如文件管理、进程调度等）。虽然 c 也是 OS 的功能之一，但 b 是最全面和准确的概括。

**2. The four main structural elements of a computer system are:**
a. Processor, Registers, I/O Modules & Main Memory
b. Processor, Registers, Main Memory & System Bus
c. Processor, Main Memory, I/O Modules & System Bus
d. None of the above
*   **中文翻译**：计算机系统的四个主要结构元素是：
*   **答案**：**c. Processor, Main Memory, I/O Modules & System Bus**
*   **知识点讲解**：计算机顶层架构的四大基本组件是：执行处理的**处理器 (Processor/CPU)**、存储指令和数据的**主存 (Main Memory)**、负责外部通信的 **I/O 模块 (I/O Modules)**，以及连接它们的**系统总线 (System Bus)**。寄存器是包含在 Processor 内部的。

**3. The two basic types of processor registers are:**
a. User-visible and Control/Status registers
b. Control and Status registers
c. User-visible and user-invisible registers
d. None of the above
*   **中文翻译**：处理器寄存器的两种基本类型是：
*   **答案**：**a. User-visible and Control/Status registers**
*   **知识点讲解**：按照用途分类，寄存器分为**用户可见寄存器 (User-visible registers)**（如数据、地址寄存器，供汇编程序员使用）和**控制与状态寄存器 (Control/Status registers)**（如 PC、IR、PSW，由 CPU 硬件和内核使用控制系统操作）。

**4. Address registers may contain:**
a. Memory addresses of data
b. Memory addresses of instructions
c. Partial memory addresses
d. All of the above
*   **中文翻译**：地址寄存器可能包含：
*   **答案**：**d. All of the above**
*   **知识点讲解**：**地址寄存器**用于存放主存地址。它可以存放数据的地址、指令的地址，或者在某些寻址方式（如基址寻址或段式寻址）中存放部分地址（偏移量或基址），因此以上皆有可能。

**5. A Control/Status register that contains the address of the next instruction to be fetched is called the:**
a. Instruction Register (IR)
b. Program Counter (PC)
c. Program Status Word (PSW)
d. All of the above
*   **中文翻译**：包含要获取的下一条指令地址的控制/状态寄存器被称为：
*   **答案**：**b. Program Counter (PC)**
*   **知识点讲解**：**程序计数器 (Program Counter, PC)** 的唯一职责就是保存下一条将要被 CPU 从内存中取出的指令的地址。

**6. The two basic steps used by the processor in instruction processing are:**
a. Fetch and Instruction cycles
b. Instruction and Execute cycles
c. Fetch and Execute cycles
d. None of the above
*   **中文翻译**：处理器在指令处理中使用的两个基本步骤是：
*   **答案**：**c. Fetch and Execute cycles**
*   **知识点讲解**：最简单的指令周期由两部分组成：第一步从内存读取指令，即**获取周期 (Fetch Cycle)**；第二步解码并执行该指令，即**执行周期 (Execute Cycle)**。

**7. A fetched instruction is normally loaded into the:**
a. Instruction Register (IR)
b. Program Counter (PC)
c. Accumulator (AC)
d. None of the above
*   **中文翻译**：获取的指令通常被加载到：
*   **答案**：**a. Instruction Register (IR)**
*   **知识点讲解**：指令被获取后，会存放在 CPU 的**指令寄存器 (Instruction Register, IR)** 中，由控制单元进行解码分析。

**8. A common class of interrupts is:**
a. Program
b. Timer
c. I/O
d. All of the above
*   **中文翻译**：常见的一类中断是：
*   **答案**：**d. All of the above**
*   **知识点讲解**：中断通常分为四大类：**程序中断**（如除以零、越界）、**定时器中断**（由操作系统时钟产生，用于分时调度）、**I/O 中断**（I/O 设备完成操作或出错时产生）以及**硬件故障中断**（如断电、内存奇偶校验错）。

**9. When an external device becomes ready to be serviced by the processor, the device sends this type of signal to the processor:**
a. Interrupt signal
b. Halt signal
c. Handler signal
d. None of the above
*   **中文翻译**：当外部设备准备好由处理器提供服务时，该设备向处理器发送此类型的信号：
*   **答案**：**a. Interrupt signal**
*   **知识点讲解**：外部设备（如网卡接收到数据、硬盘读写完成）通过向 CPU 的特定引脚发送**中断信号 (Interrupt signal)** 来通知 CPU 需要服务。

**10. Information that must be saved prior to the processor transferring control to the interrupt handler routine includes:**
a. Processor Status Word (PSW)
b. Processor Status Word (PSW) & Location of next instruction
c. Processor Status Word (PSW) & Contents of processor registers
d. None of the above
*   **中文翻译**：处理器在将控制权转移到中断处理程序之前必须保存的信息包括：
*   **答案**：**b. Processor Status Word (PSW) & Location of next instruction**
*   **知识点讲解**：在响应中断的硬件层面上，CPU 必须自动压栈保存**最小集信息**，以便中断结束后能够准确恢复。这包括当前的执行状态 **PSW** 和被打断程序的断点，即**下一条指令的地址 (PC)**。其他通用寄存器的内容通常由中断处理程序（软件）在开始执行时手动保存。

**11. One accepted method of dealing with multiple interrupts is to:**
a. Define priorities for the interrupts
b. Disable all interrupts except those of highest priority
c. Service them in round-robin fashion
d. None of the above
*   **中文翻译**：处理多重中断的一种公认方法是：
*   **答案**：**a. Define priorities for the interrupts**
*   **知识点讲解**：为了更高效地处理多个突发事件，现代系统会为不同类型的中断**定义优先级 (Define priorities)**。高优先级的中断（如硬件时钟、磁盘 I/O）可以打断正在执行的低优先级中断（如键盘输入），实现嵌套中断处理。

**12. In a uniprocessor system, multiprogramming increases processor efficiency by:**
a. Increasing processor speed
b. Taking advantage of time wasted by long wait interrupt handling
c. Eliminating all idle processor cycles
d. All of the above
*   **中文翻译**：在单处理器系统中，多道程序设计通过以下方式提高处理器效率：
*   **答案**：**b. Taking advantage of time wasted by long wait interrupt handling**
*   **知识点讲解**：多道程序设计无法物理上提升 CPU 速度，也无法完全消除所有空闲周期。它的核心原理是利用程序在等待慢速 I/O 操作时产生的空闲时间，让 CPU 去执行其他准备好的程序。

**13. As one proceeds down the memory hierarchy (i.e., from inboard memory to offline storage), the following condition(s) apply:**
a. Increasing cost per bit
b. Decreasing capacity
c. Increasing access time
d. All of the above
*   **中文翻译**：当沿着内存层次结构向下（即从板载内存到离线存储）时，适用以下情况：
*   **答案**：**c. Increasing access time**
*   **知识点讲解**：内存金字塔向下（从寄存器 -> Cache -> 主存 -> 硬盘 -> 磁带）：**访问时间变长 (Increasing access time)**，**容量变大 (Increasing capacity)**，并且 **每位成本下降 (Decreasing cost per bit)**。因此只有 c 是正确的。

**14. Small, fast memory located between the processor and main memory is called:**
a. WORM memory
b. Cache memory
c. CD-RW memory
d. None of the above
*   **中文翻译**：位于处理器和主存之间的小型快速内存被称为：
*   **答案**：**b. Cache memory**
*   **知识点讲解**：为了弥合高速 CPU 和相对慢速的主存之间的速度差异，引入了基于 SRAM 技术的**高速缓存 (Cache memory)**。

**15. When a new block of data is written into cache memory, the following determines which cache location the block will occupy:**
a. Block size
b. Cache size
c. Write policy
d. None of the above
*   **中文翻译**：当新数据块写入缓存时，以下哪项决定了该块将占据哪个缓存位置：
*   **答案**：**d. None of the above**
*   **知识点讲解**：决定内存块存放在 Cache 哪个位置的是 **映射函数 (Mapping function)**，例如直接映射、全相联映射或组相联映射。而如果缓存已满，决定替换谁的是 **置换算法 (Replacement algorithm)**。选项中并未给出正确答案。

**16. Direct Memory Access (DMA) operations require the following information from the processor:**
a. Address of I/O device
b. Starting memory location to read from or write to
c. Number of words to be read or written
d. All of the above
*   **中文翻译**：直接内存访问 (DMA) 操作需要处理器提供以下信息：
*   **答案**：**d. All of the above**
*   **知识点讲解**：为了让 DMA 控制器自主完成大块数据的传输，CPU 必须初始化 DMA，告诉它：操作的是哪个 **I/O 设备的地址**，主存的**起始地址**，是读还是写，以及要传输的**数据字数**。设置完毕后，CPU 就可以离开，DMA 完成传输后会发出中断。

---

## 三、 Fill-In-The-Blank Questions (填空题)

**1. An operating system exploits the hardware resources of one or more processors to provide a set of services to \_\_\_\_\_\_\_\_.**
*   **中文翻译**：操作系统利用一个或多个处理器的硬件资源，为 \_\_\_\_\_\_\_\_ 提供一组服务。
*   **答案**：**system users (系统用户)** 或 **applications (应用程序)**
*   **知识点讲解**：操作系统作为一个管理者和服务提供者，主要服务对象是使用计算机的用户以及运行在计算机上的各种应用程序。

**2. Each location in Main Memory contains a \_\_\_\_\_\_\_\_ that can be interpreted as either an instruction or data.**
*   **中文翻译**：主存中的每个位置都包含一个 \_\_\_\_\_\_\_\_，它可以被解释为指令或数据。
*   **答案**：**bit pattern (位模式/二进制模式)** 或 **word (字)**
*   **知识点讲解**：冯·诺依曼架构的核心特性就是“存储程序”，指令和数据以相同的二进制形式（位模式）混合存储在内存中。CPU 取决于执行周期的阶段来决定如何解释这些二进制位。

**3. Registers that are used by system programs to minimize main memory references by optimizing register use are called \_\_\_\_\_\_\_\_.**
*   **中文翻译**：由系统程序用来通过优化寄存器使用来最大限度地减少主存引用的寄存器被称为 \_\_\_\_\_\_\_\_。
*   **答案**：**user-visible registers (用户可见寄存器)**
*   **知识点讲解**：编译器或汇编程序员会尽可能多地将高频使用的变量分配到通用的**用户可见寄存器**中，因为访问寄存器的速度远快于访问主存。

**4. A special type of address register, required by a system that implements user-visible stack addressing, is called a \_\_\_\_\_\_\_\_.**
*   **中文翻译**：实现用户可见堆栈寻址的系统所需的一种特殊类型的地址寄存器被称为 \_\_\_\_\_\_\_\_。
*   **答案**：**stack pointer (堆栈指针 / SP)**
*   **知识点讲解**：现代 CPU 硬件直接支持堆栈结构（用于函数调用和局部变量），并提供了一个专门的地址寄存器：**堆栈指针 (Stack Pointer, SP)**，它总是指向当前栈顶的内存地址。

**5. The \_\_\_\_\_\_\_\_ contains the most recently fetched instruction.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 包含最近获取的指令。
*   **答案**：**Instruction Register / IR (指令寄存器)**
*   **知识点讲解**：再次巩固前文知识，CPU 从内存中 Fetch 出来的指令，在解码和执行前存放在 IR 中。

**6. The processing required for a single instruction is called a(n) \_\_\_\_\_\_\_\_.**
*   **中文翻译**：单条指令所需的处理过程称为 \_\_\_\_\_\_\_\_。
*   **答案**：**instruction cycle (指令周期)**
*   **知识点讲解**：一条指令的生命周期，包括 Fetch 和 Execute 等阶段，统称为 Instruction Cycle。

**7. A fetched instruction is normally loaded into the \_\_\_\_\_\_\_\_ cycle.**
*   **中文翻译**：获取的指令通常被加载到 \_\_\_\_\_\_\_\_ 周期中。
*(注：这道填空题的原题表达有些语义问题，通常应问加载到哪里(IR)。但按照其后跟 "cycle" 一词，可以理解为它想问这发生在什么周期。若题目旨在询问放入何处，应填 IR。基于教材上下文，最合理的断句可能是填 Instruction Register，无视其后的冗余单词，或填写 execute 表示随后进入执行。我们给出标准器件答案)*
*   **答案**：**Instruction Register (IR)** *(题干中 cycle 可能是多余的错别字，若必须填阶段，则是 fetch )*
*   **知识点讲解**：如多选题所述， fetched instruction 是被加载到 IR 中的。

**8. An arithmetic overflow condition resulting from some instructional execution will generate a(n) \_\_\_\_\_\_\_\_ interrupt.**
*   **中文翻译**：由某些指令执行产生的算术溢出情况将生成一个 \_\_\_\_\_\_\_\_ 中断。
*   **答案**：**program (程序 / 异常)** 或 **hardware failure (硬件故障)** / 通常分类为 **program**。
*   **知识点讲解**：算术溢出、除以零、内存越界访问等都是由正在执行的**程序指令本身引起**的错误，它们会触发硬件抛出一种同步中断，统称为**程序中断 (Program Interrupt) 或异常/陷入 (Exception/Trap)**。

**9. To accommodate interrupts, a(n) \_\_\_\_\_\_\_\_ is added to the basic instruction cycle.**
*   **中文翻译**：为了适应中断，基础指令周期中增加了一个 \_\_\_\_\_\_\_\_。
*   **答案**：**interrupt stage (中断阶段)** 或 **interrupt cycle (中断周期)**
*   **知识点讲解**：在 Fetch 和 Execute 周期之后，CPU 进入 **Interrupt Cycle**，检查中断请求引脚是否有信号。

**10. The \_\_\_\_\_\_\_\_ is part of the information that must be saved prior to the processor transferring control to the interrupt handler routine, and it tells the processor where to return control to the previously interrupted program.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 是处理器将控制权转移到中断处理程序之前必须保存的信息的一部分，它告诉处理器应将控制权返回到先前被中断程序的位置。
*   **答案**：**program counter / PC (程序计数器)**
*   **知识点讲解**：**程序计数器 (PC)** 保存着被打断程序下一条要执行的指令的地址。中断返回指令（如 IRET）会恢复这个值，使程序无缝继续运行。

**11. A drawback to the disable interrupt strategy of dealing with multiple interrupts is that it doesn't account for \_\_\_\_\_\_\_\_.**
*   **中文翻译**：处理多重中断的禁用中断策略的一个缺点是它没有考虑到 \_\_\_\_\_\_\_\_。
*   **答案**：**relative priority (相对优先级)** 或 **time-critical needs (时间关键型需求)**
*   **知识点讲解**：如果处理一个中断时完全关闭其他所有中断，那么一些对时间极度敏感、优先级极高的紧急中断（如电源故障警告或高速网卡数据）将无法得到及时响应，可能导致数据丢失或系统崩溃。

**12. The concept of multiple programs taking turns in execution is known as \_\_\_\_\_\_\_\_.**
*   **中文翻译**：多个程序轮流执行的概念被称为 \_\_\_\_\_\_\_\_。
*   **答案**：**multiprogramming (多道程序设计)**
*   **知识点讲解**：内存中驻留多个程序，当一个程序 I/O 阻塞时，CPU 切换给另一个程序执行，这就是多道程序设计的本质。

**13. The memory design dilemma (regarding cost vs. capacity vs. access time) is solved by employing a(n) \_\_\_\_\_\_\_\_.**
*   **中文翻译**：内存设计的困境（关于成本、容量与访问时间）通过采用 \_\_\_\_\_\_\_\_ 来解决。
*   **答案**：**memory hierarchy (内存层次结构)**
*   **知识点讲解**：人们想要速度快、容量大又便宜的内存，物理上无法做到。解决之道就是构建**内存金字塔 (Memory Hierarchy)**，结合少量昂贵的高速缓存和大量廉价的低速存储。

**14. \_\_\_\_\_\_\_\_ exploits the principle of locality by providing a small, fast memory between the processor and main memory.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 利用局部性原理，在处理器和主存之间提供了一个小型快速的内存。
*   **答案**：**Cache memory (高速缓存)**
*   **知识点讲解**：这是 Cache 设计的根本原理。

**15. The \_\_\_\_\_\_\_\_ chooses, within the constraints of the mapping function, which block to replace when a new block is to be loaded and all cache slots are already filled.**
*   **中文翻译**：当要加载一个新块且所有缓存槽都已填满时，\_\_\_\_\_\_\_\_ 在映射函数的约束下，选择要置换哪个块。
*   **答案**：**replacement algorithm (置换算法)**
*   **知识点讲解**：当 Cache 发生冲突（空间满）时，需要决策丢弃谁。常用的**置换算法**有 LRU（最近最少使用）、FIFO、随机等。

**16. Interrupt-driven I/O, although more efficient than simple Programmed I/O, still requires the use of the \_\_\_\_\_\_\_\_ to transfer data between memory and an I/O module.**
*   **中文翻译**：中断驱动的 I/O 虽然比简单的可编程 I/O 更有效，但仍然需要使用 \_\_\_\_\_\_\_\_ 来在内存和 I/O 模块之间传输数据。
*   **答案**：**processor / CPU (处理器)**
*   **知识点讲解**：无论是 Programmed I/O 还是 Interrupt-driven I/O，**数据的实际搬运工作（从 I/O 读到寄存器，再从寄存器写到内存）依然是由 CPU 执行指令完成的**，这会占用 CPU 周期。这也是为什么后来发明了 DMA 技术的原因（DMA 允许 I/O 设备绕过 CPU 直接访问内存）。