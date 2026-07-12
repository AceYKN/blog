---
title: Chap. 8
order: 8
---

# Chapter 8 - Virtual Memory

## 一、 True / False Questions (判断题)

**1. In a system employing a memory management strategy that doesn't require an entire process to be in main memory at one time, the portion of a process that is actually in main memory at any given time is defined to be the resident set of the process.**
*   **中文翻译**：在一个不要求进程一次性全部驻留在主存中的内存管理系统中，进程在任意给定时间实际存在于主存中的那部分被称为该进程的驻留集 (resident set)。
*   **答案**：**True (正确)**
*   **知识点解析**：在虚拟内存系统中，进程被划分为多个块（如页或段）。**驻留集 (Resident Set)** 就是指当前真正在物理内存（主存）中的那些页面的集合。与其对应的一个概念是 **工作集 (Working Set)**，它指的是进程在最近一段时间内实际访问过的页面集合。

**2. The condition known as thrashing occurs when the majority of the processes in main memory require repetitive blocking on a single shared I/O device in the system.**
*   **中文翻译**：当主存中的大多数进程都需要在系统中单个共享 I/O 设备上重复阻塞时，就会发生称为“抖动 (thrashing)”的情况。
*   **答案**：**False (错误)**
*   **知识点解析**：**抖动 (Thrashing)** 并不是因为争抢 I/O 设备引起的。抖动是指由于物理内存不足，操作系统频繁地将页面换出到磁盘又换入到内存，导致处理器把大部分时间花在页面置换（缺页中断处理）上，而不是执行实际的指令。这通常是因为主存中的进程数量过多（多道程序度过高），导致每个进程分不到足够的页框来容纳其工作集。

**3. The modify (M) bit is a control bit in a page table entry that indicates whether the contents of the corresponding page have been altered since the page was last loaded into memory.**
*   **中文翻译**：修改位 (M bit) 是页表项中的一个控制位，用于指示对应页面的内容自上次加载到内存后是否被更改过。
*   **答案**：**True (正确)**
*   **知识点解析**：修改位通常也被称为**脏位 (Dirty Bit)**。当页面被选中要被替换出内存时，操作系统会检查这个位。如果该位为 0，说明页面未被修改过，可以直接丢弃（因为磁盘上已经有相同的副本）；如果为 1，说明页面在内存中被写过，必须将其写回磁盘以更新副本。这极大地减少了不必要的磁盘 I/O 写入。

**4. A Page Fault occurs when the desired page table entry is not found in the Translation Lookaside Buffer (TLB).**
*   **中文翻译**：当在转换后备缓冲器 (TLB) 中找不到所需的页表项时，就会发生缺页中断 (Page Fault)。
*   **答案**：**False (错误)**
*   **知识点解析**：在 TLB 中找不到页表项被称为 **TLB Miss（TLB 缺失）**，发生这种情况时，硬件（或操作系统）会去访问内存中的页表。如果在内存的页表中发现该页面的“存在位 (Present Bit)”为 0（即该页面不在物理内存中），这才叫 **缺页中断 (Page Fault)**。

**5. One of the advantages to the programmer of virtual memory using segmentation is that it simplifies the handling of growing data structures by allowing the segment to grow or shrink as necessary.**
*   **中文翻译**：使用分段技术的虚拟内存对程序员的优势之一是，它允许段根据需要增长或缩小，从而简化了对不断增长的数据结构的处理。
*   **答案**：**True (正确)**
*   **知识点解析**：**分段 (Segmentation)** 是对程序员可见的。每个段代表一个逻辑实体（如数组、堆栈）。如果一个数据结构（比如堆栈）需要增长，操作系统可以分配一个更大的物理区域并更新段表，而不需要干扰进程的其他段，这极大地方便了动态数据结构的管理。

