# 02 SQL 与关系代数

SQL 大题通常不难，但容易因为约束、外键动作、聚合分组、嵌套查询、视图写法丢分。本章按考试写法整理。

## 一、SQL 语言分类

SQL 是综合性语言，常见分类：

- DDL：数据定义语言，`CREATE`、`ALTER`、`DROP`。
- DML：数据操纵语言，`SELECT`、`INSERT`、`DELETE`、`UPDATE`。
- DCL：数据控制语言，`GRANT`、`REVOKE`。

有些教材也把查询 `SELECT` 称为 DQL，把 `COMMIT`、`ROLLBACK` 称为事务控制 TCL。填空题若按教材“三类”问，通常答 DDL、DML、DCL。

## 二、建表与完整性约束

### 基本模板

```sql
CREATE TABLE 表名 (
    列名 数据类型 [列级约束],
    列名 数据类型 [列级约束],
    CONSTRAINT 约束名 PRIMARY KEY (列1, 列2),
    CONSTRAINT 约束名 FOREIGN KEY (外码列)
        REFERENCES 被参照表(主码列)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT 约束名 CHECK (条件)
);
```

### 主键、唯一、非空

一个表只能有一个主键约束，但主键可以由多列组成。

```sql
CREATE TABLE SC (
    Sno char(9) NOT NULL,
    Cno char(4) NOT NULL,
    Grade int,
    CONSTRAINT PK_SC PRIMARY KEY (Sno, Cno)
);
```

`UNIQUE` 表示候选码性质；`NOT NULL UNIQUE` 可以唯一标识元组，但一个表只能选一个作为 `PRIMARY KEY`。

### 外键动作

外键常见动作：

- `ON DELETE CASCADE`：删除父表记录时，级联删除子表记录。
- `ON DELETE SET NULL`：删除父表记录时，把子表外键置空。
- `ON DELETE NO ACTION` 或不写：若有子表引用，则拒绝删除。
- `ON UPDATE CASCADE`：父表主码更新时，子表外键跟着更新。

考题里三种说法要分清：

```text
级联删除：ON DELETE CASCADE
按置空原则删除：ON DELETE SET NULL
不允许级联删除：不要写 ON DELETE CASCADE，通常保持 NO ACTION/RESTRICT
```

如果父表 `Dept(dptno)` 被子表 `Pe(dptno)` 引用：

```sql
-- 删除部门时，自动删除该部门员工记录，叫级联删除。
FOREIGN KEY (dptno) REFERENCES Dept(dptno)
    ON DELETE CASCADE

-- 删除部门时，员工仍保留，但 dptno 变 NULL，叫置空。
FOREIGN KEY (dptno) REFERENCES Dept(dptno)
    ON DELETE SET NULL

-- 删除部门时，如果还有员工引用该部门，则拒绝删除。
FOREIGN KEY (dptno) REFERENCES Dept(dptno)
```

new-pic 中公司数据库说明“cascading deletion is not allowed, but cascading update is allowed”，建表时应写：

```sql
CONSTRAINT FK_SD_PNO FOREIGN KEY (PNO)
    REFERENCES Product(PNO)
    ON UPDATE CASCADE
```

不要写 `ON DELETE CASCADE`。

## 三、基础查询模板

选择列：

```sql
SELECT Sno, Sname
FROM Student;
```

条件查询：

```sql
SELECT *
FROM Student
WHERE Sgender = N'男'
  AND Sdept = N'计算机科学与技术';
```

模糊匹配：

```sql
WHERE Email LIKE '%@stumail.nwu.edu.cn'
WHERE Sname LIKE N'_武%'     -- 第二个字为“武”
```

排序：

```sql
ORDER BY Qty DESC, Pno ASC
```

聚合：

```sql
SELECT Sdept, COUNT(*) AS StudentCount
FROM Student
GROUP BY Sdept;
```

分组后筛选用 `HAVING`：

```sql
SELECT Sno, AVG(Grade) AS AvgGrade
FROM SC
GROUP BY Sno
HAVING AVG(Grade) >= 90;
```

## 四、连接查询

内连接：

```sql
SELECT s.Sno, s.Sname, sc.Cno, sc.Grade
FROM Student AS s
JOIN SC AS sc ON s.Sno = sc.Sno;
```

左外连接：保留左表全部行。

```sql
SELECT s.Sno, s.Sname, d.RoomNo
FROM Student AS s
LEFT JOIN DormAssign AS d ON s.Sno = d.Sno;
```

全外连接：左右两边未匹配行都保留。题目说“包括没有住宿的学生和空闲床位”，应使用全外连接。

```sql
SELECT s.Sno, s.Sname, b.Building, b.RoomNo, b.BedNo
FROM Student AS s
FULL OUTER JOIN Bed AS b ON s.Sno = b.Sno;
```

## 五、嵌套查询与“全部”问题

### `IN` 与 `EXISTS`

查询参加“法国拉力赛”的车手编号和姓名：

```sql
SELECT Dno, Dname
FROM D
WHERE Dno IN (
    SELECT DC.Dno
    FROM DC
    JOIN C ON DC.Cno = C.Cno
    WHERE C.Cname = N'法国拉力赛'
);
```

