// 生成器函数
async function* produce() {
  yield "第一段";
  await new Promise(r => setTimeout(r, 1000));
  yield "第二段";
  await new Promise(r => setTimeout(r, 1000));
  yield "第三段";

}

(async () => {
  // 可迭代的生成器对象， 外面? 
  // const item = produce(); 
  // 每次可以获取到一个值
  // 比async /await 只能一次返回
  // console.log(await item.next());
  // console.log(await item.next());
  // console.log(await item.next());
  // console.log(await item.next());
  for await (const item of produce()) {
    console.log(item);
  }
})()