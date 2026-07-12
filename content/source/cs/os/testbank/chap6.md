---
title: Chap. 6
order: 6
---

# Chapter 6 – Concurrency: Deadlock and Starvation


## 一、 True / False Questions (是非題)

**1. Deadlock can be defined as the periodic blocking of a set of processes that either compete for system resources or communicate with each other.**
*   **中文翻譯**：死結可以定義為一組競爭系統資源或相互通訊的進程的週期性阻塞。
*   **答案**：False
*   **Concept Check**：死結 (Deadlock) 的定義。
*   **The 'Why'**：死結是指進程陷入了「永久性 (permanent)」的阻塞。如果沒有作業系統的強制介入，這些進程永遠無法繼續執行，因此絕對不是可以自行恢復的「週期性 (periodic)」現象。
*   **Common Pitfalls**：學生常因前半段定義正確而忽略了「periodic」這個形容詞。

**2. All deadlocks involve conflicting needs for resources by two or more processes.**
*   **中文翻譯**：所有死結都涉及兩個或多個進程對資源的衝突需求。
*   **答案**：True
*   **Concept Check**：產生死結的參與者條件。
*   **The 'Why'**：死結的本質是互相等待（形成循環），因此在邏輯上至少需要兩個或兩個以上的進程互相持有對方需要的資源才能構成死結。

**3. A reusable resource is one that can be safely used by only one process at a time and is not depleted by that use.**
*   **中文翻譯**：可重用資源是指一次只能由一個進程安全使用，且不會因該使用而被耗盡的資源。
*   **答案**：True
*   **Concept Check**：可重用資源 (Reusable Resource) 的定義。
*   **The 'Why'**：這正是可重用資源的標準定義（例如處理器、記憶體、I/O 設備）。它們在使用後會被歸還給系統，供其他進程再次使用，不會消失。

**4. A consumable resource is one that can be safely used by only one process at a time and is not depleted by that use.**
*   **中文翻譯**：可消耗資源是指一次只能由一個進程安全使用，且不會因該使用而被耗盡的資源。
*   **答案**：False
*   **Concept Check**：可消耗資源 (Consumable Resource) 的定義。
*   **The 'Why'**：題目描述的是可重用資源。可消耗資源（如訊息、中斷、信號）一旦被獲取（接收），就會「被耗盡 / 銷毀 (depleted / destroyed)」，不再存在於系統中。
*   **Common Pitfalls**：搞混 Reusable 和 Consumable 的特性。Consumable 是一次性的。

**5. Although deadlock can potentially exist without it, the condition known as Circular Wait is required for deadlock to actually take place.**
*   **中文翻譯**：儘管沒有循環等待（Circular Wait）也可能潛在地存在死結的風險，但要讓死結實際發生，循環等待條件是必須的。
*   **答案**：True
*   **Concept Check**：死結的四個必要條件與充分條件。
*   **The 'Why'**：前三個條件（互斥、佔有且等待、不可剝奪）是死結的「必要條件」，它們構成了潛在的死結風險（致命區域）；但只有當第四個條件「循環等待」實際發生時，死結才真正形成（充分條件）。

**6. The strategy of deadlock prevention is to design a system in such a way that the possibility of deadlock is minimized.**
*   **中文翻譯**：死結預防的策略是設計一個系統，使得死結的可能性降到最低。
*   **答案**：False
*   **Concept Check**：死結預防 (Deadlock Prevention) 的嚴格性。
*   **The 'Why'**：死結預防的目標不是「最小化 (minimized)」，而是「完全排除 (excluded)」。它透過嚴格破壞四個必要條件之一，確保死結「絕對不可能」發生。

