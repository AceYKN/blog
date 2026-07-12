---
order: 7
---

# 环同态基本定理 习题详解
---

### 第一部分：基础同态性质证明

这部分题目考察的是环同态最基本的“保结构”性质。

#### 题目 1
**设 $f: R \to S$ 是一个环同态。**
**证明：$f$ 的像 $\operatorname{Im} f$ 是 $S$ 的一个子环，且 $f$ 的核 $\ker f$ 是 $R$ 的一个理想。**

**【深度解析】**
* **什么是像 ($\operatorname{Im} f$)？** 它是 $R$ 中所有元素通过 $f$ 映射过去后，在 $S$ 中形成的集合。证明它是子环，要验证：做减法不出圈，做乘法不出圈。
* **什么是核 ($\ker f$)？** 它是 $R$ 中所有被映射成 $S$ 中零元 ($0_S$) 的元素集合。证明它是理想，要验证：做减法不出圈，**被外界元素乘（吸收律）也不出圈**。

**【详细证明】**

**1. 证明 $\operatorname{Im} f$ 是 $S$ 的子环**

记 $\operatorname{Im} f = \{f(r) \mid r \in R\}$。
(1) **非空性**：因为 $f$ 是同态，所以 $f(0_R) = 0_S$，故 $0_S \in \operatorname{Im} f$，集合非空。
(2) **减法封闭**：设 $y_1, y_2 \in \operatorname{Im} f$。
根据定义，存在 $x_1, x_2 \in R$ 使得 $f(x_1) = y_1$，$f(x_2) = y_2$。
$$y_1 - y_2 = f(x_1) - f(x_2) = f(x_1 - x_2)$$
（注：同态保持加减法，$f(a)-f(b)=f(a-b)$）
因为 $x_1 - x_2 \in R$，所以 $f(x_1 - x_2) \in \operatorname{Im} f$。即 $y_1 - y_2 \in \operatorname{Im} f$。
(3) **乘法封闭**：
$$y_1 \cdot y_2 = f(x_1) \cdot f(x_2) = f(x_1 \cdot x_2)$$
（注：同态保持乘法）
因为 $x_1 \cdot x_2 \in R$，所以其像也在 $\operatorname{Im} f$ 中。

**结论**：$\operatorname{Im} f$ 是 $S$ 的子环。

**2. 证明 $\ker f$ 是 $R$ 的理想**

记 $\ker f = \{x \in R \mid f(x) = 0_S\}$。
(1) **非空性**：$f(0_R) = 0_S \implies 0_R \in \ker f$。
(2) **减法封闭**：设 $a, b \in \ker f$。这意味着 $f(a) = 0_S, f(b) = 0_S$。
$$f(a - b) = f(a) - f(b) = 0_S - 0_S = 0_S$$
所以 $a - b \in \ker f$。
(3) **吸收律（关键）**：设 $a \in \ker f$（即 $f(a)=0_S$），$r \in R$ 是环中**任意**元素。
我们要看 $ra$ 和 $ar$ 是否还在核里。
$$f(ra) = f(r) \cdot f(a) = f(r) \cdot 0_S = 0_S$$
$$f(ar) = f(a) \cdot f(r) = 0_S \cdot f(r) = 0_S$$
因为结果都是 $0_S$，所以 $ra \in \ker f$ 且 $ar \in \ker f$。

**结论**：$\ker f$ 是 $R$ 的理想。 $\square$

---

#### 题目 2
**设 $f: R \to S$ 是一个满同态（Surjective Homomorphism），且 $I$ 是 $R$ 的一个理想。**
**证明：$f(I)$ 是 $S$ 的一个理想。**

**【深度解析】**
* **陷阱提示**：一般情况下，理想在同态下的像**不一定**是理想（只能保证是子环）。但这里有一个关键条件：**“满同态”**。这意味着 $S$ 中的任何元素 $s$，都能找到 $R$ 中的“原身” $r$。这对于证明“吸收律”至关重要。

**【详细证明】**
设 $J = f(I) = \{f(x) \mid x \in I\}$。

