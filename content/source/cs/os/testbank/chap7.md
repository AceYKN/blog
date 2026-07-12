---
title: Chap. 7
order: 7
---

# Chapter 7 Memory Management

## True / False Questions (判断题)

**1. In a multiprogramming system, main memory is divided into multiple sections: one for the operating system (resident monitor, kernel) and one for the set of processes currently being executed.**
*   **中文翻译**：在多道程序系统中，主内存被分为多个部分：一部分用于操作系统（常驻监控程序、内核），另一部分用于当前正在执行的进程集。
*   **答案**：**True (正确)**
*   **详细解析**：内存管理的基本要求之一是将内存划分为系统区和用户区。操作系统占据固定的一部分内存，剩余的内存用于容纳一个或多个正在执行的用户进程。这正是多道程序设计的基础，使得 CPU 可以交替执行多个进程。

**2. The task of subdividing memory between the O/S and processes is performed automatically by the O/S and is called relocation.**
*   **中文翻译**：操作系统自动执行在 OS 和进程之间细分内存的任务，这被称为重定位 (relocation)。
*   **答案**：**False (错误)**
*   **详细解析**：题目描述的概念混淆了。细分内存、分配内存的任务统称为**内存管理 (Memory Management)**。而**重定位 (Relocation)** 具体指的是当进程在内存中被换出又换入时，由于可能不会被加载回相同的物理地址，操作系统需要将程序中的逻辑地址动态地转换为实际的物理地址的过程。

**3. The practice in which a program and data are organized in such a way that various modules can be assigned the same region of memory is called overlaying.**
*   **中文翻译**：将程序和数据组织成特定方式，使得各个模块可以被分配到同一内存区域的做法称为覆盖 (overlaying)。
*   **答案**：**True (正确)**
*   **详细解析**：当一个程序比可用内存大时，程序员可以将程序分为若干模块。在执行过程中，不需要同时存在于内存中的模块可以轮流加载到同一个内存区域，这就是**覆盖 (overlaying)**。这是一种早期的技术，主要由程序员手动完成。

**4. The concept of virtual memory is based on one or both of two basic techniques: segmentation and paging.**
*   **中文翻译**：虚拟内存的概念基于分段 (segmentation) 和分页 (paging) 这两种基本技术的一种或两种。
*   **答案**：**True (正确)**
*   **详细解析**：现代操作系统中，虚拟内存的实现几乎完全依赖于分页机制，或者分段机制，或者两者的结合（如段页式内存管理）。这两种技术允许进程的物理地址在内存中不连续，为虚拟内存打下了硬件基础。

**5. A major problem with the largely obsolete Fixed Partitioning memory management technique is that of external fragmentation.**
*   **中文翻译**：基本上已过时的固定分区 (Fixed Partitioning) 内存管理技术的一个主要问题是外部碎片 (external fragmentation)。
*   **答案**：**False (错误)**
*   **详细解析**：固定分区技术的主要问题是**内部碎片 (Internal fragmentation)**。因为分区大小是固定的，当一个相对较小的进程被加载到一个较大的分区时，分区内部剩余的空间就会被浪费，这种现象称为内部碎片。**外部碎片 (External fragmentation)** 主要是动态分区 (Dynamic Partitioning) 的问题。

**6. The problem of internal fragmentation can be lessened in a system employing a fixed-partition memory management scheme by using unequal size partitions.**
*   **中文翻译**：在采用固定分区内存管理方案的系统中，可以通过使用大小不等的分区来减轻内部碎片的问题。
*   **答案**：**True (正确)**
*   **详细解析**：如果所有固定分区大小相同，小进程会浪费大量空间（内部碎片）。通过提供大小不等的固定分区（Unequal-size partitions），操作系统可以尝试将进程分配到能够容纳它且最小的分区中，从而显著减少内部碎片的浪费。

**7. In the Dynamic Partitioning technique of memory management, the best-fit placement algorithm is usually the best performer of the available algorithms.**
*   **中文翻译**：在内存管理的动态分区技术中，最佳适应 (best-fit) 放置算法通常是所有可用算法中性能最好的。
*   **答案**：**False (错误)**
*   **详细解析**：虽然名字叫 "best-fit" (最佳适应)，但它通常是**性能最差**的。因为它总是寻找与请求大小最接近的空闲块，这会导致留下许多非常小且难以利用的内存碎片。此外，它每次都需要扫描整个或大部分空闲块列表，速度较慢。通常，First-fit (首次适应) 或 Next-fit (下次适应) 表现更好。