**6. In a combined paging/segmentation system, a user's address space is broken up into a number of fixed-size pages, which in turn are broken up into a number of segments.**
*   **中文翻译**：在结合了分页/分段的系统中，用户的地址空间被分成许多固定大小的页，这些页又被分成许多段。
*   **答案**：**False (错误)**
*   **知识点解析**：顺序完全反了。在**段页式 (Combined Paging/Segmentation)** 系统中，用户的地址空间首先根据逻辑结构被划分为多个大小可变的**段 (Segments)**，然后为了便于物理内存的分配和避免外部碎片，每个段又被划分为多个固定大小的**页 (Pages)**。

**7. To achieve sharing in a segmentation system, it is possible for a segment to be referenced in the segment tables of more than one process.**
*   **中文翻译**：为了在分段系统中实现共享，可以在多个进程的段表中引用同一个段。
*   **答案**：**True (正确)**
*   **知识点解析**：分段非常适合共享。如果多个进程需要执行同一段代码（如共享库），只需在每个进程的段表中添加一个条目，将该条目的基地址指向内存中该共享代码段的物理基址即可。

**8. Linux is an example of an operating system that does not provide virtual memory.**
*   **中文翻译**：Linux 是不提供虚拟内存的操作系统的一个例子。
*   **答案**：**False (错误)**
*   **知识点解析**：Linux 作为一个现代的成熟操作系统，**重度依赖虚拟内存管理**。它使用按需分页机制来管理进程和物理内存，绝对不是不提供虚拟内存的系统。

**9. The fetch policy determines when a page should be brought into main memory.**
*   **中文翻译**：获取策略 (fetch policy) 决定了页面应该何时被引入主存。
*   **答案**：**True (正确)**
*   **知识点解析**：虚拟内存操作系统的内存管理设计有几个核心策略：**获取策略 (Fetch Policy)** 决定何时将页读入内存（如请求调页 Demand Paging，或预调页 Prepaging）；**放置策略 (Placement Policy)** 决定将页放在哪里；**置换策略 (Replacement Policy)** 决定内存满时换出哪个页。

**10. The Least Recently Used (LRU) replacement policy replaces the page in memory that has been referenced most recently.**
*   **中文翻译**：最近最少使用 (LRU) 置换策略替换内存中最近被引用过的页面。
*   **答案**：**False (错误)**
*   **知识点解析**：名字已经说明了一切。LRU (Least Recently Used) 策略替换的是在内存中**最长时间未被访问过 (least recently)** 的页面，而不是最近刚访问过 (most recently) 的页面。LRU 基于时间局部性原理，认为很久没用的页面近期也不太会被用。

**11. A global replacement policy considers all unlocked pages in main memory as candidates for replacement, regardless of which process owns a particular page.**
*   **中文翻译**：全局置换策略将主存中所有未锁定的页面视为置换的候选者，而不管该页面属于哪个进程。
*   **答案**：**True (正确)**
*   **知识点解析**：**全局置换 (Global Replacement)** 允许一个进程引发缺页中断时，从系统中其他进程的物理页框里抢夺内存。相对的是**局部置换 (Local Replacement)**，进程只能从分配给自己进程的驻留集里挑选页面进行置换。

**12. In a precleaning policy, modified pages are written to secondary memory once they have been selected for replacement.**
*   **中文翻译**：在预清除策略中，一旦修改过的页面被选中进行置换，它们就会被写入辅助存储器（磁盘）。
*   **答案**：**False (错误)**
*   **知识点解析**：被选中置换时才写回磁盘的做法叫做 **按需清除 (Demand Cleaning)**。而 **预清除 (Precleaning)** 策略是指在这些脏页面被选中置换出内存**之前**，操作系统就成批地将它们写回磁盘，这样当之后真正需要替换页面时，这些页面的内容和磁盘上是一致的，就可以直接丢弃，加快了置换速度。

**13. SVR4 and Solaris systems use two separate schemes for memory management, one for user processes and disk I/O, and another for kernel memory allocation.**
*   **中文翻译**：SVR4 和 Solaris 系统使用两种独立的内存管理方案，一种用于用户进程和磁盘 I/O，另一种用于内核内存分配。
*   **答案**：**True (正确)**
*   **知识点解析**：这两种经典的 UNIX 系统使用**分页系统 (Paging System)** 来管理用户进程和磁盘 I/O，而内核往往需要分配许多小型的、经常使用的数据结构（如 inode、进程表等），因此使用了另一套称为 **内核内存分配器 (Kernel Memory Allocator, KMA)** 的机制（通常基于 Slab 分配器）来优化内核对象的分配。

