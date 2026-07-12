---
title: 子环、理想与商环 习题详解
order: 5
---

### **题目 1：生成理想的定义**

**题目：** 设 $S$ 为 $R$ 的子环。证明：$\langle S \rangle = \bigcap \{ I \mid S \subseteq I, \ I \trianglelefteq R \}$

**【深度解析】**

* **直观理解**：
    * $\langle S \rangle$ 的定义通常是“包含 $S$ 的**最小**的理想”。
    * 右边的 $\bigcap \{...\}$ 是“所有包含 $S$ 的理想的**交集**”。
    * 这个题目其实是在说：**“最小” = “所有大个头的交集”**。这就好比说，“全班身高不低于170cm的人里最矮的那个” 等于 “所有身高不低于170cm的人的身高下界”。

* **证明策略**：
    要证明集合 $A = B$，标准套路是证明“双向包含”：
    1.  $A \subseteq B$
    2.  $B \subseteq A$

**【详细证明】**

记 $\mathcal{K} = \{ I \mid S \subseteq I, \ I \trianglelefteq R \}$ 为所有包含 $S$ 的理想的集合。
我们要证：$\langle S \rangle = \bigcap_{I \in \mathcal{K}} I$。

**步骤 1：证明 $\bigcap_{I \in \mathcal{K}} I \subseteq \langle S \rangle$**
1.  根据定义，$\langle S \rangle$ 是包含 $S$ 的**最小**理想。
2.  既然 $\langle S \rangle$ 是一个包含 $S$ 的理想，那么 $\langle S \rangle$ 自己也是集合 $\mathcal{K}$ 中的一员（即 $\langle S \rangle \in \mathcal{K}$）。
3.  交集 $\bigcap_{I \in \mathcal{K}} I$ 的含义是：它是所有 $\mathcal{K}$ 中成员的公共部分。
4.  因此，交集必然包含在 $\mathcal{K}$ 的每一个成员里，当然也包含在 $\langle S \rangle$ 里。
5.  所以：$\bigcap_{I \in \mathcal{K}} I \subseteq \langle S \rangle$。

**步骤 2：证明 $\langle S \rangle \subseteq \bigcap_{I \in \mathcal{K}} I$**
1.  我们知道，任意多个理想的交集仍然是一个理想（这是上一节课作业里的结论，稍后我们在题目2中会细证）。所以 $\bigcap_{I \in \mathcal{K}} I$ 是一个理想。
2.  因为 $\mathcal{K}$ 中每一个理想都包含 $S$，所以它们的交集也一定包含 $S$。
    即：$S \subseteq \bigcap_{I \in \mathcal{K}} I$。
3.  现在回顾 $\langle S \rangle$ 的定义：它是包含 $S$ 的**最小**理想。
4.  “最小”的意思是：任何包含 $S$ 的理想，都必须把 $\langle S \rangle$ 包在里面。
5.  既然 $\bigcap_{I \in \mathcal{K}} I$ 是一个包含 $S$ 的理想，那么它必然包含“最小”的那个 $\langle S \rangle$。
6.  所以：$\langle S \rangle \subseteq \bigcap_{I \in \mathcal{K}} I$。

**结论：** 综上所述，$\langle S \rangle = \bigcap \{ I \mid S \subseteq I, \ I \trianglelefteq R \}$。 $\square$

---

### **题目 2：理想的运算封闭性**

**题目：** 设 $I, J \trianglelefteq R$（即 $I, J$ 是 $R$ 的理想）。证明：
(i) $I+J \trianglelefteq R$
(ii) $I \cap J \trianglelefteq R$

**【深度解析】**

* **判定理想的万能公式（Ideal Test）**：
    要证明一个非空子集 $K$ 是理想，只需验证两点：
    1.  **减法封闭**：若 $x, y \in K$，则 $x - y \in K$。（这说明它是加法子群）
    2.  **吸收律（最关键）**：若 $x \in K, r \in R$，则 $rx \in K$ 且 $xr \in K$。

**【详细证明】**

**(i) 证明 $I+J$ 是理想**

定义：$I+J = \{ a+b \mid a \in I, b \in J \}$。