**8. In the Dynamic Partitioning technique of memory management, compaction refers to shifting the processes into a contiguous block, resulting in all the free memory aggregated into in a single block.**
*   **中文翻译**：在内存管理的动态分区技术中，压缩 (compaction) 指的是移动进程使其成为一个连续的块，从而导致所有空闲内存聚集成一个单一的块。
*   **答案**：**True (正确)**
*   **详细解析**：为了解决动态分区产生的外部碎片问题，操作系统会定期进行**压缩 (Compaction)**。这涉及移动内存中正在运行的进程，使它们紧凑地排列在一起，从而将所有原本零散的空闲空间合并成一个巨大的、连续的空闲块，以便加载更大的新进程。

**9. In the Dynamic Partitioning technique of memory management, the first-fit placement algorithm scans memory from the location of the last placement and chooses the first available block it finds that satisfies the request.**
*   **中文翻译**：在内存管理的动态分区技术中，首次适应 (first-fit) 放置算法从最后一次放置的位置开始扫描内存，并选择它找到的第一个满足请求的可用块。
*   **答案**：**False (错误)**
*   **详细解析**：题目描述的是 **Next-fit (下次适应)** 算法。**First-fit (首次适应)** 算法总是从内存空间的**起始位置**开始扫描，选择第一个足够大的空闲块。Next-fit 才是从上次分配结束的地方开始扫描。

**10. The Buddy System is a reasonable compromise to overcome the disadvantages of both the fixed and variable partition schemes.**
*   **中文翻译**：伙伴系统 (Buddy System) 是一个合理的折衷方案，用于克服固定分区和可变（动态）分区方案的缺点。
*   **答案**：**True (正确)**
*   **详细解析**：伙伴系统通过不断将大块内存一分为二（互为伙伴）来满足较小的请求，并在内存释放时将相邻的伙伴合并。它避免了动态分区中复杂的碎片整理（压缩），同时比固定分区提供了更多的灵活性和较少的内部碎片。

**11. A physical memory address is a reference to a memory location independent of the current assignment of data to memory.**
*   **中文翻译**：物理内存地址是对内存位置的引用，它独立于当前数据到内存的分配。
*   **答案**：**False (错误)**
*   **详细解析**：题目描述的是**逻辑地址 (Logical address)** 或者是相对地址。**物理地址 (Physical address) / 绝对地址 (Absolute address)** 恰恰是主内存中**实际的、绝对的位置**。逻辑地址才独立于数据当前是否以及被分配在内存的具体哪个位置。

**12. A memory system employing paging may suffer slightly from internal fragmentation and experiences no external fragmentation.**
*   **中文翻译**：采用分页 (paging) 的内存系统可能会遭受轻微的内部碎片，但没有外部碎片。
*   **答案**：**True (正确)**
*   **详细解析**：在分页机制中，进程被划分为固定大小的页 (pages)，物理内存被划分为同样大小的页框 (frames)。因为分配的最小单位是页，所以不会有任何外部碎片。但是，进程的最后一部分通常不能刚好填满一个完整的页，这会导致该页的剩余部分被浪费，这就是轻微的**内部碎片**。

**13. In a memory system employing paging, the chunks of a process (called frames) can be assigned to available chunks of memory (called pages).**
*   **中文翻译**：在采用分页的内存系统中，进程的块（称为页框 frames）可以分配给可用的内存块（称为页 pages）。
*   **答案**：**False (错误)**
*   **详细解析**：术语弄反了。进程被划分的块称为**页 (pages)**，而主内存被划分的物理块称为**页框 (frames)**。正确的说法是：进程的 pages 被分配到主内存的 available frames 中。

**14. A memory system employing segmentation may suffer slightly from external fragmentation and experience no internal fragmentation.**
*   **中文翻译**：采用分段 (segmentation) 的内存系统可能会遭受轻微的外部碎片，但没有内部碎片。
*   **答案**：**True (正确)**
*   **详细解析**：在分段机制中，进程被划分为大小不等的段 (segments)，如代码段、数据段等。分配时为每个段分配正好需要的内存量，因此**没有内部碎片**。但是，由于段被加载和卸载，内存中会留下大小不一的空隙，类似于动态分区，因此会导致**外部碎片**。

