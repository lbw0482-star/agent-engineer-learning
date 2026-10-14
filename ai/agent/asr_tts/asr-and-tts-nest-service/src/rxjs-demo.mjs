// RxJS 就是一套用来**优雅管理各种异步数据流**的工具,
// 网络请求（文本流）、定时器(setTimeout, setInterval ),事件（mousemove）流
import { 
  from, // 从可迭代对象创建 Observable 观察流式处理的对象
  map, // 映射操作 
  pipe, // 管道操作符
} from "rxjs";
// 可迭代表示多次执行
// 可观察的流
const stream = from([1,2,3]) // rxjs 将数组变成流式处理的对象
// console.log(stream);
// 订阅流
// stream.subscribe(v => console.log(v));
// 一系列的操作
stream
  .pipe(
    map(x => x * 2)
  )
  .pipe(
    map(x => x * x)
  )
  .subscribe(v => console.log(v));