1.  **非空性**：因为 $0_R \in I$，所以 $f(0_R) = 0_S \in J$。
2.  **减法封闭**：设 $y_1, y_2 \in J$。存在 $x_1, x_2 \in I$ 使得 $f(x_1)=y_1, f(x_2)=y_2$。
    $$y_1 - y_2 = f(x_1) - f(x_2) = f(x_1 - x_2)$$
    因为 $I$ 是理想，所以 $x_1 - x_2 \in I$，故其像属于 $J$。
3.  **吸收律**：设 $y \in J$，$s \in S$。我们要证明 $s \cdot y \in J$。
    * 因为 $y \in J$，存在 $x \in I$ 使得 $f(x) = y$。
    * **关键步骤**：因为 $f$ 是**满射**，对于 $S$ 中的任意元素 $s$，必然存在 $r \in R$ 使得 $f(r) = s$。
    现在计算 $s \cdot y$：
    $$s \cdot y = f(r) \cdot f(x) = f(r \cdot x)$$
    由于 $I$ 是 $R$ 的理想，$x \in I, r \in R \implies r \cdot x \in I$。
    所以 $f(rx)$ 是 $I$ 中某元素的像，即 $s \cdot y \in J$。
    同理可证 $y \cdot s \in J$。

**结论**：$f(I)$ 是 $S$ 的理想。 $\square$

---

#### 题目 3
**设 $\pi: R \to R/I$ 是由 $\pi(a) = a+I$ 定义的映射（称为典范同态）。**
**证明：$\pi$ 是一个环同态，且 $\ker \pi = I$。**

**【深度解析】**
* 这是商环定义的直接推论。你需要熟悉商环的运算法则：
    * $(a+I) + (b+I) = (a+b) + I$
    * $(a+I)(b+I) = (ab) + I$

**【详细证明】**
1.  **证明 $\pi$ 是同态**：
    * **保持加法**：
        $$\pi(a+b) = (a+b) + I$$
        $$\pi(a) + \pi(b) = (a+I) + (b+I) = (a+b) + I$$
        两者相等。
    * **保持乘法**：
        $$\pi(ab) = ab + I$$
        $$\pi(a)\pi(b) = (a+I)(b+I) = ab + I$$
        两者相等。
    所以 $\pi$ 是环同态。

2.  **证明 $\ker \pi = I$**：
    $\ker \pi$ 的定义是映射到 $R/I$ 中零元的所有元素。
    $R/I$ 的零元是什么？是 $0+I$，也就是集合 $I$ 本身。
    $$a \in \ker \pi \iff \pi(a) = 0_{R/I} \iff a+I = I$$
    在陪集理论中，$a+I = I$ 当且仅当 $a \in I$。
    所以 $\ker \pi = I$。 $\square$

---

#### 题目 4
**设 $R$ 是有单位元的环，$I_1, \dots, I_n$ 和 $J$ 都是 $R$ 的理想。已知对于任意 $s$， $I_s + J = R$。**
**证明：积理想 $I_1 \cdots I_n$ 与 $J$ 也是互素的。**

**【深度解析】**
* **互素的定义**：两个理想 $A, B$ 互素意味着 $A+B=R$。也就是说，我们可以找到 $a \in A, b \in B$ 使得 $a+b=1$。
* **思路**：已知 $1$ 可以写成 $i_1 + j_1$，也可以写成 $i_2 + j_2$... 我们把这些式子乘起来看看会发生什么。

**【详细证明】**
因为 $R$ 有单位元 $1$，且对于每个 $k \in \{1, \dots, n\}$ 都有 $I_k + J = R$。
这意味着存在 $x_k \in I_k$ 和 $y_k \in J$，使得：
$$x_k + y_k = 1$$
现在，我们将这 $n$ 个等式乘起来：
$$1 = 1 \cdot 1 \cdots 1 = (x_1 + y_1)(x_2 + y_2)\cdots(x_n + y_n)$$

观察右边的展开式：
* 展开后只有**一项**是不含任何 $y$ 的，那就是 $x_1 x_2 \cdots x_n$。
* 这一项 $x_1 x_2 \cdots x_n$ 显然属于积理想 $I_1 I_2 \cdots I_n$。
* 展开后的**其余所有项**，每一项至少包含一个 $y_k$ 作为因子。
* 因为 $y_k \in J$ 且 $J$ 是理想（吸收律），所以任何包含 $y_k$ 的项都在 $J$ 中。所有这些项的和也在 $J$ 中。

