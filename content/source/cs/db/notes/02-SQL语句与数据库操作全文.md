# SQL语句与数据库操作全文

覆盖图片：`0E164B889B39AE7BF5102E491F71E2D2.png`、`A82101FC9E13F4F2388DC3EEC2CFB6DB.png`、`1530EB82DD93E520018B5683CB9A9BD3.png`、`074F26CB7353DD83CAAA9B45A4BEF568.png`、`635A1DB1DACFAAF5C23A0CCA49E90FF3.png`、`16CF0F453F7276996E66818C6C03E969.png`、`DD05FD2817A6A32159460B7DAEBBA6FC.png`、`324370E4515703A116DDF91B7DD677BD.png`、`D03F9CFE1ED63CF4B07E065C7CD338F3.png`、`IMG_0361.JPG`、`IMG_0361 (1).JPG`、`IMG_0362.JPG`、`IMG_0362 (1).JPG`、`IMG_0363.JPG`、`IMG_0363 (1).JPG`、`IMG_0391.JPG`、`IMG_0391 (1).JPG`、`IMG_0459.JPG`、`IMG_0459 (1).JPG`、`IMG_0460.JPG`、`IMG_0460 (1).JPG`、`IMG_0477.JPG`、`IMG_0477 (1).JPG`、`IMG_0478.JPG`、`IMG_0478 (1).JPG`、`IMG_0479.JPG`、`IMG_0479 (1).JPG`、`IMG_0480.JPG`、`IMG_0480 (1).JPG`、`IMG_0481.JPG`、`IMG_0481 (1).JPG`、`IMG_0482.JPG`、`IMG_0482 (1).JPG`。

## 公司数据库 SQL 题

题面关系：

```text
SaleDetail(SaleTime, SalemanNO, PNO, SaleNum)
Product(PNO, PName, Price)
Stock(PNO, StockNum, StockPlace)
```

全库约束：

```text
The whole database satisfies cascading deletion is not allowed,
but cascading update is allowed.
```

题目：

1. Create table `SaleDetail` with a list of constraints, including primary key and foreign key constraints.
2. Delete the sale details after Jan 1, 2022.
3. Insert a new product `<12345, Redmi Note12, 1699>`.
4. For each product, find the total sales of it in 2023, sort results by total sales in descending order.
5. Increase the price of each product by 10%.
6. Define a view `v_warehouse1(PNO, PName, SaleTime, SaleNum)`. This view displays the sales information of the products stored in warehouse1.
7. Create an index `idx_Pname` on the `Pname` column in the `Product` table.
8. Create a new user `Tom`.
9. Give user `Tom` select authorization on the `Product` table, and let `Tom` grant the permission to other security accounts.

参考答案：

```sql
CREATE TABLE SaleDetail (
    SaleTime date,
    SalemanNO char(9),
    PNO char(9),
    SaleNum int,
    CONSTRAINT PK_SD PRIMARY KEY (SaleTime, SalemanNO, PNO),
    CONSTRAINT FK_SD_PNO FOREIGN KEY (PNO)
        REFERENCES Product(PNO)
        ON UPDATE CASCADE
);

DELETE FROM SaleDetail
WHERE SaleTime > '2022-01-01';

INSERT INTO Product(PNO, PName, Price)
VALUES ('12345', 'Redmi Note12', 1699);

SELECT PNO, SUM(SaleNum) AS TotalSales
FROM SaleDetail
WHERE YEAR(SaleTime) = 2023
GROUP BY PNO
ORDER BY SUM(SaleNum) DESC;

UPDATE Product
SET Price = Price * 1.1;

CREATE VIEW v_warehouse1(PNO, PName, SaleTime, SaleNum) AS
SELECT sd.PNO, p.PName, sd.SaleTime, sd.SaleNum
FROM SaleDetail AS sd
JOIN Product AS p ON sd.PNO = p.PNO
JOIN Stock AS s ON sd.PNO = s.PNO
WHERE s.StockPlace = 'Warehouse1';

CREATE INDEX idx_Pname
ON Product(PName);

CREATE USER Tom;

GRANT SELECT ON Product TO Tom WITH GRANT OPTION;
```

注意：

- 原图中第 2 题写 “after Jan 1, 2022”，通常按 `>` 处理。
- 级联删除不允许，所以外键不写 `ON DELETE CASCADE`。
- 级联更新允许，所以外键写 `ON UPDATE CASCADE`。

