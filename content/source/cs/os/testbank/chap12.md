---
title: Chap. 12
order: 12
---

# Chapter 12 - File Management

## True / False Questions (判断题)

**1. 题目**: A file is a collection of fields, which is in turn a collection of related records.

**翻译**: 文件是字段的集合，而字段又是相关记录的集合。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 文件系统的数据层次结构。

*   **详解**: 概念的层级关系反了。正确的层级是从小到大：**字段（Field） -> 记录（Record） -> 文件（File） -> 数据库（Database）**。也就是说，记录（Record）是相关字段的集合，而文件（File）是相关记录的集合。

**2. 题目**: At the lowest level of the file system architecture, device drivers communicate directly with peripheral devices or their controllers or channels.

**翻译**: 在文件系统架构的最低层，设备驱动程序直接与外围设备或其控制器或通道通信。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 文件系统架构。

*   **详解**: 文件系统通常分为多个抽象层。最底层是设备驱动程序（Device Drivers），它们不关心文件的逻辑结构，而是直接向 I/O 硬件（控制器、通道）发送特定的机器指令，实现物理数据的读写。

**3. 题目**: A pile file refers to the least complicated form of file organization, where data are collected in sorted order and each record consists of one burst of data.

**翻译**: 堆文件（pile file）指的是最不复杂的文件组织形式，其中数据按排序顺序收集，每条记录由一阵数据组成。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 堆文件（Pile File）组织。

*   **详解**: 堆文件确实是最不复杂的形式，但它的核心特征是**数据完全没有特定的结构或排序（not sorted）**。数据只是按照到达的先后顺序被连续追加（堆积）到文件中。题目中称其“按排序顺序收集（collected in sorted order）”是错误的。

**4. 题目**: The key field in a sequential file acts as an identifier for each record and must therefore be unique to that record.

**翻译**: 顺序文件中的关键字段充当每条记录的标识符，因此对于该记录必须是唯一的。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 顺序文件（Sequential File）。

*   **详解**: 在顺序文件中，记录通常按照某个特定的字段（称为关键字段/Key field）的值进行排序和存储。为了准确标识和查找某条特定记录，这个关键字段通常要求必须具有唯一性。

**5. 题目**: In the indexed sequential file structure, multiple indexes (each referencing a defined portion of the file) can be used to increase record access efficiency.

**翻译**: 在索引顺序文件结构中，可以使用多个索引（每个索引引用定义的文件的某部分）来提高记录访问效率。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 索引顺序文件（Indexed Sequential File）。

*   **详解**: 为了避免对大型顺序文件进行缓慢的线性搜索，索引顺序文件引入了多级索引（如主索引引用部分索引，部分索引引用具体的记录块），这种类似树状结构的索引大大缩短了搜索时间，极大地提高了访问效率。

**6. 题目**: In the general indexed file structure, there are no key fields and variable-length records are allowed.

**翻译**: 在通用索引文件（general indexed file）结构中，没有关键字段，并且允许可变长度记录。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 索引文件（Indexed File）。

*   **详解**: 通用索引文件放弃了顺序文件的单一物理排序，通常用于只通过索引访问记录的场景。它允许可变长度记录，但它**绝对有关键字段（key fields）**——事实上，它通常具有**多个**关键字段，并且会为这些不同的关键字段分别建立不同的索引表。因此说它“没有关键字段”是错的。

**7. 题目**: The address information element of a file directory maintains data about the owner of the file, the file access information, and a list of actions permitted on the file.

**翻译**: 文件目录的地址信息（address information）元素维护关于文件所有者、文件访问信息以及文件允许执行的操作列表的数据。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 文件目录的信息元素。

*   **详解**: 文件目录中包含所有者、访问信息、允许的操作等内容的部分被称为**访问控制信息（Access Control Information）**。而**地址信息（Address Information）**维护的是文件存放的卷、起始物理地址、文件大小和块分配指针等。