**7. The Deadlock Avoidance approach to solving the deadlock problem allows the three necessary conditions for deadlocks to exist.**
*   **中文翻譯**：用於解決死結問題的「死結避免」方法允許死結存在的三個必要條件。
*   **答案**：True
*   **Concept Check**：死結避免 (Deadlock Avoidance) 的特徵。
*   **The 'Why'**：與死結預防不同，死結避免允許前三個條件（互斥、佔有且等待、不剝奪）存在以提高資源利用率，但它會在每次分配資源前動態檢查，透過演算法確保系統永遠不會進入導致循環等待的不安全狀態。

**8. In the Resource Allocation Denial approach to Deadlock Avoidance, a safe state is defined as one in which all potential process sequences do not result in a deadlock.**
*   **中文翻譯**：在死結避免的資源分配拒絕方法（銀行家演算法）中，安全狀態被定義為：所有潛在的進程執行序列都不會導致死結。
*   **答案**：False
*   **Concept Check**：安全狀態 (Safe State) 的定義。
*   **The 'Why'**：安全狀態的定義是「存在『至少一個 (at least one)』執行序列不會導致死結」，而不是「所有 (all)」。只要系統能找到一條安全出路，它就是安全的。
*   **Common Pitfalls**：學生常誤以為安全狀態代表隨便怎麼執行都安全。實際上只要有一條解法即可。

**9. Deadlock Detection strategies do not limit resource access or restrict process actions.**
*   **中文翻譯**：死結偵測策略不限制資源存取或約束進程行為。
*   **答案**：True
*   **Concept Check**：死結偵測 (Deadlock Detection) 的哲學。
*   **The 'Why'**：死結偵測是一種極度寬鬆的策略（Very liberal）。只要資源夠，系統就立刻分配，不加任何限制，然後只是定期檢查是否發生了死結。

**10. One of the most common approaches for recovery from deadlocked processes is to abort all deadlocked processes.**
*   **中文翻譯**：從死結進程中恢復的最常見方法之一是中止所有死結的進程。
*   **答案**：True
*   **Concept Check**：死結恢復 (Recovery) 策略。
*   **The 'Why'**：雖然聽起來很粗暴，但「中止所有死結進程 (Abort all deadlocked processes)」確實是現實作業系統中最常用、最容易實作的死結恢復方案。

**11. Although each strategy that deals with deadlocks has its advantages and disadvantages, the best solution to the problem is to choose one and stick with it.**
*   **中文翻譯**：儘管處理死結的每種策略都有其優缺點，但解決該問題的最佳方法是選擇其中一種並堅持使用。
*   **答案**：False
*   **Concept Check**：綜合死結策略 (Integrated Deadlock Strategy)。
*   **The 'Why'**：沒有任何單一策略是完美的。最佳的實務做法是「綜合策略 (Integrated Strategy)」，將系統資源分類（如記憶體、I/O設備等），然後針對不同類別的資源特性，混合使用預防、避免和偵測。

**12. The Dining Philosopher’s Problem illustrates basic problems in deadlock and starvation.**
*   **中文翻譯**：哲學家就餐問題說明了死結和飢餓的基本問題。
*   **答案**：True
*   **Concept Check**：哲學家就餐問題的目的。
*   **The 'Why'**：如果所有哲學家同時拿起左手叉子會發生死結；如果不停放下再拿起，則可能導致沒有人能吃到飯的飢餓（活鎖）。它是測試這些併發問題的標準模型。

**13. A pipe in UNIX is a circular buffer that allows two processes to communicate on the producer-consumer model.**
*   **中文翻譯**：UNIX 中的管道 (pipe) 是一個循環緩衝區，允許兩個進程以生產者-消費者模型進行通訊。
*   **答案**：True
*   **Concept Check**：UNIX 並發機制的 Pipe。
*   **The 'Why'**：UNIX 管道的本質就是實作了生產者（寫入端）與消費者（讀取端）模型的先進先出 (FIFO) 循環緩衝區。

