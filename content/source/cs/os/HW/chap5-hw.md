---
title: Chap. 5 HW
order: 5
---

# OS Chap.5 HW

### 1. 阅览室座位与登记问题 (Reading Room)

**问题分析：** 这是一个带有资源数量限制的互斥问题。座位是有限资源（100个），而“登记表”是临界资源（不能同时有多人一起写），需要互斥访问。

**信号量定义与初始化：**
*   `seats = 100;` // 资源信号量，表示阅览室空座位的数量。
*   `mutex = 1;`   // 互斥信号量，用于对登记表进行互斥访问。

**读者进程 (Reader Process) 的同步结构：**
```c
Reader() {
    while (true) {
        // 准备进入阅览室
        semWait(seats);     // 申请一个座位，如果没有空位则阻塞等待
        semWait(mutex);     // 申请访问登记表（互斥）
        登记座位号和姓名;     // 临界区：登记
        semSignal(mutex);   // 释放登记表

        阅读(Reading);       // 在阅览室读书

        // 准备离开阅览室
        semWait(mutex);     // 申请访问登记表（互斥）
        注销登记记录;         // 临界区：注销
        semSignal(mutex);   // 释放登记表
        semSignal(seats);   // 释放一个座位，唤醒可能在门外等待的读者
    }
}
```

---

### 2. 司机与售票员同步问题 (Bus Driver and Conductor)
**问题分析：** 这是一个典型的进程同步问题。两者的动作有严格的先后顺序：司机必须等售票员关好门后才能启动车辆；售票员必须等司机停稳车后才能开门。
初始状态是：车停着，门是开的。下一步应该是售票员关门。

**信号量定义与初始化：**
*   `start_bus = 0;` // 同步信号量，表示是否可以发车（0表示需等待售票员关门发送信号）。
*   `open_door = 0;` // 同步信号量，表示是否可以开门（0表示需等待司机停车发送信号）。

**同步关系实现：**
```c
Driver() { // 司机进程
    while (true) {
        semWait(start_bus);  // 等待售票员关门的信号
        启动车辆(Starting);
        正常行车(Driving);
        到站停车(Stopping);
        semSignal(open_door);// 停车完毕，向售票员发送可以开门的信号
    }
}

Conductor() { // 售票员进程
    while (true) {
        关车门(Closing door);
        semSignal(start_bus);// 关门完毕，向司机发送可以发车的信号
        售票(Selling tickets);
        semWait(open_door);  // 等待司机停车的信号
        开车门(Opening door);
    }
}
```

---

### 3. 多级生产者-消费者问题 (Processes A, B, and C)
**问题分析：** 这是经典生产者/消费者问题 的串联变种。A和B共享大小为 $n$ 的缓冲池，B和C共享大小为 $m$ 的缓冲池。进程 B 既是 A 的消费者，又是 C 的生产者。

**信号量定义与初始化：**
*   `empty1 = n;`  // A和B之间的空闲缓冲区数量
*   `full1 = 0;`   // A和B之间含有数据的缓冲区数量
*   `mutex1 = 1;`  // A和B之间访问缓冲池的互斥信号量
*   `empty2 = m;`  // B和C之间的空闲缓冲区数量
*   `full2 = 0;`   // B和C之间含有数据的缓冲区数量
*   `mutex2 = 1;`  // B和C之间访问缓冲池的互斥信号量

