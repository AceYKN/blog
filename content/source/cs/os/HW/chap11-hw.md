---
title: Chap. 11 HW
order: 11
---

# OS Chap.11 HW

## 1. 磁盘调度算法 FIFO、SSTF、SCAN 计算磁头移动磁道数

### 题目内容

Assume a disk with 200 tracks and that the disk request queue has random requests in it. The requested tracks, in the order received by the disk scheduler, are 27, 129, 110, 186, 147, 41, 10, 64, 120. Assume that the disk head is initially positioned over track 100 and is moving in the direction of decreasing track number. Using disk scheduling algorithms FIFO, SSFT, SCAN to calculate the number of tracks traversed.

中文意思：

假设一块磁盘有 200 个磁道，磁道号通常可理解为 0 到 199。磁盘请求队列中的请求磁道号按到达顺序为：

27, 129, 110, 186, 147, 41, 10, 64, 120

磁头初始位置在磁道 100，并且正在向磁道号减小的方向移动。分别使用 FIFO、SSTF、SCAN 算法，计算磁头总共移动了多少个磁道。

注意：题目里的 SSFT 应该是 SSTF，即 Shortest Seek Time First，最短寻道时间优先。

---

### 解题核心

磁头移动距离的计算公式是：

$|\text{当前磁道} - \text{下一个访问磁道}|$

总移动磁道数就是每一次移动距离之和。

---

### 一、FIFO 算法

FIFO 即 First-In First-Out，先来先服务。

也就是说，请求按原来的到达顺序处理：

$100 \rightarrow 27 \rightarrow 129 \rightarrow 110 \rightarrow 186 \rightarrow 147 \rightarrow 41 \rightarrow 10 \rightarrow 64 \rightarrow 120$

逐步计算：

$|100 - 27| = 73$

$|27 - 129| = 102$

$|129 - 110| = 19$

$|110 - 186| = 76$

$|186 - 147| = 39$

$|147 - 41| = 106$

$|41 - 10| = 31$

$|10 - 64| = 54$

$|64 - 120| = 56$

总移动磁道数：

$73 + 102 + 19 + 76 + 39 + 106 + 31 + 54 + 56 = 556$

所以：

FIFO 总移动磁道数为：

$556$

---

### 二、SSTF 算法

SSTF 即 Shortest Seek Time First，最短寻道时间优先。

每次都选择距离当前磁头位置最近的请求。

初始位置是 100。

请求队列：

27, 129, 110, 186, 147, 41, 10, 64, 120

从 100 出发，离 100 最近的是 110：

$100 \rightarrow 110$

剩余：

27, 129, 186, 147, 41, 10, 64, 120

从 110 出发，最近的是 120：

$110 \rightarrow 120$

从 120 出发，最近的是 129：

$120 \rightarrow 129$

从 129 出发，最近的是 147：

$129 \rightarrow 147$

从 147 出发，最近的是 186：

$147 \rightarrow 186$

此时剩余请求都在较小磁道方向：

27, 41, 10, 64

从 186 出发，最近的是 64：

$186 \rightarrow 64$

从 64 出发，最近的是 41：

$64 \rightarrow 41$

从 41 出发，最近的是 27：

$41 \rightarrow 27$

最后：

$27 \rightarrow 10$

所以 SSTF 的访问顺序为：

$100 \rightarrow 110 \rightarrow 120 \rightarrow 129 \rightarrow 147 \rightarrow 186 \rightarrow 64 \rightarrow 41 \rightarrow 27 \rightarrow 10$

逐步计算：

$|100 - 110| = 10$

$|110 - 120| = 10$

$|120 - 129| = 9$

$|129 - 147| = 18$

$|147 - 186| = 39$

$|186 - 64| = 122$

$|64 - 41| = 23$

$|41 - 27| = 14$

$|27 - 10| = 17$

总移动磁道数：

$10 + 10 + 9 + 18 + 39 + 122 + 23 + 14 + 17 = 262$

所以：

SSTF 总移动磁道数为：

$262$

---

### 三、SCAN 算法