**15. A memory system employing segmentation consists of a number of user program segments that must be of the same length and have a maximum segment length.**
*   **中文翻译**：采用分段的内存系统由多个用户程序段组成，这些段必须具有相同的长度，并且有一个最大段长度。
*   **答案**：**False (错误)**
*   **详细解析**：分段技术的核心特征之一就是段是**大小不等 (unequal size)** 的。它们对应于程序员眼中的逻辑实体（如函数、数组），因此长度不可能相同。虽然通常会受限于硬件有一个最大段长度限制，但它们绝对不要求具备相同长度。要求相同长度的是**分页 (paging)** 技术。

---

## Multiple Choice Questions (单选题)

**1. The task of subdividing memory between the O/S and processes is performed automatically by the O/S and is called:**
a. Protection
b. Relocation
c. Memory Management
d. All of the above
*   **中文翻译**：操作系统自动执行在 OS 和进程之间细分内存的任务，这被称为：
    a. 保护 (Protection)
    b. 重定位 (Relocation)
    c. 内存管理 (Memory Management)
    d. 以上皆是
*   **答案**：**c. Memory Management**
*   **详细解析**：细分和分配内存的整体任务被称为**内存管理 (Memory Management)**。保护和重定位是内存管理的具体需求和机制，但“细分内存”这个任务本身是内存管理的核心定义。

**2. The concept of Memory Management satisfies certain system requirements, including:**
a. Protection
b. Relocation
c. Physical organization
d. All of the above
*   **中文翻译**：内存管理的概念满足特定的系统要求，包括：
    a. 保护 (Protection)
    b. 重定位 (Relocation)
    c. 物理组织 (Physical organization)
    d. 以上皆是
*   **答案**：**d. All of the above**
*   **详细解析**：根据操作系统的原理，内存管理需要满足五个基本要求：重定位 (Relocation)、保护 (Protection)、共享 (Sharing)、逻辑组织 (Logical organization) 和 物理组织 (Physical organization)。因此，a、b、c 都包含在内。

**3. The practice in which a program and data are organized in such a way that various modules can be assigned the same region of memory is called:**
a. Overlaying
b. Sharing
c. Relocation
d. None of the above
*   **中文翻译**：将程序和数据组织成特定方式，使得各个模块可以被分配到同一内存区域的做法称为：
    a. 覆盖 (Overlaying)
    b. 共享 (Sharing)
    c. 重定位 (Relocation)
    d. 以上皆非
*   **答案**：**a. Overlaying**
*   **详细解析**：如前所述，当程序过大时，将不同时执行的模块加载到内存的同一位置的技术称为覆盖。

**4. The concept of virtual memory is based on one or both of two basic techniques:**
a. Overlaying and relocation
b. Segmentation and paging
c. Segmentation and partitioning
d. None of the above
*   **中文翻译**：虚拟内存的概念基于以下两种基本技术的一种或两种：
    a. 覆盖和重定位
    b. 分段和分页 (Segmentation and paging)
    c. 分段和分区
    d. 以上皆非
*   **答案**：**b. Segmentation and paging**
*   **详细解析**：虚拟内存的实现硬件支持是分页 (paging) 或 分段 (segmentation)，或者将两者结合的段页式机制。

**5. A problem with the largely obsolete Fixed Partitioning memory management technique is that of:**
a. Allowing only a fixed number of Processes
b. Inefficient use of memory
c. Internal fragmentation
d. All of the above
*   **中文翻译**：基本上已过时的固定分区内存管理技术的问题在于：
    a. 只允许固定数量的进程
    b. 内存使用效率低下
    c. 内部碎片 (Internal fragmentation)
    d. 以上皆是
*   **答案**：**d. All of the above**
*   **详细解析**：固定分区在系统初始化时就划分好。由于分区数量固定，所以同时能在内存中的进程数被限制（多道程序度受限）。由于进程很难刚好填满分区，导致严重的**内部碎片**，进而造成**内存使用效率低下**。因此所有选项都是其问题。

**6. The problem of internal fragmentation can be lessened in systems employing a fixed-partition memory management scheme by using:**
a. Random size partitions
b. Equal size partitions
c. Unequal size partitions
d. None of the above
*   **中文翻译**：在采用固定分区内存管理方案的系统中，可以通过使用什么来减轻内部碎片的问题：
    a. 随机大小分区
    b. 相等大小分区
    c. 大小不等分区 (Unequal size partitions)
    d. 以上皆非