## 部门-职工关系 SQL 综合题

题面关系：

```text
Dept(dptno, dname, tele, mana)
Pe(pno, pname, sex, job, wage, dptno)

pno   职工号
pname 职工姓名
sex   性别
job   职务
wage  工资
dptno 所在部门号
dname 部门名
mana  负责人
```

题目：

1. 创建 `Pe` 表，要求“工资”在 1500-3500 元之间，要有主码、外码等完整性定义。
2. 建立一个视图 `V_DEPE`：统计每一个 `mana` 负责人管理的所有部门的员工工资之和，按部门分组。
3. 在 `Pe` 表中，给部门名为“设计室”的部门员工，工资均提高 10%。
4. 删除 `Dept` 表中部门号为 `'Z01'` 的部门信息，按置空原则实施。
5. 在 `Pe` 表中增加元组：职工号 `2015010`，姓名“王石”，性别“男”，归属于新部门 `N01`、“综合室”，负责人“李明”。
6. 编写带参数的存储过程 `Sele_staff`：查询姓名第二个字为“武”的员工的部门名和负责人信息，并以标签格式输出“职工号 姓名 部门 负责人”。按 SQL Server 语法编写。

参考 SQL：

```sql
CREATE TABLE Dept (
    dptno char(10) PRIMARY KEY,
    dname varchar(20) NOT NULL,
    tele varchar(20),
    mana varchar(20)
);

CREATE TABLE Pe (
    pno char(10) PRIMARY KEY,
    pname varchar(20) NOT NULL,
    sex char(2),
    job varchar(20),
    wage int CHECK (wage BETWEEN 1500 AND 3500),
    dptno char(10) NULL,
    CONSTRAINT FK_Pe_Dept FOREIGN KEY (dptno)
        REFERENCES Dept(dptno)
        ON DELETE SET NULL
);

CREATE VIEW V_DEPE AS
SELECT d.mana, d.dptno, d.dname, SUM(p.wage) AS TotalWage
FROM Dept AS d
JOIN Pe AS p ON d.dptno = p.dptno
GROUP BY d.mana, d.dptno, d.dname;

UPDATE p
SET p.wage = p.wage * 1.1
FROM Pe AS p
JOIN Dept AS d ON p.dptno = d.dptno
WHERE d.dname = N'设计室';

DELETE FROM Dept
WHERE dptno = 'Z01';

INSERT INTO Dept(dptno, dname, mana)
VALUES ('N01', N'综合室', N'李明');

INSERT INTO Pe(pno, pname, sex, dptno)
VALUES ('2015010', N'王石', N'男', 'N01');
```

存储过程见 `03-数据库编程全文.md`。

## 供应商-零件 SQL 题片段

可见题目：

```text
3. 查询供应商 S1 供应的零件总数，统计字段命名为 Total_Qty。
4. 查询供应数量大于 100 的 P2 零件的供应商名称、零件规格及供应数量。
5. 查询没有供应零件 P3 的供应商信息。
```

参考写法，表名按常见供应模式假设为：

```text
S(Sno, Sname, ...)
P(Pno, Pname, Spec, ...)
SP(Sno, Pno, Qty)
```

```sql
SELECT SUM(Qty) AS Total_Qty
FROM SP
WHERE Sno = 'S1';

SELECT s.Sname, p.Spec, sp.Qty
FROM S AS s
JOIN SP AS sp ON s.Sno = sp.Sno
JOIN P AS p ON sp.Pno = p.Pno
WHERE sp.Pno = 'P2'
  AND sp.Qty > 100;

SELECT *
FROM S AS s
WHERE NOT EXISTS (
    SELECT 1
    FROM SP AS sp
    WHERE sp.Sno = s.Sno
      AND sp.Pno = 'P3'
);
```

## 主键、候选码与唯一约束

课堂要点：

```text
一个数据表可以有多个候选码（not NULL unique），但只能有一个主码 primary key。
实际应用中：确定的。
全码：所有属性共同组成码。
```

代码示例：

```sql
CREATE TABLE department (
    dno char(4) NOT NULL UNIQUE PRIMARY KEY,
    dname char(20) NOT NULL UNIQUE,
    head char(20)
);
```

如果要表达多个候选码但只选一个主码，可以写成：

```sql
CREATE TABLE department (
    dno char(4) NOT NULL,
    dname char(20) NOT NULL UNIQUE,
    head char(20),
    CONSTRAINT PK_department PRIMARY KEY (dno)
);
```