**14. Linux makes use of a two-level page table structure, consisting of a page directory and a page table.**
*   **中文翻译**：Linux 利用两级页表结构，由页目录和页表组成。
*   **答案**：**False (错误)**
*   **知识点解析**：为了兼容 64 位架构（如最初的 Alpha 架构），Linux 早期设计了**三级页表结构**：页全局目录 (PGD)、页中间目录 (PMD) 和页表 (PTE)。在 32 位系统上，Linux 通过将中间目录的长度设为 1，使其逻辑上等同于两级页表。现代 Linux 在 64 位架构上甚至扩展到了四级或五级页表。因此，说它仅由页目录和页表两级组成是错误的。

**15. Every W2K user process sees a separate 32-bit address space, allowing 4 GB of memory per process.**
*   **中文翻译**：每个 Windows 2000 (W2K) 用户进程都看到一个独立的 32 位地址空间，允许每个进程拥有 4 GB 的内存。
*   **答案**：**True (正确)**
*   **知识点解析**：在 32 位 Windows 操作系统中，寻址空间为 $2^{32}$ 字节，即 4 GB。每个进程都有自己独立的 4 GB 虚拟地址空间，通常默认情况下，低 2 GB 分配给用户进程代码和数据，高 2 GB 留给操作系统内核。

---

## 二、 Multiple Choice Questions (单选题)

**1. The type of memory that allows for very effective multiprogramming and relieves the user of memory size constraints is referred to as:**
a. Real memory
b. Virtual memory
c. Main memory
d. All of the above
*   **中文翻译**：允许非常有效的多道程序设计并免除用户内存大小限制的内存类型被称为：
*   **答案**：**b. Virtual memory**
*   **知识点解析**：**虚拟内存 (Virtual Memory)** 通过将外存（磁盘）和主存结合，给程序员提供了一个比实际物理内存大得多的逻辑内存空间。这使得庞大的程序可以运行，同时能将更多进程放入内存中，从而实现有效的多道程序设计。

**2. The situation where the processor spends most of its time swapping process pieces rather than executing instructions is called:**
a. Paging
b. The Principle of Locality
c. Thrashing
d. None of the above
*   **中文翻译**：处理器将大部分时间花在交换进程片段而不是执行指令上的情况被称为：
*   **答案**：**c. Thrashing**
*   **知识点解析**：这就是**抖动 (Thrashing)** 的标准定义。当系统中的内存过度承诺 (overcommitted) 时，进程不断发生缺页中断，导致系统资源几乎全部耗费在磁盘 I/O 的换入换出上，CPU 的实际利用率急剧下降。

**3. The situation that occurs when the desired page table entry is not found in the Translation Lookaside Buffer (TLB) is called a:**
a. TLB miss
b. TLB hit
c. Page fault
d. None of the above
*   **中文翻译**：当在转换后备缓冲器 (TLB) 中找不到所需的页表项时发生的情况被称为：
*   **答案**：**a. TLB miss**
*   **知识点解析**：TLB 是页表的高速缓存。查找 TLB 时没有找到目标页表项，称为 **TLB 缺失 (TLB Miss)**。此时硬件需要去访问主存中完整的页表来获取映射信息，并将该条目加载进 TLB。

**4. The real address of a word in memory is translated from the following portions of a virtual address:**
a. Page number and frame number
b. Page number and offset
c. Frame number and offset
d. None of the above
*   **中文翻译**：内存中一个字的实地址（物理地址）是从虚拟地址的以下部分转换而来的：
*   **答案**：**b. Page number and offset**
*   **知识点解析**：虚拟地址（逻辑地址）由两部分组成：**页号 (Page number)** 和 **页内偏移量 (Offset)**。MMU（内存管理单元）通过查找页表，将“页号”转换为物理内存中的“页框号 (Frame number)”，然后将页框号与原封不动的“页内偏移量”拼接起来，就得到了最终的实际物理地址。

