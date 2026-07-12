---
title: Week 13 作业
order: 1
---

## 11月20日 P234
**T1（讨论反常重积分敛散性）(选择其中两道)**
(1) $\iint_{\mathbf{R}^2} \frac{\mathrm{d}x\mathrm{d}y}{(1+|x|^p)(1+|y|^q)}$；
(2) $\iint_{D} \frac{\varphi(x,y)}{(1+x^2+y^2)^p}\mathrm{d}x\mathrm{d}y$，$D = \{ (x,y) \mid 0 \leq y \leq 1 \}$，且 $0<m \leq |\varphi(x,y)| \leq M$（$m,M$ 为常数）；
(3) $\iint_{x^2+y^2 \leq 1} \frac{\varphi(x,y)}{(1-x^2-y^2)^p}\mathrm{d}x\mathrm{d}y$，其中 $\varphi(x,y)$ 满足与上题同样的条件；
(4) $\iint_{[0,a] \times [0,a]} \frac{\mathrm{d}x\mathrm{d}y}{|x-y|^p}$；
(5) $\iiint_{x^2+y^2+z^2 \leq 1} \frac{\mathrm{d}x\mathrm{d}y\mathrm{d}z}{(x^2+y^2+z^2)^p}$．


**T2（计算反常重积分）**
(1) $\iint_{D} \frac{\mathrm{d}x\mathrm{d}y}{x^p y^q}$，其中 $D=\{ (x,y) \mid xy \geq 1, x \geq 1 \}$，且 $p>q>1$；
(2) $\iint_{\frac{x^2}{a^2}+\frac{y^2}{b^2} \geq 1} \mathrm{e}^{-\left( \frac{x^2}{a^2}+\frac{y^2}{b^2} \right)} \mathrm{d}x\mathrm{d}y$；


以下是撷取的题目内容：

### T4
判别反常重积分
$$I = \iint_{\mathbf{R}^2} \frac{\mathrm{d}x\mathrm{d}y}{(1 + x^2)(1 + y^2)}$$
是否收敛. 如果收敛, 求其值.


### T5
设
$$F(t) = \iint_{\substack{0 \leq x \leq t \\ 0 \leq y \leq t}} \mathrm{e}^{\frac{tx}{y^2}} \mathrm{d}x\mathrm{d}y,$$
求 $F'(t)$.


### T7
计算积分
$$\int_{\mathbf{R}^n} \mathrm{e}^{-(x_1^2 + x_2^2 + \dots + x_n^2)} \mathrm{d}x_1 \mathrm{d}x_2 \cdots \mathrm{d}x_n.$$

## 11月24日 P329

### T1
证明下列含参变量反常积分在指定区间上一致收敛：
(1) $\displaystyle\int_{0}^{+\infty} \frac{\cos xy}{x^2 + y^2}\mathrm{d}x, \, y \geq a > 0$；
(2) $\displaystyle\int_{0}^{+\infty} \frac{\sin 2x}{x + \alpha}\mathrm{e}^{-\alpha x}\mathrm{d}x, \, 0 \leq \alpha \leq \alpha_0$；
(3) $\displaystyle\int_{0}^{+\infty} x\sin x^4 \cos \alpha x\mathrm{d}x, \, a \leq \alpha \leq b$.


### T4（3）
讨论含参变量反常积分的一致收敛性：
$\displaystyle\int_{0}^{1} x^{p-1}\ln^2 x\mathrm{d}x$，在 (i) $p \geq p_0 > 0$；(ii) $p > 0$.