**8. 题目**: Typically, an interactive user or a process has associated with it a current directory, often referred to as the working directory.

**翻译**: 通常，交互式用户或进程具有与之关联的当前目录，通常称为工作目录（working directory）。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 目录结构。

*   **详解**: 为了方便用户和进程通过相对路径访问文件而无需每次都输入长长的绝对路径，操作系统为每个活动进程/用户维护一个当前关联的目录，即工作目录（Working Directory）。

**9. 题目**: The primary issues involved in the simultaneous access of files for updating or appending are mutual exclusion and starvation.

**翻译**: 涉及同时访问文件进行更新或追加的主要问题是互斥（mutual exclusion）和饥饿（starvation）。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 文件的并发访问控制。

*   **详解**: 尽管饥饿是一个普遍的并发问题，但在教科书讨论文件共享更新的上下文中，文件系统需要解决的两个首要问题是**互斥（Mutual Exclusion）**和**死锁（Deadlock）**。

**10. 题目**: The larger the file block size the more records are passed per I/O transaction, but this requires larger I/O buffers making buffer management more difficult.

**翻译**: 文件块大小越大，每次 I/O 事务传递的记录就越多，但这需要更大的 I/O 缓冲区，使得缓冲区管理更加困难。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 文件阻塞（File Blocking）。

*   **详解**: 使用大块（Large Block Size）可以提高磁盘 I/O 的吞吐量，因为一次物理传输能带出多条记录。但代价是操作系统必须在内存中分配同样巨大的 I/O 缓冲区，这增加了系统内存的压力和缓冲池管理的复杂性。

**11. 题目**: A preallocation policy for secondary storage management requires that the minimum size of a file be declared at the time of the file creation request.

**翻译**: 辅助存储管理的预分配（preallocation）策略要求在文件创建请求时声明文件的最小大小。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 空间分配策略。

*   **详解**: 预分配策略（Preallocation）要求用户或应用程序在创建文件时声明该文件将来可能达到的**最大大小（Maximum size）**，以便操作系统能一次性为该文件分配足够的空间，而不是最小大小。

**12. 题目**: In the Free Block List strategy of free disk space management, each block is assigned a number sequentially and the list of the numbers of all free blocks is maintained in a reserved portion of the disk.

**翻译**: 在空闲磁盘空间管理的空闲块列表（Free Block List）策略中，每个块被顺序分配一个编号，并且所有空闲块编号的列表被维护在磁盘的保留部分中。

**答案**: **True (正确)**

**解析**:

*   **知识点**: 磁盘空闲空间管理。

*   **详解**: 在 Free Block List 策略中，磁盘上每一个空闲的物理块编号（Block number）都被收集起来存放在一张列表中，这张表保存在磁盘的一个固定管理区域中，操作系统按需从中摘取可用块。

**13. 题目**: Reliability problems can occur when the disk allocation table and file allocation table are stored on disk.

**翻译**: 当磁盘分配表（DAT）和文件分配表（FAT）存储在磁盘上时，可能会出现可靠性问题。

**答案**: **False (错误)**

**解析**:

*   **知识点**: 文件系统的可靠性。

*   **详解**: 事实上，将 DAT 和 FAT 存放在**磁盘**上是最安全的。可靠性问题恰恰发生在操作系统为了提高性能，将这两张表**缓存在主存（Main Memory）**中进行修改时。如果在这个过程中系统崩溃或突然断电，内存中的数据还没来得及写回磁盘，就会导致磁盘结构彻底损坏（严重的不一致）。

**14. 题目**: The UNIX kernel views all files as streams of bytes, any internal logical structure is application specific.

**翻译**: UNIX 内核将所有文件视为字节流，任何内部逻辑结构都是特定于应用程序的。

**答案**: **True (正确)**

**解析**:

*   **知识点**: UNIX 文件系统特性。