**14. One thread synchronization primitive supported by Solaris is the Mutual Exclusion (mutex) lock.**
*   **中文翻譯**：Solaris 支援的一種執行緒同步原語是互斥 (mutex) 鎖。
*   **答案**：True
*   **Concept Check**：Solaris 的同步機制。
*   **The 'Why'**：Solaris 作業系統提供了多種同步原語，其中最基礎的就是互斥鎖 (mutex locks)。

**15. Each synchronization object in a W2K system can either be in a signaled or signaling state.**
*   **中文翻譯**：W2K (Windows 2000) 系統中的每個同步物件可以處於「發信號的 (signaled)」或「發信號中 (signaling)」狀態。
*   **答案**：False
*   **Concept Check**：Windows 分派器物件 (Dispatcher Objects) 的狀態。
*   **The 'Why'**：Windows 同步物件的兩種狀態是「發信號的 (signaled)」與「未發信號的 (nonsignaled)」，並沒有所謂的 signaling state。
*   **Common Pitfalls**：專有名詞陷阱。記住是 Signaled vs Nonsignaled。

---

## 二、 Multiple Choice Questions (選擇題)

**1. The permanent blocking of a set of processes that either compete for system resources or communicate with each other is called:**
a. Starvation  b. Deadlock  c. Prioritization  d. All of the above
*   **中文翻譯**：一組競爭系統資源或相互通訊的進程發生永久阻塞被稱為：a. 飢餓  b. 死結  c. 優先級化  d. 以上皆是
*   **答案**：b
*   **The 'Why'**：這是死結 (Deadlock) 的標準定義。

**2. All deadlocks involve conflicting needs for resources by:**
a. One or more processes  b. Two or more processes  c. Three or more processes  d. None of the above
*   **中文翻譯**：所有死結都涉及多少進程對資源的衝突需求：
*   **答案**：b
*   **The 'Why'**：死結必須形成循環等待，至少需要兩個或兩個以上的進程互相牽制。

**3. A resource that can be created and destroyed is called a:**
a. Reusable resource  b. Producible resource  c. Consumable resource  d. All of the above
*   **中文翻譯**：可以被創建和銷毀的資源被稱為：
*   **答案**：c
*   **The 'Why'**：一旦被獲取就會消失的資源，在 OS 術語中稱為「可消耗資源 (Consumable resource)」。

**4. An example of a consumable resource is the following:**
a. Messages  b. Printers  c. Main Memory  d. All of the above
*   **中文翻譯**：以下哪一項是可消耗資源的例子：
*   **答案**：a
*   **The 'Why'**：印表機和主記憶體用完要歸還，是可重用的。訊息 (Messages) 接收後就被消耗了。

**5. A condition of policy that must be present for a deadlock to be possible is:**
a. Mutual exclusion  b. Hold and wait  c. No preemption  d. All of the above
*   **中文翻譯**：要讓死結成為可能，必須存在哪種策略條件：
*   **答案**：d
*   **The 'Why'**：產生死結的前三個必要條件（政策條件）就是互斥、佔有且等待、不剝奪。

**6. A direct method of deadlock prevention is to prevent the occurrence of:**
a. Mutual exclusion  b. Hold and wait  c. Circular wait  d. All of the above
*   **中文翻譯**：死結預防的「直接」方法是防止發生：
*   **答案**：c
*   **The 'Why'**：破壞前三個條件被稱為「間接方法 (indirect method)」。破壞第四個條件（循環等待）被稱為「直接方法 (direct method)」。這是一個容易忽略的分類細節。

**7. One approach to deadlock avoidance is called:**
a. Process Termination Denial  b. Resource Allocation Denial  c. Hold and wait  d. None of the above
*   **中文翻譯**：一種死結避免的方法被稱為：
*   **答案**：b
*   **The 'Why'**：死結避免有兩種主要方法：進程啟動拒絕 (Process Initiation Denial) 與資源分配拒絕 (Resource Allocation Denial，即銀行家演算法)。

