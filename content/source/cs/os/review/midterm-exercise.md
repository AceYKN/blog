---
title: CH1–CH6 期中复习习题
order: 1
---

# CH1–CH6 期中复习习题

## Basic Concepts

1. **Operating System（操作系统）**  
   首先是一个程序（系统程序），其功能是控制应用程序的执行；一个接口，连接应用程序和计算机硬件。

2. **Process（进程）**  
   一个正在运行的程序；一个运行程序的实例；分配且能够在处理器上执行的实体；由一组执行的指令、一个当前状态和一组相关的系统资源表征的活动单元。

3. **Thread（线程）**  
   操作系统中能够运算调度的最小单位。

4. **Concurrency（并发）**  
   指在一个时间段内，操作系统中存在多个程序能够在同一个处理机上运行，但在任一个时刻点上只有一个程序在处理机上运行。

5. **Critical Section（临界区）**  
   指一个访问临界资源的程序片段，临界资源指不可同时被多个进程或线程访问的共享资源。

6. **Mutual Exclusion（互斥）**  
   进程之间因相互竞争共享资源所产生的一种制约关系，当一个进程进入临界区使用共享资源时，另一个进程必须等待。

7. **Synchronization（同步）**  
   进程之间需要在执行的某个位置上协调工作次序、传递信息所产生的一种制约关系。

8. **Semaphore（信号量）**  
   一个整数值，用于进程间信号的传递，作用于阻塞进程或解除阻塞。

9. **Deadlock（死锁）**  
   一组相互竞争系统资源或进行通信的进程间的"永久"阻塞。

10. **Starvation（饥饿）**  
    进程资源竞争而导致长时间得不到处理器时间的一种状态。

---

## Fill in the Blanks

1. The main objectives of the OS are: (___) (___) and (___).
2. (___) was introduced in modern operating systems, making concurrency and sharing possible.
3. When a processor time slice of a process is exhausted, the process should change to the (___) state.
4. When creating a new process, the first step is to assign a unique (___) to the new process.
5. The first step in a full process switch is to save the (___) of the process.
6. In the instruction system, (___) can only be used by the Operating System.
7. (___) is a special integer variable to be used for signaling among processes.
8. (___) is a special semaphore that takes on only the values 0 and 1.
9. The operating system's (___) refers to its inherent flexibility in permitting functional modifications to the system without interfering with service.

::: details Reference Answers
1. Convenience（方便）、Efficiency（有效）、Ability to evolve（扩展能力）
2. Multiprogramming（多道程序设计）
3. Ready（就绪）
4. Identifier（标识符）
5. Context（上下文 / 处理机状态字）
6. Privileged instructions（特权指令）
7. Semaphore / Counting semaphore / General semaphore（信号量）
8. Binary semaphore（二值信号量）
9. Ability to evolve（可扩展性）
:::

---

## Single Choice

**1.** A process is in (___) state when it is in the main memory and awaiting an event.

- A) Ready
- B) Blocked/Suspend
- **C) Blocked** (正确)
- D) Ready/Suspend

---

**2.** Requested resources are granted to processes whenever possible with (___).

- **A) Deadlock detection** (正确)
- B) Deadlock avoidance
- C) Mutual exclusion
- D) Preemption

---

**3.** In a three state Process Model, (___) is not a valid state transition.

- **A) Block -> Running** (正确)
- B) Running → Block
- C) Ready → Running
- D) Running → Ready

---

**4.** The permanent blocking of a set of processes that either compete for system resources or communicate with each other is called: (___).

- A) Starvation
- **B) Deadlock** (正确)
- C) Prioritization
- D) Mutual exclusion

---

**5.** Suppose the initial value of a semaphore associated with a resource is 4 and the current value is −2. If V is the number of available resources and W is the number of processes waiting for the resources, then V and W are (___) respectively.

- **A) 0, 2** (正确)
- B) 4, 0
- C) 2, 0
- D) −2, 0

