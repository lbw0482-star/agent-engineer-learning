interface Animal {
  name: string;
}
// 接口属性可以分头多次约束，合并
interface Animal {
  age: number;
}
const dog:Animal = {name:'三寸钉', age:2}
// 类型名相同冲突
type AnimalType = { name: string;}
type AnimalType = { age: number;}