SCAN 又叫电梯算法。

题目说磁头初始方向是磁道号减小的方向，所以先处理小于 100 的请求，再反向处理大于 100 的请求。

小于 100 的请求有：

64, 41, 27, 10

按磁头减小方向访问：

$100 \rightarrow 64 \rightarrow 41 \rightarrow 27 \rightarrow 10$

然后反向访问大于 100 的请求：

110, 120, 129, 147, 186

所以访问顺序为：

$100 \rightarrow 64 \rightarrow 41 \rightarrow 27 \rightarrow 10 \rightarrow 110 \rightarrow 120 \rightarrow 129 \rightarrow 147 \rightarrow 186$

逐步计算：

$|100 - 64| = 36$

$|64 - 41| = 23$

$|41 - 27| = 14$

$|27 - 10| = 17$

$|10 - 110| = 100$

$|110 - 120| = 10$

$|120 - 129| = 9$

$|129 - 147| = 18$

$|147 - 186| = 39$

总移动磁道数：

$36 + 23 + 14 + 17 + 100 + 10 + 9 + 18 + 39 = 266$

所以：

SCAN 总移动磁道数为：

$266$

---

### 补充说明

按 Stallings 表 11.2 的 SCAN 算法示例，磁头到达当前方向上最后一个请求后就反向，不一定额外移动到磁盘最边界。

所以本题 SCAN 取：

$266$

如果你的老师要求严格 SCAN 必须先走到磁道 0 再反向，则访问过程为：

$100 \rightarrow 64 \rightarrow 41 \rightarrow 27 \rightarrow 10 \rightarrow 0 \rightarrow 110 \rightarrow 120 \rightarrow 129 \rightarrow 147 \rightarrow 186$

总移动磁道数为：

$36 + 23 + 14 + 17 + 10 + 110 + 10 + 9 + 18 + 39 = 286$

考试按 Stallings 的表格风格，通常写：

$266$

---

### 第 1 题最终答案

FIFO：

$556$

SSTF：

$262$

SCAN：

$266$

如果严格要求 SCAN 到磁盘边界 0：

$286$

---

## 2. 中断驱动 I/O 中 CPU 花费多少时间处理中断

### 题目内容

Assume that the disk rotates at 360 rpm. A processor reads one sector from the disk using interrupt-driven I/O, with one interrupt per byte. If it takes 2.5 µs to process each interrupt, what percentage of the time will the processor spend handling I/O (disregard seek time)?

中文意思：

假设磁盘转速为 360 rpm。处理器使用中断驱动 I/O 从磁盘读取一个扇区，每读取 1 字节产生一次中断。如果处理一次中断需要 $2.5\mu s$，问处理器有百分之多少的时间用于处理中断？忽略寻道时间。

本题使用第 5 题给出的磁盘信息：

每个扇区大小：

$512$ 字节

每个磁道：

$96$ 个扇区

---

### 解题核心

每字节一次中断，所以读一个扇区会产生：

$512$ 次中断

每次中断处理时间：

$2.5\mu s$

所以处理中断总时间：

$512 \times 2.5\mu s = 1280\mu s$

即：

$1.28ms$

---

### 计算磁盘传输一个扇区的时间

磁盘转速：

$360rpm$

意思是每分钟转 360 圈。

每秒转数：

$360 / 60 = 6$ 转/秒

所以一圈时间：

$1 / 6s = 0.1667s$

换成毫秒：

$0.1667s = 166.7ms$

每个磁道有 96 个扇区，所以一个扇区经过磁头的时间是：

$166.7ms / 96 = 1.736ms$

即：

$1736\mu s$

---

### 计算 CPU 用于处理中断的比例

比例为：

$\frac{\text{中断处理总时间}}{\text{一个扇区传输时间}} \times 100\%$

代入：

$\frac{1280}{1736} \times 100\% = 73.7\%$

所以：

CPU 大约有：

$73.7\%$

的时间花在处理中断上。

---

### 补充说明

这个题通常只把“扇区传输时间”作为分母，不把平均旋转等待时间算进去。