---

**6.** The end of a printout requested by a process will cause the process state to change from (___).

- A) running → ready
- B) running → blocking
- C) ready → running
- **D) blocking -> ready** (正确)

---

**7.** If there are five plotters in the system and all processes need to use two of them. Suppose each process is allowed to request only one at a time, then at most (___) processes are allowed to compete without deadlock.

- A) 5
- B) 2
- C) 3
- **D) 4** (正确)

---

**8.** In a concurrent system with multiple processes, there is certainly no deadlock due to contention over (___).

- A) Printer
- B) Tape drive
- C) CPU
- **D) Disk** (正确)

---

## Questions

**1. What are the differences between process and thread?**

> **答：** 进程是资源分配的基本单位；线程是处理器调度的基本单位。

---

**2. Explain the relationship between program and process.**

> **答：** 程序是静态的，未装入内存中；而进程是动态的，是正在被执行的程序。一个程序可以对应多个进程，但一个进程只能对应一个程序。

---

**3. What are the differences between reusable resources and consumable resources?**

> **答：**
>
> - **可重用资源（Reusable Resource）**：一次仅供一个进程安全使用且不因使用而耗尽的资源。进程得到资源单元并使用后，会释放这些单元供其他进程再次使用。例如：处理器、I/O 通道、内存和外存、设备，以及文件、数据库和信号量等数据结构。
> - **可消耗资源（Consumable Resource）**：可被创建（生产）和销毁（消耗）的资源。消费进程得到一个资源时，该资源就不再存在。例如：中断、信号、消息和 I/O 缓冲区中的信息。

---

**4. What are deadlock and livelock? Please briefly explain their difference.**

> **答：**
>
> - **死锁（Deadlock）**：两个或两个以上的线程在执行过程中，由于竞争资源或彼此通信而造成的一种永久阻塞现象，若无外力作用，它们都将无法推进下去。
> - **活锁（Livelock）**：两个或两个以上的进程为响应其他进程中的变化而持续改变自己的状态，但不做有用工作的情况。进程没有被阻塞，但由于某些条件没有满足，导致一直重复"尝试—失败—尝试—失败"的过程。处于活锁的实体不断改变状态，活锁有可能自行解开。

---

**5. List the requirements for mutual exclusion.**

> **答：**
>
> 1. 必须强制实施互斥：一次只允许一个进程进入临界区
> 2. 一个在临界区停止的进程不能干涉其他进程
> 3. 不能产生死锁或饥饿
> 4. 在没有进程在临界区时，任何需要进入临界区的进程必须能够立即进入（公平性）
> 5. 对进程的执行速度和处理器数量没有任何限制和要求
> 6. 进程驻留在临界区的时间必须是有限的

---

**6. List reasons why a mode switch between threads may be cheaper than a mode switch between processes.**

> **答：**
>
> - 线程共享内存和文件，线程切换不需要内核参与；
> - 线程上下文切换所需开销比进程上下文切换开销小。

---

## Problem Solving

### Problem 1 — 银行家算法 Banker's Algorithm

Suppose current system states are shown as in the following table, at this time Available = (1,2,1). 

<table>
  <thead>
    <tr>
      <th rowspan="2">Process</th>
      <th colspan="3">Claim</th>
      <th colspan="3">Allocation</th>
    </tr>
    <tr>
      <th>R1</th><th>R2</th><th>R3</th>
      <th>R1</th><th>R2</th><th>R3</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>P1</td><td>3</td><td>2</td><td>2</td><td>1</td><td>0</td><td>0</td></tr>
    <tr><td>P2</td><td>6</td><td>3</td><td>1</td><td>5</td><td>1</td><td>1</td></tr>
    <tr><td>P3</td><td>3</td><td>4</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
    <tr><td>P4</td><td>4</td><td>2</td><td>2</td><td>0</td><td>2</td><td>0</td></tr>
  </tbody>
</table>