1.  **非空性**：
    $0 \in I, 0 \in J \implies 0 = 0+0 \in I+J$。

2.  **减法封闭**：
    设 $x, y \in I+J$。
    这意味着 $x = a_1 + b_1$， $y = a_2 + b_2$，其中 $a_1, a_2 \in I$，$b_1, b_2 \in J$。
    $$x - y = (a_1 + b_1) - (a_2 + b_2) = (a_1 - a_2) + (b_1 - b_2)$$
    * 因为 $I$ 是理想（子群），所以 $a_1 - a_2 \in I$。
    * 因为 $J$ 是理想（子群），所以 $b_1 - b_2 \in J$。
    * 所以结果是“$I$ 中元素 + $J$ 中元素”的形式，故 $x - y \in I+J$。

3.  **吸收律**：
    设 $x \in I+J$，即 $x = a + b$ ($a \in I, b \in J$)。设 $r \in R$。
    $$rx = r(a + b) = ra + rb$$
    * 因为 $I$ 是理想，$a \in I \implies ra \in I$（左吸收）。
    * 因为 $J$ 是理想，$b \in J \implies rb \in J$（左吸收）。
    * 所以 $rx \in I+J$。
    * 同理可证 $xr = ar + br \in I+J$（右吸收）。

**结论**：$I+J \trianglelefteq R$。

**(ii) 证明 $I \cap J$ 是理想**

1.  **减法封闭**：
    设 $x, y \in I \cap J$。这意味着 $x \in I$ 且 $x \in J$，同理 $y \in I$ 且 $y \in J$。
    * 因为 $x, y \in I$ 且 $I$ 是理想，所以 $x - y \in I$。
    * 因为 $x, y \in J$ 且 $J$ 是理想，所以 $x - y \in J$。
    * 既然既在 $I$ 又在 $J$，所以 $x - y \in I \cap J$。

2.  **吸收律**：
    设 $x \in I \cap J$，$r \in R$。
    * $x \in I \implies rx \in I$ （$I$ 的吸收律）。
    * $x \in J \implies rx \in J$ （$J$ 的吸收律）。
    * 所以 $rx \in I \cap J$。右乘 $xr$ 同理。

**结论**：$I \cap J \trianglelefteq R$。 $\square$

---

### **题目 3：商环结构的严谨验证**

**题目：** 在 $R/I$ 上定义 $(a+I)(b+I) = ab+I$。证明 $(R/I, +, \cdot)$ 是环。

**【深度解析】**

这是最繁琐但也最重要的一题。
* **良定义（Well-defined）**：这是初学者最容易晕的地方。因为 $R/I$ 中的元素是**集合**（陪集）。比如在整数模6中， $2+6\mathbb{Z}$ 和 $8+6\mathbb{Z}$ 是**同一个**元素。我们用 $2$ 去乘，或者用 $8$ 去乘，结果必须一样，否则这个运算就是瞎胡闹。

**【详细证明】**

**(i) 乘法是良定义的 (Well-defined)**

* **目标**：如果我们换了代表元，乘积出来的陪集不变。
* **假设**：设 $a+I = a'+I$ 且 $b+I = b'+I$。
    这等价于 $a' = a + x$，$b' = b + y$，其中 $x, y \in I$。
* **计算新代表元的乘积**：
    $$a'b' = (a+x)(b+y) = ab + ay + xb + xy$$
* **分析各项**：
    * $ab$：这是原来的乘积。
    * $ay$：因为 $y \in I$ 且 $I$ 是**左理想**，所以 $ay \in I$。
    * $xb$：因为 $x \in I$ 且 $I$ 是**右理想**，所以 $xb \in I$。
    * $xy$：因为 $x, y \in I$ 且 $I$ 是子环，所以 $xy \in I$。
* **归纳**：
    $a'b' = ab + (\text{一堆属于 } I \text{ 的东西})$
    即 $a'b' - ab \in I$。
* **结论**：
    $a'b' + I = ab + I$。乘法与代表元选取无关，是良定义的。

**(ii) $(R/I, +)$ 是阿贝尔群**