`EXISTS` 判断子查询是否非空：

```sql
SELECT *
FROM S AS s
WHERE EXISTS (
    SELECT 1
    FROM SPJ AS spj
    WHERE spj.Sno = s.Sno
);
```

### 没有供应 P3 的供应商

```sql
SELECT *
FROM S AS s
WHERE NOT EXISTS (
    SELECT 1
    FROM SP AS sp
    WHERE sp.Sno = s.Sno
      AND sp.Pno = 'P3'
);
```

### “选修全部课程”的双重 NOT EXISTS

模式：`Student(Sno, Sname)`, `Course(Cno)`, `SC(Sno, Cno, Grade)`。

语义：“不存在一门课程，使得该学生没有选修它”。

```sql
SELECT s.Sno, s.Sname
FROM Student AS s
WHERE NOT EXISTS (
    SELECT 1
    FROM Course AS c
    WHERE NOT EXISTS (
        SELECT 1
        FROM SC AS sc
        WHERE sc.Sno = s.Sno
          AND sc.Cno = c.Cno
    )
);
```

这是除法查询的 SQL 典型写法。

## 六、视图、索引、授权

创建视图：

```sql
CREATE VIEW V_AvgGrade(Sno, AvgGrade) AS
SELECT Sno, AVG(Grade)
FROM SC
GROUP BY Sno;
```

创建索引：

```sql
CREATE INDEX idx_Birthday ON Student(Birthday);
CREATE INDEX idx_Pname ON Product(PName);
```

授权：

```sql
GRANT SELECT ON Product TO Tom;
GRANT SELECT ON Product TO Tom WITH GRANT OPTION;
REVOKE SELECT ON Product FROM Tom;
```

`WITH GRANT OPTION` 表示被授权者可以把权限再授予他人。

## 七、常考 SQL 题型示例

### SaleDetail/Product/Stock

关系：

```text
SaleDetail(SaleTime, SalemanNO, PNO, SaleNum)
Product(PNO, PName, Price)
Stock(PNO, StockNum, StockPlace)
```

建销售明细表：

```sql
CREATE TABLE SaleDetail (
    SaleTime date NOT NULL,
    SalemanNO char(9) NOT NULL,
    PNO char(9) NOT NULL,
    SaleNum int,
    CONSTRAINT PK_SaleDetail PRIMARY KEY (SaleTime, SalemanNO, PNO),
    CONSTRAINT FK_SaleDetail_Product FOREIGN KEY (PNO)
        REFERENCES Product(PNO)
        ON UPDATE CASCADE
);
```

删除 2022-01-01 之后的销售明细：

```sql
DELETE FROM SaleDetail
WHERE SaleTime > '2022-01-01';
```

插入产品：

```sql
INSERT INTO Product(PNO, PName, Price)
VALUES ('12345', 'Redmi Note12', 1699);
```

统计每个产品 2023 年销售总量并降序：

```sql
SELECT PNO, SUM(SaleNum) AS TotalSales
FROM SaleDetail
WHERE YEAR(SaleTime) = 2023
GROUP BY PNO
ORDER BY SUM(SaleNum) DESC;
```

每个产品涨价 10%：

```sql
UPDATE Product
SET Price = Price * 1.10;
```

Warehouse1 销售信息视图：

```sql
CREATE VIEW v_warehouse1(PNO, PName, SaleTime, SaleNum) AS
SELECT sd.PNO, p.PName, sd.SaleTime, sd.SaleNum
FROM SaleDetail AS sd
JOIN Product AS p ON sd.PNO = p.PNO
JOIN Stock AS s ON sd.PNO = s.PNO
WHERE s.StockPlace = 'Warehouse1';
```

### Dept/Pe 部门职工题

创建 `Pe` 表，工资 1500-3500，有主码外码：

```sql
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
```

负责人、部门工资总和视图：

```sql
CREATE VIEW V_DEPE AS
SELECT d.mana, d.dptno, d.dname, SUM(p.wage) AS TotalWage
FROM Dept AS d
JOIN Pe AS p ON d.dptno = p.dptno
GROUP BY d.mana, d.dptno, d.dname;
```

给设计室员工涨工资：

```sql
UPDATE p
SET p.wage = p.wage * 1.10
FROM Pe AS p
JOIN Dept AS d ON p.dptno = d.dptno
WHERE d.dname = N'设计室';
```

按置空原则删除部门：

```sql
DELETE FROM Dept
WHERE dptno = 'Z01';
```

前提是外键定义了 `ON DELETE SET NULL`。

## 八、关系代数与 SQL 对照

选择：

```text
σ_{条件}(R)
SELECT * FROM R WHERE 条件;
```

投影：

```text
π_{A,B}(R)
SELECT DISTINCT A, B FROM R;
```

连接：

```text
R ⋈_{R.A=S.A} S
SELECT * FROM R JOIN S ON R.A = S.A;
```

并、交、差：

```sql
SELECT Sno FROM A
UNION
SELECT Sno FROM B;

SELECT Sno FROM A
INTERSECT
SELECT Sno FROM B;

SELECT Sno FROM A
EXCEPT
SELECT Sno FROM B;
```