**8. In the Resource Allocation Denial approach to Deadlock Avoidance, a safe state is defined as one in which:**
a. At least one potential process sequence does not result in a deadlock
b. All potential process sequences do not result in a deadlock
c. Several potential process sequences do not result in a deadlock
d. None of the above
*   **中文翻譯**：在死結避免的資源分配拒絕方法中，安全狀態定義為：
*   **答案**：a
*   **The 'Why'**：安全狀態只要能找到「至少一條 (at least one)」讓所有進程順利完成的序列即可。

**9. A conservative strategy for dealing with deadlocks that involves limiting access to resources and imposing restrictions on processes is called:**
a. Deadlock Prevention  b. Deadlock Avoidance  c. Deadlock Detection  d. None of the above
*   **中文翻譯**：一種處理死結的保守策略，涉及限制資源存取和對進程施加限制，被稱為：
*   **答案**：a
*   **The 'Why'**：預防 (Prevention) 是最保守的策略，透過直接或間接破壞必要條件來限制進程。

**10. In deadlocked process recovery, selection criteria for choosing a particular process to abort or rollback includes designating the process with the:**
a. Most estimated time remaining  b. Lowest priority  c. Least total resources allocated so far  d. All of the above
*   **中文翻譯**：在死結進程恢復中，選擇中止或回滾特定進程的標準包含指定具有下列特徵的進程：
*   **答案**：d
*   **The 'Why'**：為了將恢復成本降到最低，OS 會選擇：剩餘時間最多的（剛開始執行的）、優先級最低的、或已經分配到資源最少的進程作為犧牲品。

**11. One approach to an integrated strategy for dealing with deadlocks involves the implementation of:**
a. Resource classes  b. Process rollbacks  c. Virtual memory  d. None of the above
*   **中文翻譯**：處理死結的綜合策略之一涉及實作：
*   **答案**：a
*   **The 'Why'**：綜合策略 (Integrated Strategy) 的核心是將資源劃分為不同的「資源類別 (Resource classes)」，並針對每類資源採用不同的死結處理方法。

**12. The Dining Philosopher’s Problem is a standard test case for evaluating approaches to implementing:**
a. Deadlock  b. Starvation  c. Synchronization  d. All of the above
*   **中文翻譯**：哲學家就餐問題是評估實作什麼方法的標準測試案例：
*   **答案**：c (依據 Stallings 課本上下文，雖然它展示死結與飢餓問題，但它主要是作為評估**同步 (Synchronization)** 機制設計是否良好的標準測試案例。)

**13. A software mechanism that informs a process of the occurrences of asynchronous events in UNIX are called:**
a. Pipes  b. Messages  c. Signals  d. All of the above
*   **中文翻譯**：UNIX 中通知進程發生非同步事件的軟體機制被稱為：
*   **答案**：c
*   **The 'Why'**：信號 (Signals) 是 UNIX 用來處理非同步事件（如按下 Ctrl+C、除以零）的軟體中斷機制。

**14. Thread synchronization primitives supported by Solaris include:**
a. Mutual exclusion (mutex) locks  b. Semaphores  c. Condition variables  d. All of the above
*   **中文翻譯**：Solaris 支援的執行緒同步原語包含：
*   **答案**：d
*   **The 'Why'**：Solaris 提供全面的同步工具，包含互斥鎖、信號量、讀寫鎖以及條件變數等。

**15. The family of synchronization objects implemented by W2K include:**
a. Mutex objects  b. Semaphore objects  c. Event objects  d. All of the above
*   **中文翻譯**：W2K 實作的同步物件系列包含：
*   **答案**：d
*   **The 'Why'**：Windows (W2K) 提供了多種分派器物件用於同步，包含 Mutex、Semaphore、Event、Timer 等。

---

## 三、 Fill-In-The-Blank Questions (填充題)

