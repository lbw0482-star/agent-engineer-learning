# TS 必考题之 type & interface的区别
- inteface 的开发用法
- 共同点
  interface 和type 都可以描述**对象**的结构，
  用于函数参数、返回值
  给对象、变量做类型约束。

## 区别
- 继承
  interface extends  type & 
- 接口属性可以分头多次约束，合并
  type不可以重复声明
- 能否表示非对象类型
  简单数据的类型别名
- 函数类型的区别
  都可以表达， 有些区别，type更方便