*   **答案**：**c. Unequal size partitions**
*   **详细解析**：使用大小不等的固定分区，可以将小进程放入小分区，大进程放入大分区，以此来降低内部碎片的产生。

**7. In the Dynamic Partitioning technique of memory management, the phenomenon that results in unused blocks of memory outside of existing partitions is called:**
a. Internal fragmentation
b. External fragmentation
c. Compaction
d. None of the above
*   **中文翻译**：在内存管理的动态分区技术中，导致现有分区外部出现未使用内存块的现象被称为：
    a. 内部碎片
    b. 外部碎片 (External fragmentation)
    c. 压缩
    d. 以上皆非
*   **答案**：**b. External fragmentation**
*   **详细解析**：动态分区中，随着进程不断被载入和移出，内存中会留下许多过小而无法装入新进程的空闲孔洞（未使用的块）。因为这些孔洞在分配给进程的区域“外部”，所以称为**外部碎片**。

**8. In the Dynamic Partitioning technique of memory management, the placement algorithm that chooses the block that is closest in size to the request is called:**
a. Best-fit
b. First-fit
c. Next-fit
d. All of the above
*   **中文翻译**：在内存管理的动态分区技术中，选择大小最接近请求的空闲块的放置算法被称为：
    a. 最佳适应 (Best-fit)
    b. 首次适应 (First-fit)
    c. 下次适应 (Next-fit)
    d. 以上皆是
*   **答案**：**a. Best-fit**
*   **详细解析**：这是 Best-fit (最佳适应) 算法的定义：遍历内存，找到满足要求且尺寸最接近的空闲块。

**9. In the Dynamic Partitioning technique of memory management, the placement algorithm that scans memory from the location of the last placement and chooses the next available block that large enough to satisfy the request is called:**
a. Best-fit
b. First-fit
c. Next-fit
d. All of the above
*   **中文翻译**：在内存管理的动态分区技术中，从最后一次放置的位置开始扫描内存，并选择下一个足够大以满足请求的可用块的放置算法被称为：
    a. 最佳适应
    b. 首次适应
    c. 下次适应 (Next-fit)
    d. 以上皆是
*   **答案**：**c. Next-fit**
*   **详细解析**：这是 Next-fit (下次适应) 算法的定义，其目的是为了平均使用整个内存空间，而不是像 First-fit 那样总是集中在内存低端。

**10. A reference to a memory location independent of the current assignment of data to memory is called a(n):**
a. Relative address
b. Logical address
c. Absolute address
d. None of the above
*   **中文翻译**：独立于当前数据到内存的分配的对内存位置的引用被称为：
    a. 相对地址
    b. 逻辑地址 (Logical address)
    c. 绝对地址
    d. 以上皆非
*   **答案**：**b. Logical address**
*   **详细解析**：**逻辑地址**是对内存位置的一种抽象引用，它和进程数据当前到底实际存放在物理内存的哪里无关。它需要在执行时被转换（映射）为物理地址。

**11. An actual location in main memory is called a(n):**
a. Relative address
b. Logical address
c. Absolute address
d. None of the above
*   **中文翻译**：主内存中的实际位置被称为：
    a. 相对地址
    b. 逻辑地址
    c. 绝对地址 (Absolute address)
    d. 以上皆非
*   **答案**：**c. Absolute address**
*   **详细解析**：实际的物理内存硬件位置被称为**物理地址 (Physical address)** 或**绝对地址 (Absolute address)**。

**12. The page table for each process maintains:**
a. The frame location for each page of the process
b. The page location for each frame of the process
c. The physical memory location of the process
d. None of the above
*   **中文翻译**：每个进程的页表 (page table) 维护了：
    a. 进程的每个页的页框位置 (The frame location for each page of the process)
    b. 进程的每个页框的页位置
    c. 进程的物理内存位置
    d. 以上皆非
*   **答案**：**a. The frame location for each page of the process**
*   **详细解析**：在分页系统中，操作系统为每个进程维护一个**页表 (page table)**。页表的作用是记录该进程的逻辑**页 (page)** 被装载到了物理内存的哪一个**页框 (frame)** 中。