**同步关系实现：**
```c
Process_A() { // 生产者 A
    while (true) {
        生产数据;
        semWait(empty1);    // 申请第一组的一个空缓冲区
        semWait(mutex1);    // 互斥访问第一组缓冲池
        将数据放入缓冲池1;
        semSignal(mutex1);  // 释放第一组缓冲池
        semSignal(full1);   // 第一组满缓冲区加1，唤醒 B
    }
}

Process_B() { // 消费者 B & 生产者 B
    while (true) {
        semWait(full1);     // 等待第一组缓冲池中有数据
        semWait(mutex1);    // 互斥访问第一组缓冲池
        从缓冲池1取出数据;
        semSignal(mutex1);  // 释放第一组缓冲池
        semSignal(empty1);  // 第一组空缓冲区加1，唤醒 A
        
        加工处理该数据;

        semWait(empty2);    // 申请第二组的一个空缓冲区
        semWait(mutex2);    // 互斥访问第二组缓冲池
        将处理后的数据放入缓冲池2;
        semSignal(mutex2);  // 释放第二组缓冲池
        semSignal(full2);   // 第二组满缓冲区加1，唤醒 C
    }
}

Process_C() { // 消费者 C
    while (true) {
        semWait(full2);     // 等待第二组缓冲池中有数据
        semWait(mutex2);    // 互斥访问第二组缓冲池
        从缓冲池2取出数据;
        semSignal(mutex2);  // 释放第二组缓冲池
        semSignal(empty2);  // 第二组空缓冲区加1，唤醒 B
        
        消费数据;
    }
}
```

---

### 4. 苹果与橘子问题 (Father, Mother, Sons, Daughters)
**问题分析：** 这是一个多生产者、多消费者且带有产品种类区分的问题。盘子容量为 2（表示最多放2个水果）。每次只能放入或取出一个水果，需要互斥。

**信号量定义与初始化：**
*   `plate = 2;`    // 同步信号量，盘子里的空闲空间，初始可放2个水果
*   `apple = 0;`    // 同步信号量，盘子里苹果的数量
*   `orange = 0;`   // 同步信号量，盘子里橘子的数量
*   `mutex = 1;`    // 互斥信号量，保证每次只有一个动作（放/取）在盘子上进行

**同步关系实现：**
```c
Father() {
    while (true) {
        准备一个苹果;
        semWait(plate);      // 等待盘子有空位
        semWait(mutex);      // 互斥访问盘子
        把苹果放入盘子;
        semSignal(mutex);    // 释放盘子
        semSignal(apple);    // 苹果数量加1，唤醒女儿
    }
}

Mother() {
    while (true) {
        准备一个橘子;
        semWait(plate);      // 等待盘子有空位
        semWait(mutex);      // 互斥访问盘子
        把橘子放入盘子;
        semSignal(mutex);    // 释放盘子
        semSignal(orange);   // 橘子数量加1，唤醒儿子
    }
}

Daughter_1_and_2() { // 两个女儿的逻辑相同
    while (true) {
        semWait(apple);      // 等待盘子里有苹果
        semWait(mutex);      // 互斥访问盘子
        从盘子中取走一个苹果;
        semSignal(mutex);    // 释放盘子
        semSignal(plate);    // 盘子空位加1，唤醒父母
        吃苹果;
    }
}

Son_1_and_2() { // 两个儿子的逻辑相同
    while (true) {
        semWait(orange);     // 等待盘子里有橘子
        semWait(mutex);      // 互斥访问盘子
        从盘子中取走一个橘子;
        semSignal(mutex);    // 释放盘子
        semSignal(plate);    // 盘子空位加1，唤醒父母
        吃橘子;
    }
}
```

---

### 5. 进程 P, Q, R 同步 (Concurrent processes P, Q, R)
这道题与第3题结构非常相似，分为缓冲池大小为 1 和大小为 $m, n$ 两种情况。

#### (1) 共享一个单缓冲 (Share ONE buffer each)
**问题分析：** 因为 P 和 Q 之间只有一个缓冲区，Q 和 R 之间也只有一个缓冲区。容量为 1 时，空和满信号量本身就能保证互斥，因此通常可以省略 `mutex` 信号量（加上也不算错）。

**信号量定义与初始化：**
*   `emptyPQ = 1;` // P与Q之间的空缓冲区数
*   `fullPQ = 0;`  // P与Q之间的满缓冲区数
*   `emptyQR = 1;` // Q与R之间的空缓冲区数
*   `fullQR = 0;`  // Q与R之间的满缓冲区数

