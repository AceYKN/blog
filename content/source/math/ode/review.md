---
title: 复习总结
order: 4
---

## 一阶线性ODE求解公式

**形式：**

$$\frac{dy}{dx} + P(x)y = Q(x)$$

求解公式：

$$y = e^{-\int P(x) \, dx} \left( \int Q(x) e^{\int P(x) \, dx} \, dx + C \right)$$

## 高阶线性ODE求解方法

### 齐次线性ODE

**形式：**

$$a_n \frac{d^n y}{dx^n} + a_{n-1} \frac{d^{n-1} y}{dx^{n-1}} + \dots + a_1 \frac{dy}{dx} + a_0 y = 0$$

**求解步骤：**

1. 写出特征方程：

   $$a_n \lambda^n + a_{n-1} \lambda^{n-1} + \dots + a_1 \lambda + a_0 = 0$$
2. 求解得到特征根$\lambda_1, \lambda_2, \dots, \lambda_k$。
3. 根据特征根的类型构建通解：
   - 单实根 $\lambda_i$：对应解为 $e^{\lambda_i x}$  
   - $k$ 重实根 $\lambda_i$：对应解为 $(C_1 + C_2 x + \dots + C_k x^{k-1}) e^{\lambda_i x}$
   - 对于$k$重复根 $\alpha + \beta i$：对应解为 $e^{\alpha x} (\cos(\beta x), \sin(\beta x))$
   - 对于$k$重复复根 $\alpha + \beta i$：对应解为 $e^{\alpha x} \left( (C_1 + C_2 x + \dots + C_k x^{k-1}) \cos(\beta x)\right)$
    - 对于$k$重复复根 $\alpha - \beta i$：对应解为 $e^{\alpha x} \left( (C_1 + C_2 x + \dots + C_k x^{k-1}) \sin(\beta x)\right)$
4. 通解为各类解的线性组合。

### 非齐次线性ODE

**形式：**

$$a_n \frac{d^n y}{dx^n} + a_{n-1} \frac{d^{n-1} y}{dx^{n-1}} + \dots + a_1 \frac{dy}{dx} + a_0 y = g(x)$$

**求解步骤：**

1. 求解对应的齐次方程，得到通解 $y_h$
2. 观察非齐次项 $g(x)$ 的形式，一般是多项式、指数函数、三角函数等，尝试构造特解 $y_p$。
    - 如果 $g(x)$ 是多项式 ，尝试 $y_p = Ax^n + Bx^{n-1} + \dots + C$ 的形式。 
    - 如果 $g(x)$ 是指数函数，尝试 $y_p = Ae^{kx}$ 的形式。
    - 如果 $g(x)$ 是三角函数，尝试 $y_p = A\cos(kx) + B\sin(kx)$ 的形式。
3. 将 $y_p$ 代入原方程，求解系数。
4. 最终通解为 $y = y_h + y_p$

## 利用皮卡逐步逼近序列求解ODE的近似解

**形式：**

$$\frac{dy}{dx} = f(x, y), \quad y(x_0) = y_0$$

**第零次近似：**

$$\phi_0(x) = y_0$$

**第一次近似：**

$$\phi_1(x) = y_0 + \int_{x_0}^{x} f(t, \phi_0(t)) \, dt$$

**第$n$次近似：**

$$\phi_n(x) = y_0 + \int_{x_0}^{x} f(t, \phi_{n-1}(t)) \, dt$$

### 积分求导公式

TBD