这直接继承自商群的性质（回顾群论：$I$ 是 $R$ 的加法正规子群）：
1.  **加法封闭**：定义本身保证。
2.  **加法结合律**：$((a+I)+(b+I))+(c+I) = (a+b+c)+I = (a+I)+((b+I)+(c+I))$。
3.  **零元**：$0+I$（即 $I$ 本身）是单位元。
4.  **逆元**：$(a+I)$ 的逆元是 $(-a)+I$。
5.  **交换律**：$(a+I)+(b+I) = (a+b)+I = (b+a)+I = (b+I)+(a+I)$（因为 $R$ 的加法交换）。

**(iii) $(R/I, \cdot)$ 是半群**

“半群”的意思就是：运算封闭且满足**结合律**。
我们需要证明乘法结合律：
设 $A = a+I, B = b+I, C = c+I$。
$$(A \cdot B) \cdot C = (ab+I)(c+I) = (ab)c + I$$
$$A \cdot (B \cdot C) = (a+I)(bc+I) = a(bc) + I$$
由于原环 $R$ 满足结合律 $(ab)c = a(bc)$，所以这两个陪集相等。

**(iv) 满足分配律**

我们要证左分配律：$A(B+C) = AB + AC$。
$$(a+I)((b+I) + (c+I)) = (a+I)((b+c)+I)$$
根据乘法定义：
$$= a(b+c) + I$$
利用 $R$ 中的分配律 $a(b+c) = ab+ac$：
$$= (ab+ac) + I$$
根据商环加法定义拆开：
$$= (ab+I) + (ac+I) = (a+I)(b+I) + (a+I)(c+I)$$
右分配律同理。

**总结**：满足所有条件，$(R/I, +, \cdot)$ 确实是一个环。 $\square$

---

### **题目 4：商环的性质继承**

**题目：** 设 $I \trianglelefteq R$。证明：
(i) 若 $R$ 是交换环，则 $R/I$ 也是。
(ii) 若 $I \neq R$，则 $1 + I$ 是 $R/I$ 的单位元。

**【深度解析】**

这是在说：大环有的好性质，商环通常也能继承下来。

**【详细证明】**

**(i) 交换性**

* **前提**：$R$ 是交换环，即对任意 $a, b \in R$，有 $ab = ba$。
* **要证**：对任意 $X, Y \in R/I$，有 $XY = YX$。
* **证明**：
    设 $X = a+I, Y = b+I$。
    $$X \cdot Y = (a+I)(b+I) = ab + I$$
    $$Y \cdot X = (b+I)(a+I) = ba + I$$
    因为在 $R$ 中 $ab = ba$，所以 $ab+I = ba+I$。
    即 $XY = YX$。
    所以 $R/I$ 是交换环。

**(ii) 单位元**

* **前提**：$R$ 有单位元 $1$（假设 $R$ 是幺环），且 $I \neq R$（这保证了 $1 \notin I$，即 $1+I \neq 0+I$，商环不是零环）。
* **要证**：$1+I$ 在乘法下起作用。
* **证明**：
    对任意 $X = a+I \in R/I$：
    $$(1+I)(a+I) = (1 \cdot a) + I = a + I = X$$
    $$(a+I)(1+I) = (a \cdot 1) + I = a + I = X$$
    因为左乘和右乘都等于它自己，所以 $1+I$ 是 $R/I$ 的乘法单位元。 $\square$

---

### 题目 8：构造反例与特例
**8. 给出环 $R$ 和它的子环 $S$ 的例子，使得它们满足以下条件之一：**
(1) $R$ 有1，但 $S$ 没有1；
(2) $R$ 没有1，但 $S$ 有1；
(3) $R$ 与 $S$ 都有1；
(4) $R$ 不交换，但 $S$ 交换。

#### 【深度解析与解答】
这道题的目的是打破你的思维定势。在群论中，子群的单位元必须和群的一样。但在环论中，**子环的单位元（1）是非常“任性”的**。

**解答 (1): $R$ 有1，但 $S$ 没有1**
这是最常见的情况。
*  **例子**：
    *  令 $R = \mathbb{Z}$ （整数环）。$1_R = 1$。
    *  令 $S = 2\mathbb{Z}$ （偶数环）。
