---
title: MySQL基础
tags: mysql
categories: 后端
---
### DDL-对数据库的操作

```sql
-- 查看所有数据库
show databases;

-- 选择某一个数据库
use user;

-- 查看当前正在使用的数据库
select database();

-- 创建一个新的数据库
create database user;
create database if not exists user;

-- 删除数据库
drop database if exists user;

-- 修改数据库编码
alter database user character set = utf8
```



### DDL-对数据表的操作

```sql
-- 查看所有表
show tables;

-- 查看表结构
desc user;

-- 新建表
create table if not exists students(
	id int primary key auto_increment,
	name varchar(10) not null,
	age int default 0,
	phone varchar(20) unique default '',
	createtime timestamp
)

-- 修改表
-- 1.修改表名
alter table students rename to student;
-- 2.添加新的列
alter table student add updatatime timestamp;
-- 3.修改字段名称
alter table student change phone mobile varchar(20);
-- 4.修改字段类型
alter table student modify name varchar(30);
-- 5.删除字段
alter table student drop age;

-- 根据一个表结构创建另一个表
create table student1 like student;

-- 删除表
drop table if exists students
```



### DML-数据增删改

```sql
create table if not exists users(
	id int primary key auto_increment,
	name varchar(10) not null,
	age int default 0,
	phone varchar(20) unique default '',
	createtime timestamp default current_timestamp,
	updatetime timestamp default current_timestamp on update current_timestamp
)

-- 插入数据
insert into users (id, name, age, phone) values(1, 'lisi', 18, '10086');
insert into users (name, age, phone) values( 'zs', 20, '10010');

-- 更新所有数据
update users set name = 'rock', age = 18;
-- 更新符合条件数据
update users set name = 'rock' where id = 1;

-- 删除所有数据
delete from users;
-- 删除符合条件数据
delete from users where id = 2 ;

create table if not exists products (
	id int primary key auto_increment,
	brand varchar(20),
	title varchar(100) not null,
	price double not null,
	score decimal(2,1),
	votecnt int,
	url varchar(100),
	pid int
);
```

### 外键的使用

```sql
-- 创建外键
create table teacher (
	id int primary key ,
	name varchar(20) not null,
	age int not null
);
create table student (
	id int primary key auto_increment,
	name varchar(20) not null,
	age int not null,
	teacher_id int ,
  constraint student_f foreign key(teacher_id) references teacher(id) on update cascade
);

-- 修改外键的action
-- restrict和no cation不允许修改或者删除外键 cascade同步外键的修改或者删除
-- SET NULL不存在则设置为null
-- 1.获取外检名称
show create table student;

-- CREATE TABLE `student` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `name` varchar(20) NOT NULL,
--   `age` int(11) NOT NULL,
--   `teacher_id` int(11) DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   KEY `student_f` (`teacher_id`),
--   constraint `student_f` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`) ON UPDATE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

 -- 2.根据名称删除外键
 alter table student drop foreign key student_f;
 
 -- 3.重新添加外键约束
  alter table student add constraint student_f1 foreign key (teacher_id) references teacher(id)
																									 on update cascade
																									 on delete restrict;
```



### DQL-数据查询

```sql
-- 查询数据
-- 1.查询所有字段和数据
select * from products;

-- 2.查询指定字段
select title, price from products;
-- 对字段起别名
select price as money from products;

-- 3.where条件查询

-- 3.1条件判断语句
-- 查询价格大于2000的手机
select * from products where price > 2000;
-- 查询价格等于999的手机
select * from products where price = 999;
-- 查询价格不等于999的手机
select * from products where price != 999;
-- 查询品牌是华为手机
select * from products where brand = '华为';

-- 3.2逻辑运算语句
-- 查询价格大于2000小于4000的手机
select * from products where price > 2000 and price < 4000;
select * from products where price > 2000 && price < 4000;
select * from products where price between 2000 and 4000; -- 包含等于
-- 查询价格5000以上或者品牌是华为的手机
select * from products where price > 5000 or brand = '华为';
-- 查询不为null
select * from products where score is not null;

-- 3.3模糊查询
-- 查询品牌中带有m字符的手机的手机
select * from products where title like '%m%'
-- 查询品牌第二个字符是p的手机
select * from products where title like '_p%'
-- 查询品牌是小米或者华为或者苹果的手机
select * from products where brand in ('华为','小米','苹果');

-- 3.4查询结果排序
-- ASC表示按照升序排序，DESC表示按照降序排序
select * from products where brand = '华为' order by price asc ;

-- 3.5分页查询
select * from products limit 20 offset 0;
select * from products limit 20 offset 20;
select * from products limit 20 offset 40;