*   **详解**: UNIX 不像早期大型机系统那样在操作系统层面区分“顺序文件”、“索引文件”等结构。对于 UNIX 内核而言，所有的普通文件仅仅是一个没有格式的、连续的“字节流（streams of bytes）”。如何解释这些字节（如当作文本、数据库记录或视频），完全由打开该文件的应用程序自行决定。

**15. 题目**: The first few sectors of any W2K disk partition using the NTFS file system is occupied by the master file table (MFT).

**翻译**: 任何使用 NTFS 文件系统的 W2K 磁盘分区的前几个扇区被主文件表（MFT）占据。

**答案**: **False (错误)**

**解析**:

*   **知识点**: Windows NTFS 卷结构。

*   **详解**: 在 NTFS 卷（分区）的开头，占据前几个扇区的是**分区引导扇区（Partition Boot Sector）**，它包含启动系统的代码以及有关该卷的基本信息。主文件表（MFT）并不固定在开头，而是可以在分区中的任何位置，其具体位置指针记录在引导扇区中。

---

## Multiple Choice Questions (单选题)

**1. 题目**: A file is generally defined to be:
a. A basic element of data
b. A collection of related fields
c. A collection of similar records
d. All of the above

**翻译**: 文件通常被定义为：
a. 数据的基本元素
b. 相关字段的集合
c. 相似记录的集合
d. 以上所有

**答案**: **c. A collection of similar records**

**解析**:

*   **知识点**: 文件系统的数据结构层次。

*   **详解**: 在经典文件系统中，数据的基本元素是字符/字节；相关字符组成字段（Field）；相关字段的集合构成记录（Record）；而**文件（File）是相似记录（records）的集合**。

**2. 题目**: The level of the file system architecture that enables users and applications to access file records is called the:
a. Basic file system level
b. Basic I/O supervisor level
c. Logical I/O level
d. All of the above

**翻译**: 使得用户和应用程序能够访问文件记录的文件系统架构级别被称为：
a. 基本文件系统级别
b. 基本 I/O 监督程序级别
c. 逻辑 I/O 级别
d. 以上所有

**答案**: **c. Logical I/O level**

**解析**:

*   **知识点**: 文件系统软件架构。

*   **详解**: 逻辑 I/O（Logical I/O）层为用户和应用程序提供了一个高级接口。它负责处理记录的存取请求，并将这些逻辑上的记录访问转换为底层可以理解的具体的块（block）和物理层操作。

**3. 题目**: Record access in a pile file can be conducted by:
a. Exhaustive search
b. Key field
c. Partial index
d. All of the above

**翻译**: 在堆文件（pile file）中的记录访问可以通过以下方式进行：
a. 穷举搜索 (Exhaustive search)
b. 关键字段
c. 部分索引
d. 以上所有

**答案**: **a. Exhaustive search**

**解析**:

*   **知识点**: 堆文件查询方式。

*   **详解**: 堆文件中的数据记录是无序累加的，并且记录的格式和长度都不固定。因为没有索引也没有按关键字段排序，所以要查找某条特定记录，唯一的办法就是从头到尾对文件进行**穷举搜索（Exhaustive search）**。

**4. 题目**: Sequential files are optimal in scenarios involving:
a. Applications that require frequent queries
b. Applications that require the processing of all records in the file
c. Applications that require infrequent updates
d. All of the above

**翻译**: 顺序文件在涉及以下场景时是最佳的：
a. 需要频繁查询的应用程序
b. 需要处理文件中所有记录的应用程序
c. 需要不频繁更新的应用程序
d. 以上所有

**答案**: **b. Applications that require the processing of all records in the file**

**解析**:

*   **知识点**: 顺序文件（Sequential file）的最佳用例。

*   **详解**: 如果你的应用（例如月末的工资单批处理程序）需要依次处理文件中的**每一条记录（all records）**，那么顺序文件是性能最好、开销最低的设计。对于单条记录的随机/频繁查询，顺序文件效率极低。