如果老师把“随机读一个扇区”理解成还要包括平均旋转延迟，则平均旋转延迟为半圈：

$166.7ms / 2 = 83.3ms$

总时间约为：

$83.3ms + 1.736ms = 85.036ms$

此时比例为：

$\frac{1.28ms}{85.036ms} \times 100\% \approx 1.50\%$

但 Stallings 这类题通常考的是 I/O 传输期间中断开销，所以主要答案写：

$73.7\%$

---

### 第 2 题最终答案

CPU 处理中断的时间比例约为：

$73.7\%$

---

## 3. 计算最大聚合 I/O 传输速率

### 题目内容

A 32-bit computer has two selector channels and one multiplexor channel. Each selector channel supports two magnetic disk and two magnetic tape units. The multiplexor channel has two line printers, two card readers, and ten VDT terminals connected to it. Assume the following transfer rates:

Disk drive: 800 Kbytes/s

Magnetic tape drive: 200 Kbytes/s

Line printer: 6.6 Kbytes/s

Card reader: 1.2 Kbytes/s

VDT: 1 Kbytes/s

Estimate the maximum aggregate I/O transfer rate in this system.

中文意思：

一台 32 位计算机有两个选择通道和一个多路复用通道。每个选择通道连接两个磁盘驱动器和两个磁带机。多路复用通道连接两个行式打印机、两个读卡机和十个 VDT 终端。给出各设备传输速率，求系统最大总 I/O 传输速率。

---

### 解题核心

这里要区分两种通道：

1. 选择通道 selector channel

选择通道通常用于高速设备，但一次只能服务一个设备。

所以一个选择通道的最大传输速率不是把所有设备加起来，而是取它能服务的最快设备速率。

每个选择通道连接：

2 个磁盘，每个 $800Kbytes/s$

2 个磁带机，每个 $200Kbytes/s$

最快设备是磁盘：

$800Kbytes/s$

所以每个选择通道最大传输速率为：

$800Kbytes/s$

有两个选择通道：

$2 \times 800 = 1600Kbytes/s$

---

2. 多路复用通道 multiplexor channel

多路复用通道用于低速设备，可以让多个低速设备交错传输。

所以它的最大速率可以把连接设备速率相加。

两个行式打印机：

$2 \times 6.6 = 13.2Kbytes/s$

两个读卡机：

$2 \times 1.2 = 2.4Kbytes/s$

十个 VDT 终端：

$10 \times 1 = 10Kbytes/s$

多路复用通道总速率：

$13.2 + 2.4 + 10 = 25.6Kbytes/s$

---

### 系统最大聚合 I/O 传输速率

总速率为：

$1600 + 25.6 = 1625.6Kbytes/s$

换成 MB/s 约为：

$1.626MB/s$

---

### 第 3 题最终答案

最大聚合 I/O 传输速率为：

$1625.6Kbytes/s$

约等于：

$1.626MB/s$

---

## 4. 磁盘记录顺序存放与优化存放

### 题目内容

假设有 8 个记录 A、B、C、D、E、F、G、H 存放在磁盘里，每个磁道有 8 个扇区，正好可以存放 8 个记录。假设磁盘旋转速度为 20ms/转，处理程序每读出一个记录后，用 2ms 的时间进行处理，请问：

a. 当记录 A、B、C、D、E、F、G、H 按顺序放在磁道上时，顺序处理这 8 个记录花费的总时间是多少？假设启动时的位置正好在 A 扇区的起点。

b. 如何采取优化方法，使处理这些记录所花费的总时间最短？并求出该最短时间。

---

### 解题核心

一圈有 8 个扇区，一圈时间为 20ms。

所以每个扇区经过磁头的时间是：

$20ms / 8 = 2.5ms$

读取一个记录需要经过一个扇区，所以读取一个记录的时间为：

$2.5ms$

读完一个记录后，CPU 还要处理：

$2ms$

因此处理一个记录之后，下一次能准备好继续读的时间为：

$2.5ms + 2ms = 4.5ms$

注意：

相邻扇区之间只隔：