```c
Process_P() {
    while (true) {
        读取输入设备信息;
        semWait(emptyPQ);  // 等待 PQ 间缓冲区为空
        将信息放入 PQ 缓冲区;
        semSignal(fullPQ); // 唤醒 Q
    }
}

Process_Q() {
    while (true) {
        semWait(fullPQ);   // 等待 PQ 间缓冲区有信息
        从 PQ 缓冲区提取信息;
        semSignal(emptyPQ);// 唤醒 P 继续输入
        
        加工处理信息;

        semWait(emptyQR);  // 等待 QR 间缓冲区为空
        将处理后信息放入 QR 缓冲区;
        semSignal(fullQR); // 唤醒 R
    }
}

Process_R() {
    while (true) {
        semWait(fullQR);   // 等待 QR 间缓冲区有信息
        从 QR 缓冲区取信息;
        semSignal(emptyQR);// 唤醒 Q 继续存放
        
        打印输出;
    }
}
```

#### (2) 共享多个缓冲区的缓冲池 (Share a buffer pool of size m, n)
**问题分析：** 此时缓冲池容量大于 1，必须引入 `mutex` 互斥信号量来保证同一时间只有一个进程在操作同一个缓冲池的指针。

**信号量定义与初始化：**
*   `emptyPQ = m;`   // P与Q之间的空缓冲区数
*   `fullPQ = 0;`    // P与Q之间的满缓冲区数
*   `mutexPQ = 1;`   // 互斥访问 P与Q 的缓冲池
*   `emptyQR = n;`   // Q与R之间的空缓冲区数
*   `fullQR = 0;`    // Q与R之间的满缓冲区数
*   `mutexQR = 1;`   // 互斥访问 Q与R 的缓冲池

```c
Process_P() {
    while (true) {
        读取输入设备信息;
        semWait(emptyPQ);
        semWait(mutexPQ);    // 互斥锁定
        将信息放入 PQ 缓冲池;
        semSignal(mutexPQ);  // 解锁
        semSignal(fullPQ);
    }
}

Process_Q() {
    while (true) {
        semWait(fullPQ);
        semWait(mutexPQ);    // 互斥锁定
        从 PQ 缓冲池取出信息;
        semSignal(mutexPQ);  // 解锁
        semSignal(emptyPQ);
        
        加工处理信息;

        semWait(emptyQR);
        semWait(mutexQR);    // 互斥锁定
        将处理后信息放入 QR 缓冲池;
        semSignal(mutexQR);  // 解锁
        semSignal(fullQR);
    }
}

Process_R() {
    while (true) {
        semWait(fullQR);
        semWait(mutexQR);    // 互斥锁定
        从 QR 缓冲池提取信息;
        semSignal(mutexQR);  // 解锁
        semSignal(emptyQR);
        
        打印输出;
    }
}
```

以下是为您整理的第五章作业（第6题至第10题）的完整中文解答。这些解答基于操作系统中经典的并发控制原理，并严格使用 `semWait` 和 `semSignal` 原语来描述。

---

### 6. 工厂仓库与运输车问题 (Factory Warehouse & Transport Vehicle)
**问题分析：** 这是一个带有额外互斥限制的**生产者-消费者问题**。
1. 仓库最多容纳10件设备（有界缓冲）。
2. 生产部门（生产者）入库，销售部门（消费者）出库。
3. **关键限制：** 无论入库还是出库，都必须使用同一辆运输车，且每次只能运一件。因此，“运输车”是一个需要两方互斥使用的共享资源。

**信号量与变量定义：**
*   `empty = 10;`  // 同步信号量，表示仓库还可以存放多少件设备
*   `full = 0;`    // 同步信号量，表示仓库中当前有多少件设备
*   `vehicle = 1;` // 互斥信号量，表示当前是否有空闲的运输车（1辆）

**同步关系实现：**
```c
Producer_Department() { // 生产部门进程
    while (true) {
        生产出一件新设备;
        semWait(empty);      // 申请仓库里的一个空位（若仓库满则等待）
        semWait(vehicle);    // 申请唯一的运输车（互斥）
        
        使用运输车将设备运入仓库;
        
        semSignal(vehicle);  // 释放运输车
        semSignal(full);     // 仓库里的设备总数加1，唤醒可能等待的销售部门
    }
}

Sales_Department() { // 销售部门进程
    while (true) {
        semWait(full);       // 申请提取一件设备（若仓库空则等待）
        semWait(vehicle);    // 申请唯一的运输车（互斥）
        
        使用运输车将设备运出仓库;
        
        semSignal(vehicle);  // 释放运输车
        semSignal(empty);    // 仓库里的空位加1，唤醒可能等待的生产部门
        销售给客户;
    }
}
```