**5. 题目**: Indexed sequential files similar to sequential files, but contain two added features:
a. Hash function and an overflow file
b. Hash function and file index
c. File index and overflow file
d. All of the above

**翻译**: 索引顺序文件类似于顺序文件，但包含两个增加的特征：
a. 哈希函数和溢出文件
b. 哈希函数和文件索引
c. 文件索引和溢出文件 (File index and overflow file)
d. 以上所有

**答案**: **c. File index and overflow file**

**解析**:

*   **知识点**: 索引顺序文件结构。

*   **详解**: 索引顺序文件在顺序文件的基础上，保留了主文件的排序，同时增加了两个关键组件：一个是**文件索引（File index）**以支持快速的随机查找；另一个是**溢出文件（Overflow file）**，用于存放因主文件块装满而无法插入的新记录，以后再择机与主文件合并。

**6. 题目**: Direct or hashed files are often used where:
a. Very rapid access is required
b. Fixed length records are used
c. Records are always accessed one at a time
d. All of the above

**翻译**: 直接或哈希文件（hashed files）常用于以下情况：
a. 需要非常快速的访问
b. 使用固定长度的记录
c. 总是每次访问一条记录
d. 以上所有

**答案**: **d. All of the above**

**解析**:

*   **知识点**: 哈希/直接文件（Direct/Hashed file）。

*   **详解**: 直接/哈希文件通过计算主键的哈希值直接定位数据块。这种方式能够提供极快的单条记录访问速度（a, c），并且这种映射通常要求记录是定长的（b），常用于目录、定价表或名单的快速查询。

**7. 题目**: The file directory information element that holds information such as the identity of the creator of the file is the:
a. Address information element
b. Access control information element
c. Usage information element
d. All of the above

**翻译**: 包含诸如文件创建者身份等信息的文件目录信息元素是：
a. 地址信息元素
b. 访问控制信息元素 (Access control information element)
c. 使用信息元素
d. 以上所有

**答案**: **b. Access control information element**

**解析**:

*   **知识点**: 目录条目结构。

*   **详解**: 文件的所有者（Owner）或创建者的身份信息，被归类在**访问控制信息（Access control information）**中，操作系统通过它来判定谁有权给该文件分配或更改权限。

**8. 题目**: In a tree-structured directory, the series of directory names that culminates in a file name is referred to as the:
a. Pathname
b. Working directory
c. Symbolic name
d. None of the above

**翻译**: 在树形结构目录中，以文件名结尾的一系列目录名称被称为：
a. 路径名 (Pathname)
b. 工作目录
c. 符号名
d. 以上都不是

**答案**: **a. Pathname**

**解析**:

*   **知识点**: 路径名的定义。

*   **详解**: 从根目录或当前工作目录开始，穿过一层层目录（如 `/usr/local/bin/python`）最终到达特定文件名的整个字符串链条，就叫做**路径名（Pathname）**。

**9. 题目**: Access rights on a file typically are considered to constitute a hierarchy, with each right implying those that:
a. Supercede it
b. Precede it
c. Succeed it
d. None of the above

**翻译**: 文件的访问权限通常被认为构成一个层次结构，其中每种权利都暗示着那些：
a. 取代它的权限
b. 在它之前的权限 (Precede it)
c. 在它之后的权限
d. 以上都不是

**答案**: **b. Precede it**

**解析**:

*   **知识点**: 访问权限层级。

*   **详解**: 访问权限构成了一个逐步增强的层级，比如：无访问权 -> 读权限 -> 写权限 -> 执行/更新权限。如果你被授予了“写”权限，它自然暗示着你也拥有“在它之前的（precede it）”底层权限——即“读”权限。高权限涵盖低权限。

**10. 题目**: Fixed file blocking experiences the following potential problem:
a. Gaps due to hardware design
b. External fragmentation
c. Internal fragmentation
d. None of the above

