---
title: 环同态基本定理
order: 6
---

# 3.3 同态基本定理 (完整讲义版)

### 1. 环同态的定义与分类

**定义 3.3.1.** 设 $R, S$ 是两个环。如果映射 $\phi: R \to S$ 满足 $\forall a, b \in R$，都有
$$\phi(a+b) = \phi(a) + \phi(b), \quad \phi(ab) = \phi(a)\phi(b).$$
则称 $\phi$ 是一个**环同态**。

在此基础上，我们补充以下具体的同态分类定义（原文省略部分）：

1.  **单同态 (Monomorphism)**: 若 $\phi$ 是单射（即 $\forall a, b \in R$，若 $\phi(a) = \phi(b)$ 则 $a=b$），称 $\phi$ 为单同态。
2.  **满同态 (Epimorphism)**: 若 $\phi$ 是满射（即 $\forall s \in S, \exists r \in R$ 使得 $\phi(r)=s$），称 $\phi$ 为满同态。
3.  **同构 (Isomorphism)**: 若 $\phi$ 既是单射又是满射（即双射），称 $\phi$ 为同构。若 $R, S$ 之间存在同构，记为 $R \cong S$。
4.  **自同态 (Endomorphism)**: 若 $S=R$，即从环 $R$ 到自身的同态，称 $\phi$ 为自同态。所有 $R$ 的自同态构成的集合记为 $\operatorname{End}(R)$。
5.  **自同构 (Automorphism)**: 若 $\phi$ 是 $R$ 到 $R$ 的同构，称 $\phi$ 为自同构。所有 $R$ 的自同构构成的集合记为 $\operatorname{Aut}(R)$（它关于映射复合构成一个群）。

**定义.** 设 $\phi: R \to S$ 是环同态。
* **核 (Kernel)**: $\ker \phi = \{a \in R \mid \phi(a) = 0\}$。
* **像 (Image)**: $\operatorname{Im} \phi = \{\phi(a) \mid a \in R\}$。

---

### 2. 同态的基本性质

**命题 3.3.1.** 设 $\phi: R \to S$ 是一个环同态。
(i) $\ker \phi \lhd R$ (核是 $R$ 的理想), $\operatorname{Im} \phi \le S$ (像是 $S$ 的子环).
(ii) $\phi$ 是单射，当且仅当 $\ker \phi = \{0\}$.

**证明 (补全作业):**

**(i) 证明 $\ker \phi \lhd R$ 和 $\operatorname{Im} \phi \le S$**

* **1. 证明 $\ker \phi$ 是 $R$ 的理想:**
    * **非空性**: 因为 $\phi$ 是加法群同态，故 $\phi(0_R) = 0_S$，所以 $0_R \in \ker \phi$，即 $\ker \phi \neq \emptyset$。
    * **加法封闭性 (对减法封闭)**: $\forall a, b \in \ker \phi$，有 $\phi(a)=0, \phi(b)=0$。
        $$\phi(a-b) = \phi(a) - \phi(b) = 0 - 0 = 0 \implies a-b \in \ker \phi.$$
    * **吸收律**: $\forall a \in \ker \phi$ (即 $\phi(a)=0$), $\forall r \in R$。
        $$\phi(ra) = \phi(r)\phi(a) = \phi(r) \cdot 0 = 0 \implies ra \in \ker \phi.$$
        $$\phi(ar) = \phi(a)\phi(r) = 0 \cdot \phi(r) = 0 \implies ar \in \ker \phi.$$
    综上，$\ker \phi$ 是 $R$ 的理想，即 $\ker \phi \lhd R$。

* **2. 证明 $\operatorname{Im} \phi$ 是 $S$ 的子环:**
    * **减法封闭**: $\forall x, y \in \operatorname{Im} \phi$，存在 $a, b \in R$ 使得 $x=\phi(a), y=\phi(b)$。
        $$x - y = \phi(a) - \phi(b) = \phi(a-b) \in \operatorname{Im} \phi.$$
    * **乘法封闭**:
        $$xy = \phi(a)\phi(b) = \phi(ab) \in \operatorname{Im} \phi.$$
    综上，$\operatorname{Im} \phi$ 是 $S$ 的子环，即 $\operatorname{Im} \phi \le S$。