**5. Segmentation has a number of advantages to the programmer over a non-segmented address space, including:**
a. Simplifying the handling of growing data structures
b. Sharing among processes
c. Protection
d. All of the above
*   **中文翻译**：与非分段地址空间相比，分段对程序员有许多优点，包括：
*   **答案**：**d. All of the above**
*   **知识点解析**：分段由于符合程序的逻辑视图，因此：(a) 可以让数组或堆栈段独立增长；(b) 可以轻松实现进程间的代码或数据共享（只需共享特定的段）；(c) 可以对不同的段施加不同的保护权限（例如代码段设为只读，数据段设为读写）。

**6. In a combined paging/segmentation system, a user's address space is broken up into a number of:**
a. Segments or pages, at the discretion of the programmer
b. Fixed-size pages, which are in turn broken down into variable-sized segments
c. Variable-sized Segments, which are in turn broken down into fixed-size pages
d. All of the above
*   **中文翻译**：在结合了分页/分段的系统中，用户的地址空间被分为许多：
*   **答案**：**c. Variable-sized Segments, which are in turn broken down into fixed-size pages**
*   **知识点解析**：这就是段页式管理的精髓。**宏观上**对程序员来说，程序被划分为大小可变的逻辑段 (Segments)；**微观上**对操作系统来说，为了消除外部碎片，每个段在内部又被切割成了多个固定大小的页 (Pages) 进行物理内存管理。

**7. Sharing is achieved in a segmentation system by:**
a. Referencing a segment in the segment tables of more than one process
b. Each process segment table having a reference to the dispatcher main memory area
c. Having a common data area that all processes can share
d. All of the above
*   **中文翻译**：在分段系统中，共享是通过什么实现的：
*   **答案**：**a. Referencing a segment in the segment tables of more than one process**
*   **知识点解析**：通过在不同进程的段表 (Segment Table) 中建立一个表项，让这些表项指向同一个物理内存区域（同一个段），即可轻松实现共享。

**8. A fundamental choice in the design of the memory-management portion of an O/S is:**
a. Whether or not to use virtual memory techniques
b. Whether to use paging, segmentation of a combination of the two
c. The algorithms employed for various aspects of memory management
d. All of the above
*   **中文翻译**：操作系统内存管理部分设计的一个基本选择是：
*   **答案**：**d. All of the above**
*   **知识点解析**：设计 OS 的内存管理涉及宏观架构到微观算法的选择，包括：要不要虚拟内存（现代通用 OS 肯定要，但一些嵌入式 OS 可能不需要）、采用何种硬件映射结构（分页、分段还是混合）、以及具体的放置、获取、置换等算法的选择。

**9. The fetch policy that exploits the characteristics of most secondary memory devices, such as disks, which have seek time and rotational latency is called:**
a. Demand paging
b. Prepaging
c. Swapping
d. None of the above
*   **中文翻译**：利用磁盘等辅助存储设备具有寻道时间和旋转延迟这一特性的获取策略被称为：
*   **答案**：**b. Prepaging**
*   **知识点解析**：磁盘 I/O 中最耗时的是寻道时间和旋转延迟，而实际的顺序数据传输非常快。**预调页 (Prepaging)** 利用了这一点，当发生缺页中断时，不仅读入发生缺页的那个页面，还将它在磁盘上相邻的几个页面一起顺便读入内存。这极大摊销了 I/O 开销，并且根据空间局部性原理，相邻页面大概率很快会被用到。

**10. The replacement policy that is impossible to implement because it would require the O/S to have perfect knowledge of future events is called the:**
a. Optimal policy
b. Least recently used (LRU) policy
c. Clock policy
d. None of the above
*   **中文翻译**：因为要求操作系统拥有对未来事件的完美了解而不可能实现的置换策略被称为：
*   **答案**：**a. Optimal policy**
*   **知识点解析**：**最佳置换策略 (Optimal Policy, OPT)** 要求置换出那个在“未来最长时间内不会被访问到”的页面。由于 OS 无法预知进程未来的执行轨迹，所以它无法真正在生产系统中实现，仅用来作为评估其他算法性能的理论上限（标杆）。