于是，我们可以把展开式写成：
$$1 = (\underbrace{x_1 x_2 \cdots x_n}_{\in I_1 \cdots I_n}) + (\underbrace{\text{其余项之和}}_{\in J})$$
令 $X = x_1 \cdots x_n \in I_1 \cdots I_n$，令 $Y = \text{其余项之和} \in J$。
我们得到了 $1 = X + Y$，其中 $X \in I_1 \cdots I_n, Y \in J$。
这表明 $1 \in I_1 \cdots I_n + J$。
因为理想包含 $1$ 就等于整个环 $R$，所以：
$$I_1 \cdots I_n + J = R$$
即它们互素。 $\square$

---

### 第二部分：课本 P37 习题

#### 习题 4
**证明 $(\operatorname{End}(G); +, \cdot)$ 构成幺环。**

**【深度解析】**
* $\operatorname{End}(G)$ 是群 $G$ 到自身的所有同态的集合。
* 题目定义了加法是“逐点相加”，乘法是“函数复合”。
* 证明它是环，需要验证：
    1.  $(\operatorname{End}(G), +)$ 是阿贝尔群。
    2.  $(\operatorname{End}(G), \cdot)$ 是半群（封闭、结合律）。
    3.  分配律成立。
    4.  有幺元。

**【详细证明】**
设 $\phi, \psi, \theta \in \operatorname{End}(G)$，$g \in G$。

1.  **加法群性质**：
    * **封闭性**：$(\phi+\psi)(a+b) = \phi(a+b)+\psi(a+b) = \phi(a)+\phi(b)+\psi(a)+\psi(b)$。
        因为 $G$ 是**交换群**，我们可以交换中间两项：$= (\phi(a)+\psi(a)) + (\phi(b)+\psi(b)) = (\phi+\psi)(a) + (\phi+\psi)(b)$。
        所以 $\phi+\psi$ 也是同态。
    * **结合律、交换律、零元、逆元**：直接继承自交换群 $G$ 的性质。零元是零同态 $0(g)=0$。

2.  **乘法性质（复合）**：
    * **封闭性**：两个同态的复合还是同态（标准结论）。
    * **结合律**：函数的复合天然满足结合律。$(\phi \circ \psi) \circ \theta = \phi \circ (\psi \circ \theta)$。

3.  **分配律（最重要的一步）**：
    * **左分配律** $\theta \cdot (\phi + \psi) = \theta \cdot \phi + \theta \cdot \psi$：
        $$[\theta \circ (\phi + \psi)](g) = \theta((\phi+\psi)(g)) = \theta(\phi(g) + \psi(g))$$
        因为 $\theta$ 是同态（保持加法）：
        $$= \theta(\phi(g)) + \theta(\psi(g)) = (\theta \circ \phi)(g) + (\theta \circ \psi)(g)$$
        得证。
    * **右分配律** $(\phi + \psi) \cdot \theta = \phi \cdot \theta + \psi \cdot \theta$：
        $$[(\phi + \psi) \circ \theta](g) = (\phi + \psi)(\theta(g))$$
        根据加法的定义：
        $$= \phi(\theta(g)) + \psi(\theta(g)) = (\phi \circ \theta)(g) + (\psi \circ \theta)(g)$$
        得证。

4.  **幺元**：
    恒等映射 $id: G \to G$ ($id(g) = g$) 是同态，且对于任何 $\phi$，$\phi \circ id = \phi = id \circ \phi$。

**结论**：$\operatorname{End}(G)$ 构成幺环。 $\square$

---

#### 习题 18
**判断命题正误（$\varphi: R \to S$ 是满同态，且 $\varphi(1_R)=1_S$）：**

**(1) $\varphi$ 把幂零 (幂等) 元映为幂零 (幂等) 元。**
* **正确**。
* **证明**：
    * 设 $a$ 是幂零元，即存在 $n$ 使 $a^n = 0_R$。
        $\varphi(a)^n = \varphi(a^n) = \varphi(0_R) = 0_S$。所以 $\varphi(a)$ 是幂零元。
    * 设 $a$ 是幂等元，即 $a^2 = a$。
        $\varphi(a)^2 = \varphi(a^2) = \varphi(a)$。所以 $\varphi(a)$ 是幂等元。