*  **验证**：
    *  $\mathbb{Z}$ 有单位元 1。
    *  $2\mathbb{Z}$ 是子环（封闭性满足），但在 $2\mathbb{Z}$ 中找不到一个元素 $e$，使得对所有偶数 $a$ 都有 $e \cdot a = a$。所以 $S$ 没有单位元。

**解答 (2): $R$ 没有1，但 $S$ 有1**
这种情况比较反直觉。通常我们需要利用“直积”来构造这种“局部有1，整体无1”的结构。
*  **例子**：
    *  令 $R = \mathbb{Z} \oplus 2\mathbb{Z}$ （直积环）。
        *  元素形式为 $(a, 2b)$。
        *  加法、乘法都是分量运算。
    *  令 $S = \mathbb{Z} \oplus \{0\} = \{ (a, 0) \mid a \in \mathbb{Z} \}$。
*  **验证**：
    *  **$R$ 没有 1**：假设 $R$ 有单位元 $(x, y)$，那么对于元素 $(1, 2)$，必须有 $(x, y)(1, 2) = (1, 2)$。这意味着 $y \cdot 2 = 2$ 在 $2\mathbb{Z}$ 中成立，但在偶数环中不存在这样的 $y$。所以 $R$ 无单位元。
    *  **$S$ 有 1**：$S$ 中的元素形如 $(a, 0)$。取 $e = (1, 0)$。
        $$(1, 0) \cdot (a, 0) = (1\cdot a, 0\cdot 0) = (a, 0)$$
        所以 $(1, 0)$ 是子环 $S$ 的单位元。

**解答 (3): $R$ 与 $S$ 都有1**
这里可以分为两种情况：它们的 1 是同一个，或者它们的 1 不是同一个。题目没要求，我们可以给一个更有趣的（1 不相同）例子。
*  **例子**：
    *  令 $R = \mathbb{Z} \oplus \mathbb{Z}$。$1_R = (1, 1)$。
    *  令 $S = \mathbb{Z} \oplus \{0\}$。
*  **验证**：
    *  $S$ 是 $R$ 的子环。
    *  $S$ 的单位元是 $(1, 0)$。
    *  $R$ 的单位元是 $(1, 1)$。
    *  两者都有 1，尽管 $1_S \neq 1_R$。
    *  *(当然，最简单的例子是 $R=\mathbb{Q}, S=\mathbb{Z}$，此时 $1_R = 1_S = 1$。)*

**解答 (4): $R$ 不交换，但 $S$ 交换**
这就好比在一个喧闹的市场（不交换）里找一个安静的房间（交换）。矩阵环是最好的例子。
*  **例子**：
    *  令 $R = M_2(\mathbb{R})$ （$2 \times 2$ 实矩阵环）。矩阵乘法不满足交换律。
    *  令 $S$ 为所有对角矩阵的集合：
        $$S = \left\{ \begin{pmatrix} a & 0 \\ 0 & b \end{pmatrix} \;\middle|\; a, b \in \mathbb{R} \right\}$$
*  **验证**：
    *  对角矩阵相乘：
        $$\begin{pmatrix} a & 0 \\ 0 & b \end{pmatrix} \begin{pmatrix} c & 0 \\ 0 & d \end{pmatrix} = \begin{pmatrix} ac & 0 \\ 0 & bd \end{pmatrix} = \begin{pmatrix} c & 0 \\ 0 & d \end{pmatrix} \begin{pmatrix} a & 0 \\ 0 & b \end{pmatrix}$$
    *  所以 $S$ 是交换环，尽管 $R$ 不是。

---

### 题目 14：幂零根是理想
**14. 证明：在交换环 $R$ 中全体幂零元组成一个理想（称为 $R$ 的幂零根或小根）。**

#### 【深度解析】
*  **定义**：元素 $x$ 是幂零元，如果存在正整数 $n$ 使得 $x^n = 0$。
*  **关键点**：题目强调了 **$R$ 是交换环**。这是证明的关键！如果不交换，$(xy)^n \neq x^n y^n$，结论就不一定成立。
*  **思路**：利用二项式定理来处理和的幂。

