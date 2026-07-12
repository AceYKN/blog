---
title: Chap. 4 HW
order: 3
---

# OS Chap.4 HW

## Q1. List reasons why a mode switch between threads may be cheaper than a mode switch between processes.\*\*

- **Answer:** Less state information is involved. Thread switching does not require kernel-mode privileges because all of the thread management data structures are within the user address space of a single process. Therefore, the process does not switch to the kernel mode to do thread management, which saves the significant overhead of two mode switches (user to kernel; kernel back to user).

---

## Q2. What are the two separate and potentially independent characteristics embodied in the concept of process?\*\*

- **Answer:** The concept of a process embodies two separate characteristics: **resource ownership** and **scheduling/execution**.

---

## Q3. What resources are typically shared by all of the threads of a process?\*\*

- **Answer:** All of the threads of a process share the state and resources of that process. Examples of typically shared resources include the virtual address space, file resources (such as open files), and execution privileges.

---

## Q4. List three advantages of ULTs over KLTs.\*\*

- **Answer:**
  1. Thread switching does not require kernel-mode privileges because all of the thread management data structures are within the user address space of a single process.
  2. Scheduling can be application specific. The scheduling algorithm can be tailored to the application without disturbing the underlying OS scheduler.
  3. ULTs (User-Level Threads) can run on any operating system. No changes are required to the underlying kernel to support ULTs because the threads library is simply a set of application-level utilities.

---

## Q5. It was pointed out that two advantages of using multiple threads within a process are that (1) less work is involved in creating a new thread within an existing process than in creating a new process, and (2) communication among threads within the same process is simplified. Is it also the case that a mode switch between two threads within the same process involves less work than a mode switch between two threads in different processes?\*\*

- **Answer:** Yes. Switching between two threads in different processes is essentially a process switch. It involves less work to switch between threads in the same process because more state information must be saved and restored to switch from one process to another.

---

## Q6. A multiprocessor with eight processors has 20 attached tape drives. There is a large number of jobs submitted to the system that each require a maximum of four tape drives to complete execution. Assume that each job starts running with only three tape drives for a long period before requiring the fourth tape drive for a short period toward the end of its operation. Also assume an endless supply of such jobs.\*\*

**a. Assume the scheduler in the OS will not start a job unless there are four tape drives available. When a job is started, four drives are assigned immediately and are not released until the job finishes. What is the maximum number of jobs that can be in progress at once? What are the maximum and minimum number of tape drives that may be left idle as a result of this policy?**

- **Answer:** If a conservative policy is used, at most 20/4 = 5 processes can be active simultaneously. Because one of the drives allocated to each process can be idle most of the time, at most 5 drives will be idle at a time (Maximum idle = 5). In the best case, none of the drives will be idle (Minimum idle = 0).

**b. Suggest an alternative policy to improve tape drive utilization and at the same time avoid system deadlock. What is the maximum number of jobs that can be in progress at once? What are the bounds on the number of idling tape drives?**

- **Answer:** To improve drive utilization, an alternative policy is that each process can be initially allocated with exactly three tape drives, and the fourth one will be allocated on demand. In this policy, at most $\lfloor 20/3 \rfloor = 6$ processes can be active simultaneously. The bounds on idling tape drives are a minimum of 0 and a maximum of 2.