$2.5ms$

但是读完并处理完一个记录需要：

$4.5ms$

所以如果记录按 A、B、C、D、E、F、G、H 连续存放，读完并处理 A 之后，B 已经从磁头下转过去了，必须等 B 下一圈再回来。

这就是磁盘记录顺序存放导致效率低的原因。

---

### a. 顺序存放时的总时间

记录按顺序放置：

A B C D E F G H

启动时正好在 A 扇区起点。

读取并处理 A 需要：

$2.5ms + 2ms = 4.5ms$

但处理完 A 时，B 的扇区起点早就过去了，所以要等待 B 下一圈回来。

B 的起点在 A 起点之后：

$2.5ms$

处理完 A 的时间是：

$4.5ms$

已经错过 B 起点：

$4.5ms - 2.5ms = 2ms$

所以需要等到下一圈的 B：

$20ms - 2ms = 18ms$

也就是说，每两个相邻逻辑记录之间都会多等：

$18ms$

8 个记录总共有 7 次等待。

每个记录的读取加处理时间：

$2.5ms + 2ms = 4.5ms$

8 个记录共：

$8 \times 4.5ms = 36ms$

等待时间共：

$7 \times 18ms = 126ms$

所以总时间为：

$36ms + 126ms = 162ms$

---

### a 的答案

顺序存放时，总时间为：

$162ms$

---

### b. 优化方法

优化思想：

不要把逻辑上相邻的记录放在物理上相邻的扇区，而是进行交错存放，也叫磁盘交错 interleaving。

因为读完并处理一个记录需要：

$4.5ms$

而一个扇区时间是：

$2.5ms$

所以读完并处理后，磁盘已经转过：

$\frac{4.5}{2.5} = 1.8$

个扇区。

下一次读应该安排在大约 2 个扇区之后。

因此，逻辑上的下一个记录最好放在当前记录后面第 2 个扇区的位置。

---

### 构造最优存放方式

按照磁盘旋转方向，把 8 个扇区编号为：

0, 1, 2, 3, 4, 5, 6, 7

让 A 放在 0 号扇区。

为了让下一个逻辑记录在 2 个扇区之后出现，可以安排：

A 在 0 号扇区

B 在 2 号扇区

C 在 4 号扇区

D 在 6 号扇区

继续往后时，因为 0 号扇区已经被 A 占了，所以 E 不能放回 0 号扇区，只能放在下一个合适的位置 1 号扇区。

于是可以安排：

E 在 1 号扇区

F 在 3 号扇区

G 在 5 号扇区

H 在 7 号扇区

所以沿磁盘旋转方向的物理存放顺序为：

A E B F C G D H

也可以写成扇区表：

| 扇区号 | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   |
| ------ | --- | --- | --- | --- | --- | --- | --- | --- |
| 记录   | A   | E   | B   | F   | C   | G   | D   | H   |

这样逻辑处理顺序仍然是：

A, B, C, D, E, F, G, H

只是它们在磁盘上的物理位置被交错安排了。

---

### 优化后的时间计算

访问 A：

A 从 $0ms$ 开始读，读完并处理完需要：

$4.5ms$

B 在 2 号扇区，开始时间是：

$2 \times 2.5ms = 5ms$

所以刚好赶得上 B。

A 到 B 的起点间隔：

$5ms$

同理：

B 到 C：

$5ms$

C 到 D：

$5ms$

D 到 E：

D 在 6 号扇区，起点是 $15ms$

读完并处理完 D 到：

$15ms + 4.5ms = 19.5ms$

E 在 1 号扇区，下一次出现时间是：

$20ms + 2.5ms = 22.5ms$

所以 D 到 E 的起点间隔：

$22.5ms - 15ms = 7.5ms$

然后：

E 到 F：

$5ms$

F 到 G：

$5ms$

G 到 H：

$5ms$

所以从 A 起点到 H 起点的间隔总和为：

$5 + 5 + 5 + 7.5 + 5 + 5 + 5 = 37.5ms$

H 本身还需要读取并处理：

$2.5ms + 2ms = 4.5ms$