---

### 7. 单行桥梁交通拥堵问题 (Bridge Traffic Management)
**问题分析：** 这是一个变种的**读者-写者问题（同类不互斥，异类互斥）**。
桥上不允许两车相交（即相反方向的车不能同时在桥上），但允许同向的多辆车依次通过。我们可以将双向的车流分为“南向北（S2N）”和“北向南（N2S）”。两个方向相当于两组不同的“读者”，任何一组在桥上时，另一组必须等待。

**信号量与变量定义：**
*   `bridge = 1;`   // 互斥信号量，争夺桥梁的使用权
*   `count_S2N = 0;` // 计数器，记录当前桥上有多少辆南向北的车
*   `mutex_S2N = 1;` // 互斥信号量，保护 count_S2N 的加减操作
*   `count_N2S = 0;` // 计数器，记录当前桥上有多少辆北向南的车
*   `mutex_N2S = 1;` // 互斥信号量，保护 count_N2S 的加减操作

**同步关系实现：**
```c
Car_South_to_North() { // 南向北行驶的车辆
    semWait(mutex_S2N);
    if (count_S2N == 0) {
        semWait(bridge); // 如果是该方向的第一辆车，负责封锁桥梁，禁止对向车上桥
    }
    count_S2N++;         // 该方向桥上车辆数加1
    semSignal(mutex_S2N);

    // 此时同向车可继续上桥
    过桥 (Crossing the bridge);

    semWait(mutex_S2N);
    count_S2N--;         // 车辆下桥，计数减1
    if (count_S2N == 0) {
        semSignal(bridge); // 如果是该方向最后一辆下桥的车，释放桥梁使用权
    }
    semSignal(mutex_S2N);
}

Car_North_to_South() { // 北向南行驶的车辆
    semWait(mutex_N2S);
    if (count_N2S == 0) {
        semWait(bridge); // 第一辆车负责封锁桥梁
    }
    count_N2S++;
    semSignal(mutex_N2S);

    过桥 (Crossing the bridge);

    semWait(mutex_N2S);
    count_N2S--;
    if (count_N2S == 0) {
        semSignal(bridge); // 最后一辆车释放桥梁
    }
    semSignal(mutex_N2S);
}
```

---

### 8. 哲学家就餐问题 (The Dining Philosophers Problem)
**问题分析：** 5名哲学家，5根筷子。如果5个人同时饿了并同时拿起左手的筷子，所有人都在等右手的筷子，就会发生**死锁（Deadlock）**。
**解决方案：** 操作系统中最经典的破除死锁方案之一是**限制就餐人数**。通过引入一个“门卫”或“座位”限制，最多只允许 4 位哲学家同时去拿筷子。这样至少有1个人能拿到2根筷子顺利吃完，从而打破死锁与饥饿。

**信号量与变量定义：**
*   `fork = {1, 1, 1, 1, 1};` // 数组信号量，代表5根筷子，初始均为1
*   `room = 4;` // 同步信号量，限制最多只允许4名哲学家同时竞争筷子

**同步关系实现：**
```c
Philosopher(int i) { // i 的取值范围是 0 到 4
    while (true) {
        思考 (Thinking);
        
        // 准备就餐
        semWait(room);           // 申请进入竞争队列（最多允许4人）
        
        semWait(fork[i]);        // 拿起左边的筷子
        semWait(fork[(i+1) % 5]);// 拿起右边的筷子
        
        进餐 (Eating);           // 拿到两根筷子，开始进餐
        
        semSignal(fork[(i+1) % 5]);// 放下右边的筷子
        semSignal(fork[i]);        // 放下左边的筷子
        
        semSignal(room);         // 离开竞争队列，让出名额给其他人
    }
}
```

---