**11. The replacement policy that chooses only among the resident pages of the process that generated the page fault in selecting a page to replace is referred to as a:**
a. Global replacement policy
b. Local replacement policy
c. Variable replacement policy
d. None of the above
*   **中文翻译**：在选择要置换的页面时，仅在产生缺页中断的进程自身的驻留页面中进行选择的置换策略被称为：
*   **答案**：**b. Local replacement policy**
*   **知识点解析**：这是 **局部置换 (Local Replacement)** 的定义。它的好处是进程之间不会因为抢夺页框而相互影响，缺点是如果系统初始分配给该进程的页框太少，它会频繁发生内部的缺页中断。

**12. The concept associated with determining the number of processes that will be resident in main memory is referred to as:**
a. A cleaning policy
b. The page fault frequency
c. Load Control
d. None of the above
*   **中文翻译**：决定将有多少个进程驻留在主存中的相关概念被称为：
*   **答案**：**c. Load Control**
*   **知识点解析**：**负载控制 (Load Control)** 决定了系统的多道程序度 (Multiprogramming level)。如果驻留进程太少，CPU 经常会因为所有进程都在等待 I/O 而空闲；如果驻留进程太多，每个进程分到的页框太少，又会导致严重的抖动 (Thrashing)。因此必须精确控制。

**13. In SVR4 and Solaris systems, the memory management scheme that manages user processes and disk I/O is called the:**
a. Paging system
b. Virtual memory manager
c. Kernel memory allocator
d. None of the above
*   **中文翻译**：在 SVR4 和 Solaris 系统中，管理用户进程和磁盘 I/O 的内存管理方案被称为：
*   **答案**：**a. Paging system**
*   **知识点解析**：如前所述，Unix系统如 SVR4 的内存管理主要分两部分：用于用户和磁盘缓冲的 **分页系统 (Paging System)**，以及专用于内核小对象分配的内核内存分配器 (KMA)。

**14. The multi-level memory management scheme implemented in Linux was designed to minimize large page tables and directories in which of the following line of processors:**
a. 16-bit X86 architecture
b. 32-bit Pentium/X86 architecture
c. 64-bit Alpha architecture
d. None of the above
*   **中文翻译**：在 Linux 中实现的多级内存管理方案旨在最大限度地减少大页表和目录，这最初是为了适应下列哪种处理器架构：
*   **答案**：**c. 64-bit Alpha architecture**
*   **知识点解析**：最初的 Linux 只支持 32 位的 x86 处理器，使用了两级页表。当 Linux 移植到 64 位的 DEC Alpha 架构时，巨大的地址空间使得两级页表会占用庞大的连续内存，因此内核开发者引入了三级页表结构来稀疏化并减少页表的内存占用。

**15. The Windows 2000 virtual memory manager can use page sizes ranging from:**
a. 4 KB to 64 KB
b. 64 KB to 4 GB
c. 4 GB to 4 TB
d. None of the above
*   **中文翻译**：Windows 2000 虚拟内存管理器可以使用的页面大小范围是：
*   **答案**：**a. 4 KB to 64 KB**
*   **知识点解析**：操作系统通常支持不同架构下的多种页面大小。在 Windows 2000 中，根据底层处理器的不同，页面大小的范围是从 4 KB (例如 x86 系统) 到 64 KB (某些其他支持的架构) 不等。同时现代硬件通常也支持利用大页面 (Large Pages)，例如 x86 下的 2MB 或 4MB 页面，但在本题考查的章节上下文细节中，选项 a 反映了不同基础架构的常规页面大小设定范围。

---

## 三、 Fill-In-The-Blank Questions (填空题)

**1. In a system employing a memory management strategy that doesn't require an entire process to be in main memory at one time, the portion of a process that is actually in main memory at any given time is defined to be the \_\_\_\_\_\_\_\_ of the process.**
*   **中文翻译**：进程在任意给定时间实际存在于主存中的那部分被称为该进程的 \_\_\_\_\_\_\_\_。
*   **答案**：**resident set (驻留集)**
*   **知识点解析**：进程的所有页面集合构成它的虚拟地址空间，而真正加载到物理内存里的那个子集就叫做驻留集。