**翻译**: 固定文件分块（Fixed file blocking）可能会遇到以下潜在问题：
a. 由于硬件设计造成的间隙
b. 外部碎片
c. 内部碎片 (Internal fragmentation)
d. 以上都不是

**答案**: **c. Internal fragmentation**

**解析**:

*   **知识点**: 文件块分配与内部碎片。

*   **详解**: 在固定阻塞（Fixed blocking）中，若干条记录被打包进一个固定大小的块（Block）中。如果最后几条记录无法填满整个块的剩余空间，该块中剩下的空间就会被白白浪费，这被称为**内部碎片（Internal fragmentation）**。

**11. 题目**: In which of the following file allocation methods is preallocation required:
a. Contiguous
b. Chained
c. Indexed
d. None of the above

**翻译**: 在以下哪种文件分配方法中，需要进行预分配（preallocation）：
a. 连续分配 (Contiguous)
b. 链接分配 (Chained)
c. 索引分配 (Indexed)
d. 以上都不是

**答案**: **a. Contiguous**

**解析**:

*   **知识点**: 连续分配（Contiguous Allocation）。

*   **详解**: 连续分配要求文件在磁盘上占据一段完全连续的块集。为了实现这一点，操作系统在创建文件时必须提前知道（或被告知）这个文件的最大预期大小，以便在磁盘上寻找并**预分配（Preallocation）**一块足够大的连续空闲空间。链接分配和索引分配都是动态分配的。

**12. 题目**: The technique of free disk space management that employs a pointer and length value of each free portion is the:
a. Free block list
b. Bit tables
c. Indexing
d. None of the above

**翻译**: 采用针对每个空闲部分使用指针和长度值（length value）的空闲磁盘空间管理技术是：
a. 空闲块列表
b. 位图/位表
c. 索引
d. 以上都不是

**答案**: **d. None of the above**

**解析**:

*   **知识点**: 磁盘空闲空间管理策略。

*   **详解**: 教科书中，使用一个指针指向一段连续空闲块的起始位置，并附带一个长度值（length value，表示这段空闲空间包含多少个块）的方法被称为**链式空闲区（Chained Free Portions）**或者基于区段（Portions）的管理。由于选项中给出的 a, b, c 都不是这个名字（a 是纯粹记录单个块号的列表，不是记录长度的），因此答案是 d。

**13. 题目**: The data structure that maintains information on available disk space is called the:
a. File Allocation Table (FAT)
b. Disk Allocation Table
c. Bit Table
d. None of the above

**翻译**: 维护可用磁盘空间信息的数据结构被称为：
a. 文件分配表 (FAT)
b. 磁盘分配表 (Disk Allocation Table)
c. 位表
d. 以上都不是

**答案**: **b. Disk Allocation Table**

**解析**:

*   **知识点**: 磁盘空间跟踪。

*   **详解**: FAT (File Allocation Table) 用于追踪已分配给特定文件的那些块；而用于追踪全盘所有空闲（可用）块的总表，在学术上统一被称为**磁盘分配表（Disk Allocation Table, DAT）**，尽管其底层实现可能是位图或空闲块链。

**14. 题目**: File allocation in a UNIX system has the following characteristics:
a. Dynamic allocation using non-contiguous blocks with indexing
b. Dynamic allocation using contiguous blocks without indexing
c. Preallocation using non-contiguous blocks without indexing
d. None of the above

**翻译**: UNIX 系统中的文件分配具有以下特征：
a. 动态分配，使用带索引的非连续块
b. 动态分配，使用不带索引的连续块
c. 预分配，使用不带索引的非连续块
d. 以上都不是

**答案**: **a. Dynamic allocation using non-contiguous blocks with indexing**

**解析**:

*   **知识点**: UNIX 文件分配（inode 机制）。