**(2) $\varphi$ 把零因子映为零因子。**
* **错误**。
* **反例**：考虑 $R = \mathbb{Z}_4$（整数模4），$S = \mathbb{Z}_2$（整数模2）。
    $\varphi(x) = x \pmod 2$。
    在 $\mathbb{Z}_4$ 中，$2 \cdot 2 = 0$，所以 $2$ 是零因子。
    $\varphi(2) = 0$ 在 $\mathbb{Z}_2$ 中。
    通常“零因子”指非零元素。$0$ 不是零因子。所以零因子 $2$ 被映成了 $0$。
    即使零因子映射成非零元，例如 $R = \mathbb{Z} \times \mathbb{Z}$，$S = \mathbb{Z}$。
    $\varphi((1,0)) = 1$。$(1,0)$ 是 $R$ 的零因子（因为它乘以 $(0,1)$ 等于 0），但像 $1$ 在 $S$ 中显然不是零因子。

**(3) $\varphi$ 把整环映为整环。**
* **错误**。
* **反例**：$R = \mathbb{Z}$（整环），$S = \mathbb{Z}_4$（不是整环，有零因子）。
    $\varphi: n \mapsto n \pmod 4$ 是满同态。

**(4) 如果 $S$ 是整环, 则 $R$ 是整环。**
* **错误**。
* **反例**：$R = \mathbb{Z} \times \mathbb{Z}$（不是整环），$S = \mathbb{Z}$（整环）。
    $\varphi(a, b) = a$ 是满同态。

**(5) $\varphi$ 把可逆元映为可逆元。**
* **正确**。
* **证明**：设 $u \in R$ 可逆，即存在 $v$ 使 $uv = 1_R$。
    $\varphi(u)\varphi(v) = \varphi(uv) = \varphi(1_R) = 1_S$。
    所以 $\varphi(u)$ 在 $S$ 中可逆。

**(6) 对于 $a \in R$, 如果 $\varphi(a)$ 可逆, 则 $a$ 可逆。**
* **错误**。
* **反例**：$R = \mathbb{Z}$，$S = \mathbb{Z}_5$。
    取 $a = 2$。$\varphi(2) = 2$ 在 $\mathbb{Z}_5$ 中可逆（因为 $2 \cdot 3 = 6 \equiv 1$）。
    但在 $\mathbb{Z}$ 中，只有 $1, -1$ 可逆，$2$ 不可逆。

---

#### 习题 19
**设 $R$ 是幺环, $T$ 是整环, $\varphi: R \to T$ 是环同态. 证明 $\varphi(1_R) = 1_T$。**

**【深度解析】**
* 一般定义环同态不强制要求保单位元，但如果陪域是**整环**（无零因子）且同态非零，则自动保持。

**【详细证明】**
在 $R$ 中，有 $1_R \cdot 1_R = 1_R$。
两边取同态：
$$\varphi(1_R) \cdot \varphi(1_R) = \varphi(1_R \cdot 1_R) = \varphi(1_R)$$
记 $e = \varphi(1_R) \in T$。上式变为 $e \cdot e = e$，即 $e^2 - e = 0$，也就是 $e(e - 1_T) = 0$。
因为 $T$ 是**整环**，没有非零零因子，所以必有：
$$e = 0_T \quad \text{或} \quad e - 1_T = 0_T \implies e = 1_T$$
如果 $\varphi$ 不是零同态（通常默认含单位元的环同态把 $1_R$ 映到非零元，或者题目隐含非平凡同态），且 $T$ 是含单位元的环。如果 $\varphi(1_R)=0$，则对于任意 $r$，$\varphi(r)=\varphi(r \cdot 1)=\varphi(r) \cdot 0 = 0$，即 $\varphi$ 是零映射。
如果排除零映射的情况，则必有 $\varphi(1_R) = 1_T$。 $\square$

---

#### 习题 20
**证明构造的环 $(R, \oplus, \odot)$ 与原环 $(R, +, \cdot)$ 同构。**
定义：$a \oplus b = a + b - 1$, $a \odot b = a + b - ab$。