**(ii) 证明 $\phi$ 是单射 $\iff \ker \phi = \{0\}$**

* ($\Rightarrow$) 设 $\phi$ 是单射。已知 $\phi(0)=0$。若 $a \in \ker \phi$，则 $\phi(a)=0=\phi(0)$。由单射定义知 $a=0$。故 $\ker \phi = \{0\}$。
* ($\Leftarrow$) 设 $\ker \phi = \{0\}$。若 $\forall a, b \in R$ 满足 $\phi(a) = \phi(b)$，则：
    $$\phi(a) - \phi(b) = 0 \implies \phi(a-b) = 0.$$
    这意味着 $a-b \in \ker \phi$。因为 $\ker \phi = \{0\}$，所以 $a-b=0$，即 $a=b$。故 $\phi$ 是单射。 $\square$

**命题 3.3.2.** $\phi: R \to S$ 是一个环同态， $J \lhd S$. 则 $\phi^{-1}(J) = \{a \in R \mid \phi(a) \in J\} \lhd R$.
**证明:** 利用命题 3.2.3, $\forall a, b \in \phi^{-1}(J), r \in R$, 都有
$$\phi(a-b) = \phi(a) - \phi(b) \in J, \quad \phi(ra) = \phi(r)\phi(a) \in J, \quad \phi(ar) = \phi(a)\phi(r) \in J.$$
因此 $\phi^{-1}(J) \lhd R$. $\square$

---

### 3. 环同态定理

**定理 3.3.1 (典范同态).** 设 $I \lhd R$. 则映射 $\pi: R \to R/I$ 定义为 $\pi(r) = r+I$ 是一个环同态，称为典范同态。

**证明 (补全作业):**
我们需要验证 $\pi$ 保持加法和乘法运算。回顾商环 $R/I$ 的运算定义：$(a+I)+(b+I) = (a+b)+I$ 以及 $(a+I)(b+I) = ab+I$。
1.  **保持加法**: $\forall a, b \in R$,
    $$\pi(a+b) = (a+b) + I = (a+I) + (b+I) = \pi(a) + \pi(b).$$
2.  **保持乘法**: $\forall a, b \in R$,
    $$\pi(ab) = ab + I = (a+I)(b+I) = \pi(a)\pi(b).$$
显见 $\pi$ 是满射。故 $\pi$ 是一个满的环同态。 $\square$

**定理 3.3.2 (第零同态定理 / 通用性质).** 设 $I \lhd R$, $\phi: R \to S$ 是环同态，且 $I \le \ker \phi$（即 $I$ 包含在核内）。则存在唯一的环同态 $\bar{\phi}: R/I \to S$, 满足 $\phi = \bar{\phi} \circ \pi$, 其中 $\pi: R \to R/I$ 是典范同态。

**定理 3.3.3 (第一同态定理).** 设 $\phi: R \to S$ 是环同态。则 $R/\ker \phi \cong \operatorname{Im} \phi$.
*(注：这是环论中最核心的定理，它建立了同态像与商环之间的代数同构关系。)*

**推论 3.3.1.**
(i) 如果 $\phi: R \to R$ 是单的环同态。则 $R \cong \operatorname{Im} \phi \le S$.
(ii) 设 $\phi: R \to S$ 是满的环同态。则 $R/\ker \phi \cong S$, 称 $S$ 是 $R$ 的一个同态像。

**定理 3.3.4 (第二同态定理 / 对应定理).** 设 $I \lhd R$. 则 $R/I$ 的子环(理想)与 $R$ 的包含 $I$ 的子环(理想)一一对应。如果 $I \lhd J \lhd R$, 则有 $R/J \cong (R/I)/(J/I)$.