*   **详解**: UNIX 文件系统使用著名的 `inode`（索引节点）结构进行空间分配。它完全是**动态分配（Dynamic allocation）**的，数据块可以散布在磁盘各处（**非连续非连续块/non-contiguous blocks**），并通过 inode 中的多级指针树（直接、一次间接、二次间接等）进行**索引（indexing）**。

**15. 题目**: In a W2K NTFS file system, the smallest physical storage unit on the disk (almost always 512 bytes) is called a:
a. Cluster
b. Sector
c. Volume
d. None of the above

**翻译**: 在 W2K NTFS 文件系统中，磁盘上最小的物理存储单元（几乎总是 512 字节）被称为：
a. 簇
b. 扇区 (Sector)
c. 卷
d. 以上都不是

**答案**: **b. Sector**

**解析**:

*   **知识点**: 硬盘的物理与逻辑单位。

*   **详解**: 硬盘上硬件级别的、最小的不可分割的物理存储单位是**扇区（Sector）**，传统大小就是 512 字节。而 NTFS 等文件系统管理空间时使用的最小**逻辑**单位是簇（Cluster），它通常是由一个或多个连续的扇区组成的。

---

## Fill-In-The-Blank Questions (填空题)

**1. 题目**: The essential aspects of a __________ are that relationships among data are explicit and that it is designed for use by a number of different applications.

**翻译**: __________ 的本质特征在于，数据之间的关系是显式的，并且它是为了供许多不同的应用程序使用而设计的。

**答案**: **database (或 database system)**

**解析**: 区分文件系统和数据库系统的标志在于：数据库（Database）不仅存储数据本身，还结构化地存储数据之间的复杂关系，并被设计为独立于单个应用程序之外，为整个企业的一系列应用提供统一服务。

**2. 题目**: The level of the file system architecture that provides a standard interface between applications and the file systems and devices is often termed the __________.

**翻译**: 在应用程序与文件系统及设备之间提供标准接口的文件系统架构层级通常被称为 __________。

**答案**: **logical I/O**

**解析**: 逻辑 I/O（Logical I/O）层抽象出了通用接口，让应用程序只需要关心“记录”，而不需要了解文件是如何存储或设备是如何运作的。

**3. 题目**: A basic requirement for a file management system states that each user should have __________ access to other user's files.

**翻译**: 文件管理系统的一个基本要求指出，每个用户应具有对其他用户文件的 __________ 访问。

**答案**: **controlled**

**解析**: 操作系统不应该完全禁止共享，也不应该允许随意访问。基本原则是在明确的授权和权限控制下，提供**受控的（controlled）**访问。

**4. 题目**: The __________ file organization is the only one that is easily stored on tape as well as disk.

**翻译**: __________ 文件组织是唯一一种可以轻松存储在磁带以及磁盘上的文件组织。

**答案**: **sequential**

**解析**: 磁带是一种纯粹的顺序存取物理介质，它不支持磁头的来回随机跳跃寻址。因此，只有顺序追加、顺序读取的**顺序文件（Sequential file）**架构能很好地在磁带上运作。

**5. 题目**: In the indexed sequential file structure, multiple level of indexing can be used to increase efficiency in __________.

**翻译**: 在索引顺序文件结构中，可以使用多级索引来提高 __________ 的效率。

**答案**: **record access (或 search)**

**解析**: 多级索引极大地缩小了搜索的范围，其主要目的就是为了提高记录访问（Record access）或搜索的效率。

**6. 题目**: The direct file makes use of __________ on the key value.

**翻译**: 直接文件（direct file）利用基于键值的 __________。

**答案**: **hashing (或 a hash function)**

**解析**: 直接文件没有索引表，它利用**哈希算法（Hashing）**，将查询键的值通过哈希函数计算，直接映射出该记录在磁盘上的物理块地址。

**7. 题目**: The file directory information element that holds information such as the permitted actions on the file (e.g., reading, writing, executing, etc.) is the __________ information element.

