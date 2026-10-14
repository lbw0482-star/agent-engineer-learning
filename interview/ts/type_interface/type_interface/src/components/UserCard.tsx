// 接口， 传统OOP 核心概念
// 抽象 
// js 原型式的， 函数是一等对象
// ts 大型企业级开发强类型语言， 类java  传统的OOP 思路  
// class  extends implement interface 
// 面向接口的编程 父子组件数据接口
interface User {
  name: string;
  age: number;
  avatarUrl: string;
}
interface UserCardProps {
  user: User;
  onEdit:(id: number) => void;
}
const UserCard:React.FC<UserCardProps> = ({user, onEdit}) =>{
  return (
    <>
    </>
  )
}
export default UserCard;