**13. In a system employing a paging scheme for memory management, wasted space is due to:**
a. External fragmentation
b. Internal fragmentation
c. Pages and frames of different specified sizes
d. None of the above
*   **中文翻译**：在采用分页方案进行内存管理的系统中，浪费的空间是由于：
    a. 外部碎片
    b. 内部碎片 (Internal fragmentation)
    c. 指定了不同大小的页和页框
    d. 以上皆非
*   **答案**：**b. Internal fragmentation**
*   **详细解析**：分页系统消除了外部碎片，但进程的最后一页通常无法被填满，从而在分配给它的那个 frame 内部造成了空间浪费，即**内部碎片**。

**14. In a system employing a segmentation scheme for memory management, wasted space is due to:**
a. External fragmentation
b. Internal fragmentation
c. Segments of different sizes
d. None of the above
*   **中文翻译**：在采用分段方案进行内存管理的系统中，浪费的空间是由于：
    a. 外部碎片 (External fragmentation)
    b. 内部碎片
    c. 不同大小的段
    d. 以上皆非
*   **答案**：**a. External fragmentation**
*   **详细解析**：分段系统中，内存是按段的实际大小分配的，所以没有内部碎片。但由于段长短不一，在反复装入和移出后，内存中会留下很多小的空隙，形成**外部碎片**。

**15. In a system employing a segmentation scheme for memory management, a process is divided into:**
a. One segment per thread
b. A number of segments which must be of equal size
c. A number of segments which need not be of equal size
d. None of the above
*   **中文翻译**：在采用分段方案进行内存管理的系统中，一个进程被分为：
    a. 每个线程一个段
    b. 多个必须大小相等的段
    c. 多个不需要大小相等的段 (A number of segments which need not be of equal size)
    d. 以上皆非
*   **答案**：**c. A number of segments which need not be of equal size**
*   **详细解析**：分段的核心特性就是将程序划分为反映逻辑结构的段，例如代码段、数据段、堆栈段等，这些段的长度自然是**大小不等**的。

---

## Fill-In-The-Blank Questions (填空题)

**1. The task of subdividing memory between the O/S and processes is performed automatically by the O/S and is called ________.**
*   **中文翻译**：操作系统自动执行在 OS 和进程之间细分内存的任务，这被称为 ________。
*   **答案**：**Memory Management**
*   **详细解析**：如同前面选择题第 1 题，细分和管理主存的核心任务统称为 Memory Management（内存管理）。

**2. The Memory Management task of moving the process image between different areas of memory as required to support swapping is referred to as ________.**
*   **中文翻译**：为支持交换 (swapping)，根据需要在内存的不同区域之间移动进程映像的内存管理任务被称为 ________。
*   **答案**：**Relocation**
*   **详细解析**：当一个进程被换出到磁盘，之后再被换入时，由于原本的位置可能已被占用，它会被加载到内存的不同区域。操作系统必须能够解决地址转换的问题，这个过程称为 **Relocation (重定位)**。

**3. The practice in which a program and data are organized in such a way that various modules can be assigned the same region of memory is called ________.**
*   **中文翻译**：将程序和数据组织成特定方式，使得各个模块可以被分配到同一内存区域的做法称为 ________。
*   **答案**：**Overlaying**
*   **详细解析**：这是 **Overlaying (覆盖)** 技术的标准定义。

**4. In almost all modern multiprogramming systems, memory is managed using a sophisticated technique known as ________.**
*   **中文翻译**：在几乎所有现代多道程序系统中，内存都是使用一种称为 ________ 的复杂技术来管理的。
*   **答案**：**Virtual Memory**
*   **详细解析**：现代操作系统摒弃了简单的分区和单纯的分页分段，而是普遍采用了 **Virtual Memory (虚拟内存)** 技术，它允许进程的执行空间比实际物理内存大得多。

**5. The phenomenon, in which there is wasted space internal to a partition due to the fact that the block of data loaded is smaller than the partition, is referred to as ________.**
*   **中文翻译**：由于加载的数据块小于分区，导致分区内部存在浪费空间的现象被称为 ________。
*   **答案**：**Internal fragmentation**
*   **详细解析**：由于固定分区或分页机制中分配的单元大于进程实际所需，导致单元内部剩余空间被浪费，这明确定义了 **Internal fragmentation (内部碎片)**。