## Grade 表建表与联合主键

课堂代码片段：

```sql
CREATE TABLE grade1 (
    sno char(6),
    cno char(2),
    score int,
    CONSTRAINT pk_grade1 PRIMARY KEY (sno, cno)
);

INSERT INTO grade1 VALUES ('990101', '01', 85);
INSERT INTO grade1 VALUES ('990101', '03', 85);
INSERT INTO grade1 VALUES ('990102', '01', 65);

SELECT * FROM grade1;
```

其他示例：

```sql
CREATE TABLE grade2 (
    sno char(6) PRIMARY KEY,
    cno char(2) PRIMARY KEY,
    score int
);
```

上面这种写法在 SQL Server 中不推荐，因为一个表只能有一个 `PRIMARY KEY` 约束；联合主键应写成表级约束：

```sql
CREATE TABLE grade2 (
    sno char(6) NOT NULL,
    cno char(2) NOT NULL,
    score int,
    PRIMARY KEY (sno, cno)
);
```

唯一约束示例：

```sql
CREATE TABLE grade3 (
    sno char(6) NOT NULL UNIQUE,
    cno char(2) NOT NULL UNIQUE,
    score int,
    PRIMARY KEY (sno, cno)
);
```

## 聚合与相关子查询

课堂可见 SQL：

```sql
SELECT AVG(score)
FROM grade
WHERE sno = '990101';

SELECT sno, cno, score
FROM grade AS g1
WHERE score > (
    SELECT AVG(score)
    FROM grade AS g2
    WHERE g1.sno = g2.sno
    GROUP BY sno
);
```

要点：

- `AVG(score)` 计算平均分。
- `GROUP BY sno` 可按学号分组。
- 外层 `g1` 与内层 `g2` 通过 `g1.sno = g2.sno` 关联，属于相关子查询。

## 事务删除与提交

课堂代码：

```sql
SELECT * FROM student WHERE sno = '990101';
SELECT * FROM grade WHERE sno = '990101';

BEGIN TRANSACTION;
DELETE FROM grade WHERE sno = '990101';
DELETE FROM student WHERE sno = '990101';
COMMIT;
```

方法：

- 删除学生前先删除选课/成绩等引用学生的子表记录，避免外键约束冲突。
- 使用事务包裹多条删除语句，保证要么全部成功，要么回滚。

## 集合查询与相关子查询片段

可见内容：

```text
SELECT 语句的查询结果是元组的集合，所以对结果可进行集合操作。
集合操作主要包括并操作 UNION、交操作 INTERSECT、差操作 EXCEPT。
父查询和子查询均引用了 SC 表。
用别名 SCX、SCY 将其区分。
这是一个相关子查询。
```

图中可见片段：

```sql
SELECT ...
FROM SC AS SCX
WHERE SCX.Sno = '20180002'
  AND ...;

SELECT ...
FROM SC AS SCY
WHERE SCY.Cno = SCX.Cno;
```

照片局部被遮挡，完整 SQL 不清。语义是用相关子查询表达“和某学生选修课程有关”的集合条件。

## 用户权限与角色

课堂要点：

```text
用户权限：
1. 不是技术问题，是政策问题。
2. 涉及对象：授权方、被授权方、数据对象、操作权限类型。
3. 授权金字塔/级联授权。
4. 数据库权限：操作权限、管理权限。
5. 权限组/角色：简化授权。
6. 构造实例：授权一定验证。前提：可授权用户、Public 权限。
7. 无权：数据库操作、合法用户。
8. Nopower：无权账号。
9. Suser：系统角色 sysadmin(sa)，没有用户数据库授权。
10. Muser：不是系统角色，仅是数据库用户。
```

SQL Server 界面内容：

```text
用户：MUSER1
服务器角色：public、sysadmin、securityadmin、serveradmin、setupadmin、
processadmin、diskadmin、dbcreator、bulkadmin 等。
用户映射、成员身份、安全对象、状态等属性页。
```

## SQL Server 对象访问错误

可见命令：

```sql
SELECT * FROM student;
SELECT * FROM dorm;
```

可见错误/现象：

```text
无法访问 student DATA / Object Explorer。
拒绝了对对象 student 的访问。
```

方法：

- 检查当前登录用户是否映射到对应数据库用户。
- 检查是否对表或视图授予了 `SELECT` 权限。
- 检查数据库角色成员身份，如 `db_datareader`。