**2. The situation where the processor spends most of its time swapping process pieces rather than executing instructions is called \_\_\_\_\_\_\_\_.**
*   **中文翻译**：处理器将大部分时间花在交换进程片段而不是执行指令上的情况被称为 \_\_\_\_\_\_\_\_。
*   **答案**：**thrashing (抖动)**
*   **知识点解析**：这是一种极度恶化的系统状态，多道程序度越过了最优边界后性能断崖式下跌的表现。

**3. Most virtual memory schemes make use of a special high-speed cache for page table entries, called a \_\_\_\_\_\_\_\_.**
*   **中文翻译**：大多数虚拟内存方案都使用一个特殊的用于页表项的高速缓存，称为 \_\_\_\_\_\_\_\_。
*   **答案**：**Translation Lookaside Buffer / TLB (转换后备缓冲器)**
*   **知识点解析**：由于每次虚拟地址到物理地址的转换都需要访问内存中的页表，为了加速这一过程，TLB 会缓存最近使用过的页表项，其硬件本质是相联存储器 (Associative Memory)。

**4. Each entry in a \_\_\_\_\_\_\_\_ contains control bits and the corresponding frame number if the page is resident in memory.**
*   **中文翻译**：如果页面驻留在内存中，\_\_\_\_\_\_\_\_ 中的每个条目都包含控制位和对应的页框号。
*   **答案**：**page table (页表)**
*   **知识点解析**：页表将逻辑页映射到物理页框。其条目 (PTE) 除了包含页框号，通常还包括存在位 (Present Bit)、修改位 (Modify Bit)、访问位 (Accessed Bit) 以及读写权限等控制位。

**5. In a segmentation system, each entry in a \_\_\_\_\_\_\_\_ contains control bits and the starting address and the length of the segment.**
*   **中文翻译**：在分段系统中，\_\_\_\_\_\_\_\_ 中的每个条目都包含控制位以及该段的起始地址和长度。
*   **答案**：**segment table (段表)**
*   **知识点解析**：因为段是大小可变的，因此不仅要记录它在内存中的起始物理位置（基址），还必须记录它的边界即**段长 (length / limit)**。如果程序访问的偏移量超出了段长，硬件会立刻触发越界异常（这也是保护机制的核心）。

**6. \_\_\_\_\_\_\_\_ which is transparent to the programmer, eliminates external fragmentation, provides efficient use of main memory, and has pieces of fixed, equal size.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 对程序员是透明的，它消除了外部碎片，提供了主存的高效利用，并且具有固定、相等大小的块。
*   **答案**：**Paging (分页)**
*   **知识点解析**：由于页的大小是固定的，操作系统可以直接将任何一页放进任意一个空闲的页框中，无需连续分配，彻底消灭了外部碎片，但它是纯底层的硬件/操作系统机制，程序员通常感知不到它的存在。

**7. \_\_\_\_\_\_\_\_ which is visible to the programmer, has the ability to handle growing data structures, modularity, and support for sharing and protection.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 对程序员是可见的，具备处理不断增长的数据结构的能力，支持模块化，并支持共享和保护。
*   **答案**：**Segmentation (分段)**
*   **知识点解析**：分段完全符合程序模块的逻辑划分，是高级语言及程序员眼中的内存视图。

**8. An example of an O/S that doesn't provide virtual memory is \_\_\_\_\_\_\_\_.**
*   **中文翻译**：不提供虚拟内存的操作系统的一个例子是 \_\_\_\_\_\_\_\_。
*   **答案**：**MS-DOS (或早期操作系统 / 某些嵌入式操作系统)**
*   **知识点解析**：像 MS-DOS 这类早期的、在资源极其受限环境下运行的单任务操作系统，并没有实现复杂的虚拟内存管理。