**【深度解析】**
* 我们需要构造一个双射 $f: (R, \oplus, \odot) \to (R, +, \cdot)$。
* 观察运算：$a \odot b = 1 - (1-a)(1-b)$。这个形式暗示了 $x \mapsto 1-x$ 可能是一个同构。

**【详细证明】**
构造映射 $f: R \to R$，定义为 $f(x) = 1 - x$。
1.  **双射性**：显然 $f(f(x)) = 1-(1-x) = x$，由逆映射存在可知它是双射。
2.  **保持加法**：
    我们需要证明 $f(a \oplus b) = f(a) + f(b)$。
    左边 $= f(a + b - 1) = 1 - (a + b - 1) = 2 - a - b$。
    右边 $= (1 - a) + (1 - b) = 2 - a - b$。
    相等！
3.  **保持乘法**：
    我们需要证明 $f(a \odot b) = f(a) \cdot f(b)$。
    左边 $= f(a + b - ab) = 1 - (a + b - ab)$。
    右边 $= (1 - a)(1 - b) = 1 - b - a + ab = 1 - (a + b - ab)$。
    相等！

**结论**：$f(x) = 1-x$ 是一个环同构，所以两个环结构同构。 $\square$

---

### 第三部分：课本 P89 习题

#### 习题 3
**设 $IJ \subseteq K$ 且 $I$ 与 $K$ 互素, 证明 $J \subseteq K$.**

**【深度解析】**
* **条件**：$I+K=R$（互素），$IJ \subseteq K$（积在 $K$ 里）。
* **目标**：任取 $j \in J$，证明 $j \in K$。
* **技巧**：利用 $1$ 的分解。

**【详细证明】**
1.  因为 $I$ 与 $K$ 互素，所以 $I + K = R$。
    这意味着存在 $i \in I$ 和 $k \in K$，使得 **$i + k = 1$**。
2.  设任意元素 $j \in J$。
    $$j = 1 \cdot j = (i + k)j = ij + kj$$
3.  分析这两项：
    * $ij$：因为 $i \in I$ 且 $j \in J$，所以 $ij \in IJ$。
        题目已知 $IJ \subseteq K$，所以 **$ij \in K$**。
    * $kj$：因为 $k \in K$ 且 $K$ 是理想（吸收性），所以 **$kj \in K$**。
4.  因为 $K$ 是理想（对加法封闭），所以 $ij + kj \in K$。
    即 $j \in K$。
**结论**：$J \subseteq K$. $\square$

---

#### 习题 4
**设 $I, J \supseteq K$ 且 $I$ 与 $J$ 互素, 证明 $IJ \supseteq K$.**

**【深度解析】**
* 这是一个反直觉的结论。通常 $IJ \subseteq I \cap J$。
* 当 $I, J$ 互素时，有一个重要定理：$IJ = I \cap J$。
* 如果能证明 $IJ = I \cap J$，结合 $K$ 既在 $I$ 里又在 $J$ 里，自然在交集里，问题就解决了。

**【详细证明】**
1.  **先证当 $I, J$ 互素时，$IJ = I \cap J$**。
    * 显然 $IJ \subseteq I \cap J$ 总是成立。
    * 因为 $I, J$ 互素，存在 $i \in I, j \in J$ 使得 $i+j=1$。
    * 设任意 $x \in I \cap J$。
        $$x = 1 \cdot x = (i+j)x = ix + jx$$
    * 看第一项 $ix$：因为 $x \in J$，所以 $ix \in IJ$（$I$ 乘 $J$）。
    * 看第二项 $jx$：因为 $x \in I$，所以 $jx \in JI = IJ$。
    * 所以 $x \in IJ$。即 $I \cap J \subseteq IJ$。
    * 综上，$IJ = I \cap J$。

2.  **回到题目**：
    已知 $K \subseteq I$ 且 $K \subseteq J$。
    根据集合论知识，这蕴含 $K \subseteq I \cap J$。
    由第 1 步的结论，$I \cap J = IJ$。
    所以 $K \subseteq IJ$。

**结论**：$IJ \supseteq K$. $\square$