### 9. 读者-写者问题 (Readers-Writers Problem)
**问题分析：** 允许多个读者同时读；只允许一个写者写；写者写的时候禁止任何读者读。此处要求实现“读者优先（Readers Have Priority）”或标准的读者写者模型。需要修改题目中提供的 `Reader` 类的 `Read` 方法和 `Writer` 类的 `Write` 方法。

**信号量与变量定义：**
*   `readcount = 0;` // 全局计数器，记录当前的读者数量
*   `x = 1;`         // 互斥信号量，用于对 readcount 的互斥访问
*   `wsem = 1;`      // 互斥信号量，用于实现“读/写”和“写/写”互斥

**同步关系实现：**
```c
class Reader {
    void Read() {
        semWait(x);              // 互斥访问 readcount
        readcount++;
        if (readcount == 1) {
            semWait(wsem);       // 如果是第一个读者，负责阻挡写者
        }
        semSignal(x);            // 释放 readcount 锁

        执行读操作 (Reading data...); 

        semWait(x);              // 互斥访问 readcount
        readcount--;
        if (readcount == 0) {
            semSignal(wsem);     // 如果是最后一个读者，唤醒/允许写者进入
        }
        semSignal(x);            // 释放 readcount 锁
    }
}

class Writer {
    void Write() {
        semWait(wsem);           // 申请对数据区的独占写权限

        执行写操作 (Writing data...);

        semSignal(wsem);         // 释放数据区权限
    }
}
```

---

### 10. 理发师问题 (Barber Problem)
**问题分析：** 这是一个典型的进程同步问题。
1. 理发师没顾客时睡觉（等顾客唤醒）。
2. 顾客来时，如果理发师在忙且有空椅子，就坐下等；如果没有空椅子，就直接离开。

**信号量与变量定义：**
*   `customers = 0;` // 同步信号量，记录正在等待理发的顾客数量（用于唤醒理发师）
*   `barber = 0;`    // 同步信号量，表示理发师是否准备好理发（0表示忙/睡，1表示准备好）
*   `mutex = 1;`     // 互斥信号量，保护共享变量 waiting
*   `waiting = 0;`   // 整数变量，记录当前坐在椅子上等待的顾客数量
*   `N;`             // 常量，等候室的椅子总数

**同步关系实现：**
```c
Barber() {
    while (true) {
        semWait(customers);   // 理发师等待顾客。若为0则睡觉；若大于0则服务顾客
        
        semWait(mutex);       // 互斥访问 waiting 变量
        waiting--;            // 从等候室叫起一位顾客，等待人数减1
        semSignal(barber);    // 理发师准备就绪，释放理发信号
        semSignal(mutex);     // 释放互斥锁
        
        理发 (Cutting hair);
    }
}

Customer() {
    semWait(mutex);           // 顾客进门，互斥检查椅子数量
    if (waiting < N) {        // 如果有空椅子
        waiting++;            // 坐下等待，等待人数加1
        semSignal(customers); // 发出顾客到来的信号（如果理发师在睡，就会唤醒他）
        semSignal(mutex);     // 释放互斥锁
        
        semWait(barber);      // 等待理发师叫自己（等待 barber 信号量）
        被理发 (Getting haircut);
    } else {
        semSignal(mutex);     // 没有空椅子，直接释放互斥锁
        离开理发店 (Leave the shop); 
    }
}
```

这里为您提供第五章作业剩余题目（第11、12、13题）的完整中文解答。解答继续采用标准的操作系统并发与同步原理，使用 `semWait` 和 `semSignal` 原语。

---

### 11. 少林寺打水问题 (Shaolin Temple Issue)

**问题分析：**
这是一个带有多个约束条件的复杂**生产者-消费者问题**。
*   **生产者：** 小和尚（打水）。
*   **消费者：** 老和尚（饮水）。
*   **共享资源（缓冲）：** 水缸（容量为 10 桶水）。
*   **互斥资源：** 
    1.  **水井：** 每次只能容纳一个水桶（打水动作需互斥）。
    2.  **水缸：** 每次只能倒入或取出一桶水（入水/取水动作需互斥）。