**9. The fetch policy where a page is brought into main memory only if a reference is made to a location on that page is called \_\_\_\_\_\_\_\_.**
*   **中文翻译**：只有在对页面上的位置进行引用时才将该页面引入主存的获取策略被称为 \_\_\_\_\_\_\_\_。
*   **答案**：**demand paging (请求调页)**
*   **知识点解析**：这是最经典的虚拟内存拉取策略。进程启动时不装入所有的页，而是发生缺页中断时，才“按需”从磁盘上把对应的页调入内存。

**10. The replacement policy that treats the page frames allocated to a process as a circular buffer is called \_\_\_\_\_\_\_\_.**
*   **中文翻译**：将分配给进程的页框视为循环缓冲区的置换策略被称为 \_\_\_\_\_\_\_\_。
*   **答案**：**FIFO (先进先出 / First-In-First-Out) 或 Clock (时钟策略)**
*   **知识点解析**：FIFO 策略本质上就是维护一个队列（循环缓冲区），换出在内存中驻留时间最久的页面。Clock 策略也使用循环缓冲区的结构，配合一个指针（像钟表指针）和使用位 (Use Bit) 来扫描和置换。填 FIFO 是最基础直接的答案。

**11. A \_\_\_\_\_\_\_\_ replacement policy chooses only among the resident ages of the process that generated the page fault in selecting a page to replace.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 置换策略在选择要置换的页面时，仅在产生缺页中断的进程自身的驻留页面中进行选择。
*   **答案**：**local (局部)**
*   **知识点解析**：局部置换意味着各个进程独立管理各自的页面池，相互不影响。

**12. A \_\_\_\_\_\_\_\_ policy writes modified pages before their page frames are needed so that pages can be written out in batches.**
*   **中文翻译**：\_\_\_\_\_\_\_\_ 策略在需要页框之前先写入修改过的页面，这样页面就可以分批写出。
*   **答案**：**precleaning (预清除)**
*   **知识点解析**：与之相对的 Demand Cleaning（按需清除）是在置换发生时才写磁盘。Precleaning 可以利用磁盘批处理写入来提高吞吐量。

**13. In SVR4 and Solaris systems, the memory management scheme that manages memory allocation for the kernel is called the \_\_\_\_\_\_\_\_.**
*   **中文翻译**：在 SVR4 和 Solaris 系统中，为内核管理内存分配的内存管理方案被称为 \_\_\_\_\_\_\_\_。
*   **答案**：**kernel memory allocator / KMA (内核内存分配器)**
*   **知识点解析**：内核自身不能被换出（通常常驻物理内存），且它需要频繁地创建和销毁微小的结构（远远小于一个 Page 的大小），因此操作系统需要 KMA 这样的特殊设施来高效管理这一层。

**14. Linux systems use a \_\_\_\_\_\_\_\_-level page table structure in its memory management scheme to accommodate large addresses.**
*   **中文翻译**：Linux 系统在其内存管理方案中使用 \_\_\_\_\_\_\_\_ 级页表结构来容纳大地址。
*   **答案**：**three (三) / (或 multi/多)**
*   **知识点解析**：根据原版教材上下文，为了适应 64 位寻址，Linux 确立了经典的三级页表结构：PGD、PMD、PTE。（注：最新内核已发展到四级或五级，但作为这本教材的填空考核点，通常标准答案是 three）。

**15. In a W2K system, although each user sees a 32-bit address space, allowing 4 GB of memory per process, a portion of this memory is reserved for O/S use, so a user process actually has access to \_\_\_\_\_\_\_\_ of virtual address space.**
*   **中文翻译**：在 W2K 系统中，虽然每个用户都能看到一个 32 位的地址空间（允许每个进程有 4GB 的内存），但这部分内存有一部分是保留给 OS 使用的，因此用户进程实际可访问的虚拟地址空间为 \_\_\_\_\_\_\_\_。
*   **答案**：**2 GB**
*   **知识点解析**：在默认情况下的 32 位 Windows 系统中，4 GB 的总虚拟地址空间被切半：`0x00000000` 到 `0x7FFFFFFF` 的 2 GB 给用户态程序自由使用，`0x80000000` 到 `0xFFFFFFFF` 的 2 GB 强制保留给操作系统内核以及硬件驱动程序。