**翻译**: 包含关于文件允许的操作（例如，读取、写入、执行等）等信息的文件目录信息元素是 __________ 信息元素。

**答案**: **access control**

**解析**: “允许读、写、执行”这就是典型的权限系统，这些数据被保存在目录的访问控制（Access control）信息元素中。

**8. 题目**: Typically, an interactive user or a process has associated with it a current directory, often referred to as the __________.

**翻译**: 通常，交互式用户或进程具有与之关联的当前目录，通常称为 __________。

**答案**: **working directory**

**解析**: 当前所在的路径状态称为工作目录（Working directory）。

**9. 题目**: Issues of __________ and deadlock must be addressed in designing the shared access capability for a file.

**翻译**: 在设计文件的共享访问能力时，必须解决 __________ 和死锁的问题。

**答案**: **mutual exclusion**

**解析**: 当多个进程想同时写入同一个文件时，系统必须提供互斥锁（如文件锁、记录锁）来保证修改的原子性，即**互斥（mutual exclusion）**，随之而来的也是必须防范的死锁问题。

**10. 题目**: __________ blocking is the common mode of file blocking for sequential files with fixed-length records.

**翻译**: __________ 分块是具有固定长度记录的顺序文件的常见文件分块模式。

**答案**: **Fixed**

**解析**: 既然记录长度是固定的，最自然、最高效的分块方式就是**固定分块（Fixed blocking）**，即将固定数量的记录紧密打包成一个大小固定的数据块。

**11. 题目**: The data structure or table that is used to keep track of the portions assigned to a file is referred to as a __________.

**翻译**: 用于跟踪分配给文件的那些部分的数据结构或表被称为 __________。

**答案**: **File Allocation Table (或 FAT)**

**解析**: 记录哪个磁盘块属于哪个文件的跟踪表，经典的名称就是文件分配表（File Allocation Table, FAT）。

**12. 题目**: In order to keep track of the free portions of the disk, a __________ is needed in addition to the file allocation table.

**翻译**: 为了跟踪磁盘的空闲部分，除了文件分配表之外，还需要一个 __________。

**答案**: **Disk Allocation Table (或 DAT)**

**解析**: FAT 管的是已被文件占用的块；而追踪剩余可用空间的结构被称为磁盘分配表（Disk Allocation Table, DAT）或空闲空间管理表。

**13. 题目**: Reliability problems can arise when copies of the File Allocation Table and Disk Allocation Table are maintained in __________.

**翻译**: 当文件分配表和磁盘分配表的副本被维护在 __________ 中时，可能会出现可靠性问题。

**答案**: **main memory**

**解析**: 如果这些关键的系统表长时间驻留在易失性的**主存（main memory）**中，一旦断电，内存数据丢失，磁盘上的结构就与实际状态脱节，从而引发致命的可靠性危机。

**14. 题目**: UNIX employs __________, which is a control structure that contains the key information needed by the operating system for a particular file.

**翻译**: UNIX 采用 __________，这是一种控制结构，包含操作系统针对特定文件所需的关键信息。

**答案**: **inodes (或 an inode / index node)**

**解析**: 在 UNIX/Linux 系统中，与特定文件绑定的控制结构（存放除了文件名以外的所有元数据及物理数据块指针的结构）被称为索引节点（inode）。

**15. 题目**: In a W2K NTFS file system, the __________ contains information about files and folders on a particular volume as well as information about available unallocated space.

**翻译**: 在 W2K NTFS 文件系统中，__________ 包含有关特定卷上文件和文件夹的信息，以及有关可用未分配空间的信息。

**答案**: **Master File Table (或 MFT)**

**解析**: NTFS 的核心就是**主文件表（Master File Table, MFT）**。在 NTFS 的哲学中“一切皆文件”，甚至连追踪空闲空间的 bitmap（位图）也是以一个特殊文件（`$Bitmap`）的形式存储，而这个文件的元数据记录同样保存在 MFT 中。