**定理 3.3.5 (第三同态定理).** 设 $I \lhd R, K \le R$. 则 $I+K \le R, I \cap K \lhd K$, 且
$$(I+K)/I \cong K/(I \cap K).$$

**证明 (补全作业):**
此定理描述了子环与理想之和的商结构。证明思路是构造一个从 $K$ 到 $(I+K)/I$ 的满同态，并利用第一同态定理。
1.  **构造映射**: 定义 $\psi: K \to (I+K)/I$，规则为 $\psi(k) = k + I$。
    注意：这里 $k \in K \subseteq I+K$，所以 $k+I$ 确实是商环 $(I+K)/I$ 中的元素。
2.  **验证同态**: $\forall k_1, k_2 \in K$,
    * $\psi(k_1+k_2) = (k_1+k_2)+I = (k_1+I)+(k_2+I) = \psi(k_1)+\psi(k_2)$.
    * $\psi(k_1 k_2) = (k_1 k_2)+I = (k_1+I)(k_2+I) = \psi(k_1)\psi(k_2)$.
    所以 $\psi$ 是环同态。
3.  **验证满射**:
    $(I+K)/I$ 中的任意元素形式为 $(i+k)+I$，其中 $i \in I, k \in K$。
    根据商环陪集的性质，$(i+k)+I = k+(i+I) = k+I$（因为 $i \in I$）。
    即任意元素均可写成 $\psi(k)$ 的形式，故 $\psi$ 是满同态。
4.  **计算核 ($\ker \psi$)**:
    $$\begin{aligned} \ker \psi &= \{k \in K \mid \psi(k) = 0_{(I+K)/I}\} \\ &= \{k \in K \mid k+I = I\} \\ &= \{k \in K \mid k \in I\} \\ &= K \cap I. \end{aligned}$$
5.  **应用第一同态定理**:
    根据定理 3.3.3，对于满同态 $\psi$，有 $K / \ker \psi \cong \operatorname{Im} \psi$。
    即 $K / (I \cap K) \cong (I+K)/I$。 $\square$

---

### 4. 典型例子

**例 3.3.1.**
(i) 典范态射 $\pi: \mathbb{Z} \to \mathbb{Z}_n$ 是一个满的环同态。
(ii) 设 $A \in M(n, \mathbb{R})$ 是可逆矩阵。则 $\phi: M(n, \mathbb{R}) \to M(n, \mathbb{R}), \phi(X) = AXA^{-1}$ 是一个环同构。称为内自同构。
(iii) 设 $R$ 是 $[0, 1]$ 上的连续实函数环， $a \in \mathbb{R}$. $\phi: R \to \mathbb{R}, \phi(f) = f(a)$ 是一个满的环同态。 $\ker \phi = \{f \in R \mid f(a) = 0\} \lhd R$. 特别的， $\forall S \subseteq [0, 1]$,
$$I_S = \{f \in R \mid f(S) = 0\} \lhd R.$$

---

### 5. 理想的互素与积

**定义 3.3.2.** 设 $I, J \lhd R$. 如果 $I+J=R$, 则称 $I, J$ **互素**。

**命题 3.3.3.** 设 $R$ 是幺环, $I, J \lhd R$. 则 $I, J$ 互素，当且仅当存在 $i \in I, j \in J$, 使得 $1 = i+j$.
**证明:**
$\Rightarrow$: 若 $I+J=R$，因为 $R$ 是幺环，$1 \in R = I+J$。故存在 $i \in I, j \in J$ 使得 $1=i+j$。
$\Leftarrow$: 若存在 $i \in I, j \in J$, 使得 $1 = i+j$. 则 $1 \in I+J$. 对于任意 $r \in R$，有 $r = r \cdot 1 \in I+J$（因为 $I+J$ 是理想）。因此 $R \subseteq I+J$，故 $I+J=R$, 即 $I, J$ 互素。 $\square$