*   **公共限制资源：** 水桶（共 3 个）。不管是小和尚去井里打水，还是老和尚从水缸里取水，都需要先拿一个水桶。

**信号量定义与初始化：**
*   `empty = 10;` // 同步信号量：水缸中的剩余空间
*   `full = 0;` // 同步信号量：水缸中当前的水量
*   `bucket = 3;` // 资源信号量：当前可用的水桶数量
*   `mutex_well = 1;` // 互斥信号量：对水井的互斥访问
*   `mutex_tank = 1;` // 互斥信号量：对水缸的互斥访问

**同步关系实现：**
```c
Young_Monk() { // 小和尚进程
    while (true) {
        semWait(empty);      // 申请水缸里的空位（若水缸已满则等待）
        semWait(bucket);     // 申请一个水桶（若无水桶则等待）
        
        semWait(mutex_well); // 互斥访问水井
        从水井中打一桶水;
        semSignal(mutex_well); // 离开水井
        
        semWait(mutex_tank); // 互斥访问水缸
        将水倒入水缸中;
        semSignal(mutex_tank); // 离开水缸
        
        semSignal(bucket);   // 归还水桶
        semSignal(full);     // 水缸里的水量加1，唤醒老和尚
    }
}

Old_Monk() { // 老和尚进程
    while (true) {
        semWait(full);       // 申请水缸里的水（若没水则等待）
        semWait(bucket);     // 申请一个水桶（若无水桶则等待）
        
        semWait(mutex_tank); // 互斥访问水缸
        从水缸中取出一桶水;
        semSignal(mutex_tank); // 离开水缸
        
        semSignal(empty);    // 水缸空位加1，唤醒小和尚（可以立刻释放空位）
        
        喝水 (Drinking water);
        
        semSignal(bucket);   // 喝完后，归还水桶
    }
}
```
*(注意：为防止死锁，小和尚应先申请 `empty` 再申请 `bucket`，否则如果水缸已满，小和尚拿光了所有水桶并等待空位，而老和尚没有水桶无法取水，就会死锁。)*

---

### 12. 自行车生产线问题 (Bicycle Production Line)

**问题分析：**
这也是一个**生产者-消费者问题**，难点在于**防范死锁 (Deadlock Prevention)**。
*   **容量限制：** 箱子总容量为 $N$ （$N \ge 3$）。
*   工人 1 生产车架（每次放 1 个）；工人 2 生产车轮（每次放 1 个）；工人 3 组装（每次取 1 个车架、2 个车轮）。
*   **死锁隐患：** 
    *   如果箱子全被“车架”占满（放了 $N$ 个车架），工人 2 放不进车轮，工人 3 取不到车轮，死锁。
    *   如果箱子全被“车轮”占满（放了 $N$ 个车轮），工人 1 放不进车架，工人 3 取不到车架，死锁。
*   **死锁解决方案：** 
    限制箱子中**最多只能放 $N-2$ 个车架**（保证至少有空间放2个车轮），以及**最多只能放 $N-1$ 个车轮**（保证至少有空间放1个车架）。

**信号量定义与初始化：**
*   `mutex = 1;` // 互斥信号量：互斥访问箱子
*   `empty = N;` // 同步信号量：箱子中的总空位数
*   `frames = 0;` // 同步信号量：箱子中的车架数量
*   `wheels = 0;` // 同步信号量：箱子中的车轮数量
*   `empty_frame = N - 2;` // 同步信号量：允许放入车架的空位限制
*   `empty_wheel = N - 1;` // 同步信号量：允许放入车轮的空位限制