**(1)** When P2 issues request₂(1,1,0), can the system allocate the resource? If yes, give a safety sequence.

**(2)** After P2 issues request₂(1,1,0), P1 then issues request₁(0,1,0). Can the system allocate?

**(3)** After P2 issues request₂(1,1,0), P3 then issues request₃(0,0,1). Can the system allocate?

::: details Reference Answers
**(1) 可以分配。**  
P2 分配后仍可执行完毕，释放资源，不存在死锁情况。  
**安全序列：P2 → P1 → P3 → P4**（P2 在最前即正确）

**(2) 不可以分配。**  
P2 和 P1 均分配后，剩余可用资源无法满足任何一个进程继续运行，会产生死锁。

**(3) 可以分配。**  
P2 仍能获得足够资源运行完毕，运行结束后释放资源，不会产生死锁。  
**安全序列：P2 → P3 → P1 → P4**
:::

---

### Problem 2 — 信号量同步

两个进程并发执行，优先级相同，信号量 s1、s2 初值均为 0：

```c
P1() {                      P2() {
  y = 1;                      x = 1;
  y = y + 1;                  x = x + 3;
  semSignal(s1);              semWait(s1);
  z = y + 3;                  x = x + y;
  semWait(s2);                semSignal(s2);
  y = z + y;                  z = y + x;
}                           }
```

请给出并发执行后 x、y、z 的值。

::: details Reference Answers
y=2;x=4

Z=5;x=6

z=8;y=10;x=6  或者  y=7;z=13;x=6
:::

---

### Problem 3 — 生产者消费者问题

三个工人 A、B、C 共享一个大小为 $M$（$M \geq 3$）的箱子：

- **Worker A**：持续生产 **车架（frame）** 并放入箱子
- **Worker B**：持续生产 **车轮（wheel）** 并放入箱子
- **Worker C**：每次取 **1 个车架 + 2 个车轮**，组装成自行车

**原始伪代码（未同步）：**

```c
Worker A { while(true) { produce a frame;  put frame into box; } }
Worker B { while(true) { produce a wheel;  put wheel into box; } }
Worker C { while(true) { take a frame from box;
                          take two wheels from box;
                          assemble a bike; } }
```

Please use semWait and semSignal operation to achieve the cooperation of three workers respectively, which requires that the solution does not contain deadlock. 


**死锁分析：**  
若箱中 $M$ 个槽全部为车轮，或 $M-1$ 个槽全为车架（剩余空间不足放第 2 个车轮），Worker C 均无法组装。  
因此：**车架上限 = $M-2$，车轮上限 = $M-1$**。

**信号量定义：**

```
semaphore empty    = M      // 空槽数量
semaphore frame    = 0      // 箱中车架数
semaphore wheel    = 0      // 箱中车轮数
semaphore maxframe = M - 2  // 车架数上限
semaphore maxwheel = M - 1  // 车轮数上限
```

**完整同步伪代码：**

```c
Worker A {
    while (true) {
        produce a frame;
        semWait(maxframe);   // 车架未超上限
        semWait(empty);      // 有空槽
        put frame into box;
        semSignal(frame);    // 车架数 +1
    }
}

Worker B {
    while (true) {
        produce a wheel;
        semWait(maxwheel);   // 车轮未超上限
        semWait(empty);      // 有空槽
        put wheel into box;
        semSignal(wheel);    // 车轮数 +1
    }
}

Worker C {
    while (true) {
        semWait(frame);      // 等待至少 1 个车架
        take a frame from box;
        semWait(wheel);      // 等待至少 2 个车轮
        semWait(wheel);
        take two wheels from box;
        assemble a bike;
        semSignal(maxframe); // 车架槽释放
        semSignal(maxwheel); // 车轮槽释放 ×2
        semSignal(maxwheel);
        semSignal(empty);    // 空槽 +3
        semSignal(empty);
        semSignal(empty);
    }
}
```
