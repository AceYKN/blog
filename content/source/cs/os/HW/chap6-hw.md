---
title: Chap. 6 HW
order: 6
---


# OS Chap.6 HW

## Problem 1
Consider the following snapshot of a system. There are no outstanding unsatisfied requests for resources.

### Resource Data

**Available Resources**
| r1   | r2   | r3   | r4   |
| :--- | :--- | :--- | :--- |
| 2    | 1    | 0    | 0    |

**Process Allocation Table**
| Process | Current Allocation (r1, r2, r3, r4) | Maximum Demand (r1, r2, r3, r4) | Still Needs (r1, r2, r3, r4) |
| :------ | :---------------------------------- | :------------------------------ | :--------------------------- |
| **p1**  | 0, 0, 1, 2                          | 0, 0, 1, 2                      |                              |
| **p2**  | 2, 0, 0, 0                          | 2, 7, 5, 0                      |                              |
| **p3**  | 0, 0, 3, 4                          | 6, 6, 5, 6                      |                              |
| **p4**  | 2, 3, 5, 4                          | 4, 3, 5, 6                      |                              |
| **p5**  | 0, 3, 3, 2                          | 0, 6, 5, 2                      |                              |

### Questions
* **a.** Compute what each process still might request and display in the columns labeled “still needs.”
* **b.** Is this system currently in a safe or unsafe state? Why?
* **c.** Is this system currently deadlocked? Why or why not?
* **d.** Which processes, if any, are or may become deadlocked?
* **e.** If a request from **p3** arrives for (0, 1, 0, 0), can that request be safely granted immediately? In what state (deadlocked, safe, unsafe) would immediately granting that whole request leave the system? Which processes, if any, are or may become deadlocked if this whole request is granted immediately?

---

## Problem 2
Consider a system with a total of **150 units of memory**, allocated to three processes as shown:

| Process | Max Need | Hold |
| :------ | :------- | :--- |
| 1       | 70       | 45   |
| 2       | 60       | 40   |
| 3       | 60       | 15   |

Apply the banker’s algorithm to determine whether it would be safe to grant each of the following requests. If yes, indicate a sequence of terminations that could be guaranteed possible. If no, show the reduction of the resulting allocation table.

* **a.** A fourth process arrives, with a maximum memory need of 60 and an initial need of 25 units.
* **b.** A fourth process arrives, with a maximum memory need of 60 and an initial need of 35 units.

---

## Problem 3
* **a.** Three processes share four resource units that can be reserved and released only one at a time. Each process needs a maximum of two units. Show that a deadlock cannot occur.
* **b.** $N$ processes share $M$ resource units that can be reserved and released only one at a time. The maximum need of each process does not exceed $M$, and the sum of all maximum needs is less than $M + N$. Show that a deadlock cannot occur.

---

## Problem 4
The two variables `a` and `b` have initial values of 1 and 2, respectively. The following code is for a Linux system:

| Thread 1 | Thread 2 |
| :------- | :------- |
| `a = 3;` | —        |
| `mb();`  | —        |
| `b = 4;` | `c = b;` |
| —        | `rmb();` |
| —        | `d = a;` |

**Question:** What possible errors are avoided by the use of the memory barriers?