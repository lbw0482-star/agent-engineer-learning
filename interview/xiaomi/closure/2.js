// 记忆函数
function add() {
  let num = 0;
  return function foo() {
    console.log(++num);
  }
}
const res = add()
res()
res();