#### 【严谨证明】
设 $N$ 为 $R$ 中全体幂零元的集合，即 $N = \{ x \in R \mid \exists n \in \mathbb{Z}^+, x^n = 0 \}$。
我们要证明 $N$ 是一个理想。

1.  **非空性**
因为 $0^1 = 0$，所以 $0 \in N$。$N$ 非空。

2.  **对减法封闭 (实际上是对加法/减法封闭)**
设 $x, y \in N$。
这意味着存在正整数 $n, m$ 使得 $x^n = 0$ 且 $y^m = 0$。
我们需要证明 $x - y$ 也是幂零元。考察 $(x - y)$ 的足够大次幂。
令 $k = n + m$。由于 $R$ 是**交换环**，我们可以使用**二项式定理**：
$$(x - y)^k = \sum_{i=0}^{k} \binom{k}{i} x^i (-y)^{k-i}$$
对于求和中的每一项 $\binom{k}{i} x^i (-y)^{k-i}$：
*   如果 $i \ge n$，则 $x^i = x^n \cdot x^{i-n} = 0 \cdot x^{i-n} = 0$。这一项为 0。
*   如果 $i < n$，则 $k - i = (n + m) - i > (n + m) - n = m$。即 $k - i \ge m$。
    此时 $(-y)^{k-i} = \pm y^{k-i} = \pm y^m \cdot y^{k-i-m} = 0$。这一项也为 0。

因此，展开式中每一项都是 0，所以 $(x - y)^{n+m} = 0$。
即 $x - y \in N$。

2.  **吸收律**
设 $x \in N$，$r \in R$。
因为 $x \in N$，存在 $n$ 使得 $x^n = 0$。
我们需要证明 $rx$ 也是幂零元。
考察 $(rx)^n$。因为 $R$ 是**交换环**，所以 $(rx)^n = r^n x^n$。
$$(rx)^n = r^n \cdot 0 = 0$$
所以 $rx \in N$。

**结论**：$N$ 是 $R$ 的理想。 $\square$

---

### 题目 15：理想运算的分配律
**15. 证明幺环中理想的加、乘法满足分配律。即设 $I,J,K$ 是幺环 $R$ 的理想，则**
$$(I + J)K = IK + JK,$$
$$K(I + J) = KI + KJ.$$

#### 【深度解析】
*  **定义回顾**：
    *  $I + J = \{ a + b \mid a \in I, b \in J \}$。
    *  $AB$ 是由所有形如 $\sum a_i b_i$ 的**有限和**构成的集合，而不仅仅是简单的 $ab$。
*  **策略**：证明集合相等 $A = B$，通常用双向包含：$A \subseteq B$ 且 $B \subseteq A$。
*  **幺环条件**：这里主要用来保证理想乘积定义的完备性，或者题目暗示利用单位元，但在分配律的证明中，主要依赖运算本身的定义。

#### 【严谨证明】
我们只证明第一条式子 $(I + J)K = IK + JK$。第二条证明完全对称。

1.  **证明 $IK + JK \subseteq (I + J)K$**
    *   因为 $I \subseteq I + J$，所以 $IK \subseteq (I + J)K$。
        （解释：$IK$ 中的元素是由 $ak$ 组成的和，其中 $a \in I$。因为 $a$ 也在 $I+J$ 里，所以这些元素自然也在 $(I+J)K$ 里）。
    *   同理，$J \subseteq I + J$，所以 $JK \subseteq (I + J)K$。
    *   因为 $(I + J)K$ 是一个理想（理想对加法封闭），它包含了 $IK$ 和 $JK$，那么它必然包含它们的和。
    *   所以：$IK + JK \subseteq (I + J)K$。

2.  **证明 $(I + J)K \subseteq IK + JK$**
    *   考察 $(I + J)K$ 中的任意生成元。该集合由形如 $(a + b)k$ 的元素的有限和组成，其中 $a \in I, b \in J, k \in K$。
    *   根据环的乘法对加法的分配律：$$(a + b)k = ak + bk$$
    *   观察各项：
        *   $ak$：因为 $a \in I, k \in K$，所以 $ak \in IK$。
        *   $bk$：因为 $b \in J, k \in K$，所以 $bk \in JK$。
    *   因此，$(a + b)k = ak + bk \in IK + JK$。
    *   既然生成元都在 $IK + JK$ 里，且 $IK + JK$ 对加法封闭，那么 $(I + J)K$ 中的所有元素都在 $IK + JK$ 里。
    *   所以：$(I + J)K \subseteq IK + JK$。