**同步关系实现：**
```c
Worker_1() { // 生产车架
    while(1) {
        Processing a frame;
        semWait(empty_frame); // 检查是否达到车架上限
        semWait(empty);       // 申请一个物理空位
        semWait(mutex);       // 互斥访问箱子
        Put the frame into the box;
        semSignal(mutex);     // 离开箱子
        semSignal(frames);    // 车架数量加1
    }
}

Worker_2() { // 生产车轮
    while(1) {
        Processing a wheel;
        semWait(empty_wheel); // 检查是否达到车轮上限
        semWait(empty);       // 申请一个物理空位
        semWait(mutex);       // 互斥访问箱子
        Put the wheel into the box;
        semSignal(mutex);     // 离开箱子
        semSignal(wheels);    // 车轮数量加1
    }
}

Worker_3() { // 组装自行车
    while(1) {
        semWait(frames);      // 申请1个车架
        semWait(wheels);      // 申请第1个车轮
        semWait(wheels);      // 申请第2个车轮
        semWait(mutex);       // 互斥访问箱子
        Take a frame from the box;
        Take two wheels from the box;
        semSignal(mutex);     // 离开箱子
        
        semSignal(empty);     // 释放3个物理空位
        semSignal(empty);
        semSignal(empty);
        semSignal(empty_frame); // 释放1个车架配额
        semSignal(empty_wheel); // 释放2个车轮配额
        semSignal(empty_wheel);
        
        Assemble into one vehicle;
    }
}
```

---

### 13. 并发执行路径与时间相关的错误 (Concurrent Execution & Timing Errors)

#### (1) 进程 P 和 Q 的并发执行路径
**解答：**
进程 P 包含指令 A、B、C（必须保证顺序：A -> B -> C）。
进程 Q 包含指令 D、E（必须保证顺序：D -> E）。
两进程并发执行时，指令在宏观上会发生交替（Interleaving），总指令数为 5 条。符合两种顺序的排列组合数为 $C_5^2 = 10$ 种。

可能的并发执行路径（10种）如下：
1.  **A B C D E** (P 执行完，Q 执行)
2.  **A B D C E**
3.  **A B D E C**
4.  **A D B C E**
5.  **A D B E C**
6.  **A D E B C**
7.  **D A B C E**
8.  **D A B E C**
9.  **D A E B C**
10. **D E A B C** (Q 执行完，P 执行)

---

#### (2) 变量的并发执行与时间相关的错误
**背景分析：**
*   初始值 $k = 5$。
*   P1 独立执行两个循环后：
    *   第 1 次循环：$k = 5 \times 2 = 10$；$k = 10 + 1 = 11$
    *   第 2 次循环：$k = 11 \times 2 = 22$；$k = 22 + 1 = 23$
*   前两轮执行完毕后，当前 $k$ 的值为 **$23$**。
*   接下来 P1 和 P2 并发执行一次循环，存在 4 条主要语句交替执行：
    *   `P1_a`: $k := k \times 2;$
    *   `P1_b`: $k := k + 1;$
    *   `P2_a`: `print k;`
    *   `P2_b`: $k := 0;$

**可能的 print 输出值（如果在高级语言语句级发生交替）：**
1.  **输出 23**：如果 `P2_a` 最先执行（在 P1 还没修改 $k$ 时）。
    *   *执行流：* `P2_a` (print 23) -> 然后无论后面顺序如何。
2.  **输出 46**：如果 `P1_a` 发生，接着交替到 `P2_a` 执行。
    *   *执行流：* `P1_a` (k = 23*2=46) -> `P2_a` (print 46) -> ...
3.  **输出 47**：如果 P1 完整执行完一遍，再交替到 `P2_a` 执行。
    *   *执行流：* `P1_a` (k=46) -> `P1_b` (k=47) -> `P2_a` (print 47) -> ...

*(注：如果在底层寄存器/汇编指令层面发生中断交替，还可能产生其他异常值，但在通常的考察中，上面三个是基于语句级的合法交替输出。)*

**指出与时间相关的错误 (Errors related to time):**
这种现象在操作系统中被称为 **竞态条件 (Race Condition)**。
1.  **问题本质：** 两个并发进程 P1 和 P2 共享了全局变量 $k$，但在访问和修改 $k$ 的过程中，**没有实施互斥 (Mutual Exclusion)**（如未加锁或使用信号量）。
2.  **表现：** 程序的最终结果（print 输出）**高度依赖于 CPU 调度的相对速度和执行时间顺序**。由于进程调度的不可预测性（Nondeterministic），同一个程序在不同时间运行可能得到完全不同的结果，引发了数据不一致性。这违背了程序运行应有的确定性（Determinism）与可再现性（Reproducibility）。