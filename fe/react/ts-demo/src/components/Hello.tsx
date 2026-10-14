import * as React from 'react';
// props 需要满足的接口约束
interface Props {
  userName: string
}
// 类型别名
// type Props = {
//   username: string;
// };
const HelloComponent:React.FC<Props> = (props) => {
  return (
    <h2>Hello {props.userName}</h2>
  )
}
export default HelloComponent