**6. The problem of internal fragmentation can be lessened in system employing a fixed-partition memory management scheme by using ________ partitions.**
*   **中文翻译**：在采用固定分区内存管理方案的系统中，可以通过使用 ________ 分区来减轻内部碎片的问题。
*   **答案**：**Unequal-size**
*   **详细解析**：通过提供大小不一 (Unequal-size) 的固定分区，系统可以更精确地匹配进程的需求，从而减少内部碎片。

**7. In the Dynamic Partitioning technique of memory management, the process of shifting processes so they occupy a single contiguous block in memory is called ________.**
*   **中文翻译**：在内存管理的动态分区技术中，移动进程使其占据内存中单个连续块的过程称为 ________。
*   **答案**：**Compaction**
*   **详细解析**：为了消除动态分区产生的外部碎片，操作系统执行的内存紧缩、移动进程的操作称为 **Compaction (压缩/紧凑)**。

**8. In the Dynamic Partitioning technique of memory management, the placement algorithm that chooses the block that is closest in size to the request is called ________.**
*   **中文翻译**：在内存管理的动态分区技术中，选择大小最接近请求的块的放置算法被称为 ________。
*   **答案**：**Best-fit**
*   **详细解析**：寻找大小最契合的空闲块的算法名为 **Best-fit (最佳适应)**。

**9. In the Dynamic Partitioning technique of memory management, the phenomenon that results in unused blocks of memory outside of existing partitions is called ________.**
*   **中文翻译**：在内存管理的动态分区技术中，导致现有分区外部出现未使用内存块的现象被称为 ________。
*   **答案**：**External fragmentation**
*   **详细解析**：动态分区由于不断的分配和回收，在进程分区之间会产生大量零散无法使用的空闲块，称为 **External fragmentation (外部碎片)**。

**10. Programs that employ ________ addresses in memory are loaded using dynamic run-time loading.**
*   **中文翻译**：在内存中使用 ________ 地址的程序是使用动态运行时加载 (dynamic run-time loading) 的。
*   **答案**：**Logical / Relative**
*   **详细解析**：为了支持进程在内存中的移动（重定位）和动态加载，程序代码不能使用绝对物理地址，而必须使用 **Logical (逻辑)** 或 **Relative (相对)** 地址。这些地址在执行指令时才由硬件（MMU）转换为绝对物理地址。

**11. A compromise between the fixed and dynamic partitioning schemes for memory management that employs aspects of both is called the ________.**
*   **中文翻译**：内存管理的固定分区和动态分区方案之间的一种折衷方案，它利用了两者优点的被称为 ________。
*   **答案**：**Buddy System**
*   **详细解析**：**Buddy System (伙伴系统)** 结合了固定分区的快速和动态分区的灵活性，它分配内存块的大小总是 2 的幂。

**12. In a system that employs a paging memory management scheme, the ________ shows the frame location for each page of the process.**
*   **中文翻译**：在采用分页内存管理方案的系统中，________ 显示了进程每个页的页框位置。
*   **答案**：**Page table**
*   **详细解析**：**Page table (页表)** 是操作系统维护的数据结构，用于记录逻辑页 (page) 到物理页框 (frame) 的映射关系。

**13. In a system that employs a paging memory management scheme, the chunks of a process can be assigned to available chunks of memory, which are called ________.**
*   **中文翻译**：在采用分页内存管理方案的系统中，进程的块可以分配给可用的内存块，这些内存块被称为 ________。
*   **答案**：**Frames**
*   **详细解析**：在分页中，主物理内存被划分为固定大小的块，称为 **Frames (页框 / 物理块)**。

**14. A system that employs a segmentation memory management scheme makes use of a ________ that provides the starting address of the corresponding segment in main memory.**
*   **中文翻译**：采用分段内存管理方案的系统利用 ________ 来提供主内存中相应段的起始地址。
*   **答案**：**Segment table**
*   **详细解析**：与分页系统类似，分段系统使用 **Segment table (段表)** 来记录每个段的基址（起始物理地址）和段长 (Length)。

**15. A system that employs a segmentation memory management scheme, the program and its associated data are divided into a number of ________ that need not be of the same length.**
*   **中文翻译**：采用分段内存管理方案的系统，程序及其相关数据被划分为若干个不需要具有相同长度的 ________。
*   **答案**：**Segments**
*   **详细解析**：分段机制按程序的逻辑结构将其划分为大小不等的 **Segments (段)**。