**1. The permanent blocking of a set of processes that either compete for system resources or communicate with each other is called _________.**
*   **中文翻譯**：一組競爭系統資源或互相通訊的進程發生的永久性阻塞稱為________。
*   **答案**：deadlock (死結)

**2. All deadlocks involve conflicting needs for resources by _________ or more processes.**
*   **中文翻譯**：所有死結都涉及________個或多個進程對資源的衝突需求。
*   **答案**：two (兩個)

**3. A resource that can be created (produced) and destroyed (consumed) is called a _________ resource.**
*   **中文翻譯**：可以被創建（生產）和銷毀（消耗）的資源被稱為________資源。
*   **答案**：consumable (可消耗)

**4. An example of a reusable resource is a _______________.**
*   **中文翻譯**：可重用資源的一個例子是_______________。
*   **答案**：processor / main memory / I/O channel / printer (處理器/主記憶體/磁碟等皆可)

**5. The ___________________ policy condition, which says a process may hold allocated resources while awaiting assignment of others, must be present for a deadlock to be possible.**
*   **中文翻譯**：___________________策略條件，指的是進程可以持有已分配的資源同時等待分配其他資源，這必須存在才能使死結成為可能。
*   **答案**：hold and wait (佔有且等待)

**6. A(n) _____________ method of deadlock prevention is to prevent the occurrence of one of the three necessary conditions for deadlock.**
*   **中文翻譯**：一種死結預防的_____________方法是防止死結的三個必要條件之一發生。
*   **答案**：indirect (間接)
*   **The 'Why'**：預防前三個條件屬於間接方法；預防循環等待則屬於直接方法。

**7. In Deadlock Avoidance, the Resource Allocation Denial strategy is also referred to as the  _______________.**
*   **中文翻譯**：在死結避免中，資源分配拒絕策略也被稱為_______________。
*   **答案**：banker's algorithm (銀行家演算法)

**8. A(n) _________________ state is one in which every potential sequence of allocation of resources to processes results in a deadlock.**
*   **中文翻譯**：一個_________________狀態是指資源分配給進程的每一個潛在序列都會導致死結的狀態。
*   **答案**：unsafe (不安全) 或 fatal (致命)
*   **The 'Why'**：如果在該狀態下找不到任何一條可以避免死結的執行序列，該狀態即定義為不安全狀態 (Unsafe State)。

**9. In Deadlock Detection, the O/S periodically performs an algorithm that allows it to detect the ________________ condition.**
*   **中文翻譯**：在死結偵測中，作業系統定期執行一種演算法，使其能夠偵測________________條件。
*   **答案**：circular wait (循環等待)
*   **The 'Why'**：死結偵測演算法的核心任務，就是去資源分配圖中尋找是否存在構成環路的「循環等待」。

**10. Once a deadlock has been detected, some strategy is needed for ___________.**
*   **中文翻譯**：一旦偵測到死結，就需要某種策略來進行___________。
*   **答案**：recovery (恢復)

**11. One approach to an integrated strategy for dealing with deadlocks involves the implementation of __________________.**
*   **中文翻譯**：處理死結的綜合策略的一種方法涉及實作__________________。
*   **答案**：resource classes (資源類別)
*   **The 'Why'**：將資源依照分配層次分門別類，各個擊破。

**12. The Dining Philosopher’s Problem illustrates basic problems in __________________ and __________________.**
*   **中文翻譯**：哲學家就餐問題說明了__________________和__________________的基本問題。
*   **答案**：deadlock (死結), starvation (飢餓)

**13. The type of UNIX pipe that can be shared by unrelated processes is called a(n) __________________ pipe.**
*   **中文翻譯**：可以由不相關進程共享的 UNIX 管道類型被稱為__________________管道。
*   **答案**：named (命名) 或 FIFO
*   **The 'Why'**：一般的匿名管道只能用於有血緣關係的父子進程；具名管道 (Named Pipe) 在系統中有對應名稱，因此任意進程皆可存取。