**结论**：由 Step 1 和 Step 2 可知，$(I + J)K = IK + JK$。同理可证另一条。 $\square$

---

### 题目 16：根理想 (Radical Ideal)
**16. 设 $I$ 是交换幺环 $R$ 的一个理想。令**
$$\text{rad}I = \{x \in R \mid \text{存在正整数 } n \text{ 使得 } x^n \in I\}.$$
**证明 $\text{rad}I$ 是 $R$ 的理想（$\text{rad}I$ 称为 $I$ 的根理想）。**

#### 【深度解析】
这道题其实是**第14题的推广**。
*   在第14题中，我们研究的是 $x^n = 0$。要知道，$0$ 其实就是零理想 $\{0\}$。
*   在第16题中，我们将 $\{0\}$ 替换成了一般理想 $I$。即 $x^n \in I$。
*   证明逻辑与第14题完全一致：利用二项式定理处理加法，利用交换律处理乘法。

#### 【严谨证明】
1.  **非空性**
因为 $I$ 是理想，$0 \in I$。所以 $0^1 = 0 \in I$。故 $0 \in \text{rad}I$，集合非空。

2.  **减法封闭**
设 $x, y \in \text{rad}I$。这意味着存在正整数 $n, m$ 使得 $x^n \in I$ 且 $y^m \in I$。我们需要证明 $x - y \in \text{rad}I$。考察 $(x - y)^{n+m}$。利用二项式定理（因为 $R$ 交换）：
$$(x - y)^{n+m} = \sum_{k=0}^{n+m} \binom{n+m}{k} x^k (-y)^{n+m-k}$$
对于每一项 $T_k = \binom{n+m}{k} x^k (-y)^{n+m-k}$：
    *   **情况 A**：若 $k \ge n$。则 $x^k = x^n \cdot x^{k-n}$。因为 $x^n \in I$，且 $I$ 是理想（吸收律），所以 $x^k \in I$。进而整项 $T_k \in I$。
    *   **情况 B**：若 $k < n$。则指数 $n+m-k > n+m-n = m$。即 $y$ 的指数至少是 $m$。所以 $y^{n+m-k} = y^m \cdot y^{\dots}$。因为 $y^m \in I$，由理想吸收律，整项 $T_k \in I$。

综上，展开式中每一项都在 $I$ 中。因为 $I$ 对加法封闭，所以 $(x - y)^{n+m} \in I$。根据定义，这说明 $x - y \in \text{rad}I$。

3.  **吸收律**
设 $x \in \text{rad}I$，$r \in R$。存在 $n$ 使得 $x^n \in I$。考察 $(rx)$。
$$(rx)^n = r^n x^n$$
（这里用到了 $R$ 的交换性）。因为 $x^n \in I$，且 $I$ 是理想，对于环中元素 $r^n$，有 $r^n \cdot x^n \in I$。所以 $(rx)^n \in I$。根据定义，$rx \in \text{rad}I$。

**结论**：$\text{rad}I$ 是 $R$ 的理想。 $\square$

---

### 专家点评与总结
1.  **关于反例 (题8)**：做这类题时，手头常备几个“反例库”：$\mathbb{Z}$（整数）、$M_2(\mathbb{R})$（矩阵）、$\mathbb{Z} \oplus \mathbb{Z}$（直积）。这三个能解决90%的反例构造问题。
2.  **关于二项式定理 (题14, 16)**：这两个证明的核心都在于 $(x+y)^N$ 的展开。如果环**不交换**，二项式定理失效，这些结论通常就不成立了。这是考试中经常考察的概念陷阱。
3.  **理想的本质**：题15和16再次印证了理想的两个核心性质：**内部加法封闭**（像子群）和**外部乘法吸收**（像黑洞）。任何证明都要紧扣这两点。