-- 3.6聚合函数
-- 计算所有手机总价格
select sum(price)  from products;
-- 计算华为手机总价格
select sum(price)   from products where brand = '华为';
-- 计算所有手机平均价格
select avg(price)  from products;
-- 计算所有手机最高和最低价格
select max(price)  from products;
select min(price)  from products;
-- 计算华为手机个数
select count(*)  from products where brand = '华为';

-- 3.7分组查询
-- 对手机品牌分组,查询每一个手机品牌的平均价格和个数
select brand, avg(price), count(*) from products group by brand;
-- having对分组后的结果进行筛选,筛选分组后平均价格大于2000的品牌手机
select brand, avg(price) avgprice, count(*) from products group by brand having avgprice >2000;
-- 查询平均分大于8的手机,按照品牌分类,求出平均价格
select brand, avg(price) from products where score > 8 group by brand;

-- 3.8多表查询
-- 查询结果为笛卡尔乘积
select * from products, brand;
-- 筛选笛卡尔乘积的结果
select * from products, brand where products.brand_id = brand.id;
-- 左连接
select * from products left join brand on products.id = brand.id;
-- 右连接
select * from products right join brand on products.brand_id = brand.id;
-- 内连接
select * from products inner join brand on products.brand_id = brand.id;
```



### 多对多

```sql
-- 建立学生表和课程表
create table students (
	id int primary key auto_increment,
	name varchar(10) not null,
	age int
);

insert into students (name, age) values ('lile',18);
insert into students (name, age) values ('tom',20);
insert into students (name, age) values ('roce',25);
insert into students (name, age) values ('lily',23);
insert into students (name, age) values ('xxb',14);

create table courses (
	id int primary key auto_increment,
	name varchar(10) not null,
	price double
);

insert into courses (name, price) values ('语文',100);
insert into courses (name, price) values ('英语',666);
insert into courses (name, price) values ('数学',888);
insert into courses (name, price) values ('历史',80);
insert into courses (name, price) values ('心理',200);
insert into courses (name, price) values ('物理',900);

-- 建立学生和课程之间的关系表
create table student_select_course (
	id int primary key auto_increment,
	student_id int not null,
	course_id int not null,
	foreign key (student_id) references students(id) on update cascade,
	foreign key (course_id) references courses(id) on update cascade
);

-- 学生选课 xxb选择了语文 数学 历史, tom 选择了英语 数学

insert into student_select_course (student_id,course_id) values (5,1);
insert into student_select_course (student_id,course_id) values (5,3);
insert into student_select_course (student_id,course_id) values (5,4);

insert into student_select_course (student_id,course_id) values (2,2);
insert into student_select_course (student_id,course_id) values (2,3);

-- 查询要求
-- 4.1查询有选课学生的选课情况
select students.id id,students.name stuName, students.age stuAge,courses.id csId,courses.name csName
from students 
join student_select_course ssc on students.id = ssc.student_id
join courses on courses.id = ssc.course_id;

-- 4.2查询所有学生的选课情况
select students.id id,students.name stuName, students.age stuAge,courses.id csId,courses.name csName
from students 
left join student_select_course ssc on students.id = ssc.student_id
left join courses on courses.id = ssc.course_id;

-- 4.3查询哪些学生还没有选课
select students.id id,students.name stuName, students.age stuAge,courses.id csId,courses.name csName
from students 
left join student_select_course ssc on students.id = ssc.student_id
left join courses on courses.id = ssc.course_id 
where courses.id is null;

-- 4.4查询课程没有被选择
select students.id id,students.name stuName, students.age stuAge,courses.id csId,courses.name csName
from students 
right join student_select_course ssc on students.id = ssc.student_id
right join courses on courses.id = ssc.course_id
where students.id is null;

-- 4.4查询xbb选择了哪些课程
select students.id id,students.name stuName, students.age stuAge,courses.id csId,courses.name csName
from students 
join student_select_course ssc on students.id = ssc.student_id
join courses on courses.id = ssc.course_id
where students.id = 5;
```



### 查询的数据转为JSON

```sql
-- 将查询到的多条数据组织成对象(一对多)
select products.id id,products.title title,products.price price,
JSON_OBJECT('id',brand.id,'name',brand.name)
from products
left join brand on products.id = brand.id;;

-- 将查询到的多条数据组织成对象放到数组中 (多对多)
select students.id id,students.name stuName, students.age stuAge,
 JSON_ARRAYAGG(JSON_OBJECT('id',courses.id,'name',courses.name))
from students 
join student_select_course ssc on students.id = ssc.student_id
join courses on courses.id = ssc.course_id
group by students.id;
```