**定义 3.3.3.** 由命题 3.2.5 知，两个理想的积也是理想。递归的可以定义有限个理想的积，设 $I_1, \dots, I_k \lhd R$, 定义
$$I_1 \cdots I_k = (I_1 \cdots I_{k-1})I_k.$$
*(注：理想的积 $IJ$ 是由所有形式为 $\sum a_k b_k$ ($a_k \in I, b_k \in J$) 的有限和构成的集合，而不仅仅是元素乘积的集合。)*

**命题 3.3.4.** 设 $R$ 是交换幺环, $I, J \lhd R$. 若 $I, J$ 互素，则 $IJ = I \cap J = JI$.
**证明:**
一方面，显然有 $IJ \subseteq I \cap J$（这是理想积的一般性质）。
反过来，如果 $I, J$ 互素，则 $I+J=R$. 由命题 3.3.3，存在 $i \in I, j \in J$ 使得 $1 = i+j$.
$\forall x \in I \cap J$, 有
$$x = 1 \cdot x = (i+j)x = ix + jx.$$
因为 $x \in J \implies ix \in IJ$ (理想性质)，且 $x \in I \implies jx \in JI = IJ$ (交换环中 $JI=IJ$)。
所以 $x \in IJ + IJ = IJ$。
因此 $I \cap J \subseteq IJ$. 综上 $IJ = I \cap J$。 $\square$

**命题 3.3.5.** 设 $R$ 是幺环, $I_1, \dots, I_k, J \lhd R$. 若 $I_s, J$ 都互素（即对于每个 $s$, $I_s+J=R$），则 $I_1 \cap \dots \cap I_k$ 与 $J$ 也互素。

**证明 (详细展开):**
对 $k$ 用数学归纳法。
* $k=1$ 时，由已知条件显然成立。
* 假设 $k-1$ 时结论成立，即设 $A = I_1 \cap \dots \cap I_{k-1}$，有 $A+J=R$。
* 现在考虑 $k$ 的情况。令 $B = I_k$。已知 $A+J=R$ 且 $B+J=R$。我们只需证明 $(A \cap B) + J = R$。
    
    考察乘积 $(A+J)(B+J)$。
    由于 $R$ 是幺环，
    $$R = R \cdot R = (A+J)(B+J).$$
    展开上式（利用理想加法和乘法的分配律）：
    $$R = AB + AJ + JB + J^2.$$
    分析各项的包含关系：
    1.  $AB \subseteq A \cap B$ (两个理想的积总是包含在交集中)。
    2.  $AJ \subseteq J$ (理想的定义)。
    3.  $JB \subseteq J$。
    4.  $J^2 \subseteq J$。
    
    因此，
    $$R = AB + AJ + JB + J^2 \subseteq (A \cap B) + J + J + J = (A \cap B) + J.$$
    显然 $(A \cap B) + J \subseteq R$。
    故 $(A \cap B) + J = R$。
    即 $I_1 \cap \dots \cap I_k$ 与 $J$ 互素。 $\square$

**推论 3.3.2.** 设 $R$ 是交换幺环, $I_1, \dots, I_k, J \lhd R$. 若 $I_s, J$ 都互素，则 $I_1 \cdots I_k$ 与 $J$ 也互素。
*(注：这是因为在交换幺环中，若 $I_s, J$ 互素，则积 $I_1 \cdots I_k$ 包含了交集 $I_1 \cap \dots \cap I_k$ 与 $J$ 的某种组合关系，或者直接利用命题 3.3.5 证明交集互素后，再利用包含关系 $I_1 \cdots I_k \subseteq I_1 \cap \dots \cap I_k$ 并不足以直接推出互素，这里通常需要重新利用 $(I_1+J)\cdots(I_k+J)$ 的展开式或者利用根理想性质。但在本讲义的逻辑流中，通常是利用 $I_1 \cap \dots \cap I_k \supseteq I_1 \cdots I_k$，如果交集与 J 互素，我们需要更强的条件。**更正**：实际上，推论通常是由命题 3.3.5 结合 $R = \prod (I_s+J) \subseteq \prod I_s + J$ 得到的。即 $R = (I_1+J)\dots(I_k+J) \subseteq I_1\dots I_k + J$, 从而得证。)*