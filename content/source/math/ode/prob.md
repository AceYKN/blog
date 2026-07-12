---
title: 题目内容
order: 1
---

### 习题3.2

1. 假设函数 $P(x)$ 和 $Q(x)$ 于区间 $[\alpha,\beta]$ 上连续，$y = \varphi(x,x_0,y_0)$ 是方程 $\frac{\mathrm{d}y}{\mathrm{d}x} = P(x)y + Q(x)$ 的解，$y_0 = \varphi(x_0,x_0,y_0)$，试求 $\frac{\partial \varphi}{\partial x_0},\frac{\partial \varphi}{\partial y_0}$ 及 $\frac{\partial \varphi}{\partial x}$.

2. 给定方程 $\frac{\mathrm{d}y}{\mathrm{d}x} = \sin \frac{y}{x}$，试求 $\frac{\partial y(x,x_0,y_0)}{\partial x_0}$，$\frac{\partial y(x,x_0,y_0)}{\partial y_0}$ 在 $x_0 = 1,y_0 = 0$ 时的表达式.

### 习题4.1

2. 证明非齐次线性微分方程的叠加原理:设 $x_1(t),x_2(t)$ 分别是非齐次线性微分方程
$$\frac{\mathrm{d}^n x}{\mathrm{d}t^n} + a_1(t)\frac{\mathrm{d}^{n-1}x}{\mathrm{d}t^{n-1}} + \cdots + a_n(t)x = f_1(t),$$
$$\frac{\mathrm{d}^n x}{\mathrm{d}t^n} + a_1(t)\frac{\mathrm{d}^{n-1}x}{\mathrm{d}t^{n-1}} + \cdots + a_n(t)x = f_2(t)$$
的解，则 $x_1(t) + x_2(t)$ 是方程
$$\frac{\mathrm{d}^n x}{\mathrm{d}t^n} + a_1(t)\frac{\mathrm{d}^{n-1}x}{\mathrm{d}t^{n-1}} + \cdots + a_n(t)x = f_1(t) + f_2(t)$$
的解.

3. 已知齐次线性微分方程的基本解组 $x_1,x_2$，求下列方程对应的非齐次线性微分方程的通解:
(1) $x'' - x = \cos t, \ x_1 = \mathrm{e}^t, \ x_2 = \mathrm{e}^{-t}$;
(3) $x'' + 4x = t\sin 2t, \ x_1 = \cos 2t, \ x_2 = \sin 2t$;
(5) $t^2 x'' - tx' + x = 6t + 34t^2, \ x_1 = t, \ x_2 = t\ln t$;

4. 已知方程 $\frac{\mathrm{d}^2 x}{\mathrm{d}t^2} - x = 0$ 有基本解组 $\mathrm{e}^t,\mathrm{e}^{-t}$，试求此方程适合初值条件
$x(0) = 1, \ x'(0) = 0$
及
$x(0) = 0, \ x'(0) = 1$
的基本解组（称为标准基本解组，即有 $W(0) = 1$），并由此求出方程适合初值条件
$x(0) = x_0, \ x'(0) = x'_0$
的解.

5. 设 $x_i(t) \ (i = 1,2,\cdots,n)$ 是齐次线性微分方程 (4.2) 的任意 $n$ 个解，它们所构成的朗斯基行列式记为 $W(t)$. 试证明 $W(t)$ 满足一阶线性微分方程
$$W' + a_1(t)W = 0,$$
因而有
$$W(t) = W(t_0)\mathrm{e}^{-\int_{t_0}^t a_1(s)\mathrm{d}s}t_0, \ t \in (a,b).$$

7. 试证 $n$ 阶非齐次线性微分方程 (4.1) 存在且最多存在 $n+1$ 个线性无关解.