所以总时间：

$37.5ms + 4.5ms = 42ms$

---

### b 的答案

最优物理存放顺序可以为：

A E B F C G D H

顺序处理 A、B、C、D、E、F、G、H 的最短时间为：

$42ms$

---

### 第 4 题最终答案

a. 顺序存放时：

$162ms$

b. 采用交错存放，例如：

A E B F C G D H

最短处理时间：

$42ms$

---

## 5. 计算存储 300000 条逻辑记录需要多少磁盘空间

### 题目内容

Calculate how much disk space (in sectors, tracks, and surfaces) will be required to store 300,000 120-byte logical records if the disk is fixed-sector with 512 bytes/sector, with 96 sectors/track, 110 tracks per surface, and 8 usable surfaces. Ignore any file header record(s) and track indexes, and assume that records cannot span two sectors.

中文意思：

计算存储 300000 条逻辑记录需要多少磁盘空间，要求用扇区数、磁道数、盘面数表示。

已知：

每条逻辑记录大小：

$120$ 字节

每个扇区大小：

$512$ 字节

每磁道扇区数：

$96$ 个扇区/磁道

每盘面磁道数：

$110$ 个磁道/盘面

可用盘面数：

$8$ 个

忽略文件头和磁道索引，并且假设一条记录不能跨越两个扇区。

---

### 解题核心

因为一条记录不能跨扇区，所以一个扇区里能放多少条记录，要用向下取整。

每扇区可放记录数：

$\lfloor 512 / 120 \rfloor = 4$

因为：

$4 \times 120 = 480$

一个扇区剩余：

$512 - 480 = 32$

字节无法再放一条完整记录，所以浪费掉。

---

### 计算需要的扇区数

共有 300000 条记录，每个扇区放 4 条。

需要扇区数：

$300000 / 4 = 75000$

所以需要：

$75000$

个扇区。

---

### 计算需要的磁道数

每个磁道有 96 个扇区。

需要磁道数：

$\lceil 75000 / 96 \rceil$

先计算：

$75000 / 96 = 781.25$

因为磁道数必须是整数，所以向上取整：

$\lceil 781.25 \rceil = 782$

所以需要：

$782$

个磁道。

也可以理解为：

781 个完整磁道加 24 个扇区。

因为：

$781 \times 96 = 74976$

剩余扇区：

$75000 - 74976 = 24$

所以需要再占用第 782 个磁道的一部分。

---

### 计算需要的盘面数

每个盘面有 110 个磁道。

需要盘面数：

$\lceil 782 / 110 \rceil$

计算：

$782 / 110 = 7.109...$

向上取整：

$\lceil 7.109 \rceil = 8$

所以需要：

$8$

个盘面。

更细一点说：

7 个完整盘面可以提供：

$7 \times 110 \times 96 = 73920$

个扇区。

还剩：

$75000 - 73920 = 1080$

个扇区。

这些扇区需要：

$\lceil 1080 / 96 \rceil = 12$

个磁道。

所以实际占用为：

7 个完整盘面 + 第 8 个盘面的 12 个磁道

因此按整数盘面数计算，需要：

$8$

个盘面。

---

### 第 5 题最终答案

需要扇区数：

$75000$

需要磁道数：

$782$

需要盘面数：

$8$

更精确地说：

占用 7 个完整盘面，再占用第 8 个盘面的 12 个磁道。

---

## 第 1 题

FIFO：

$556$

SSTF：

$262$

SCAN：

$266$

如果严格要求 SCAN 必须走到磁道 0 再反向：

$286$

---

## 第 2 题

CPU 用于处理中断的时间比例约为：

$73.7\%$

---

## 第 3 题

最大聚合 I/O 传输速率：

$1625.6Kbytes/s$

约等于：

$1.626MB/s$

---

## 第 4 题

顺序存放：

$162ms$

优化交错存放，例如：

A E B F C G D H

最短时间：

$42ms$

---

## 第 5 题

需要扇区数：

$75000$

需要磁道数：

$782$

需要盘面数：

$8$
