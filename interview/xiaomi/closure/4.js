function foo() {
  var myName = "极客时间"
  let test1 = 1; // 自由变量
  const test2 = 2;

  var innerBar = {
    getName: function() {
      console.log(test1)
      return myName
    },
    setName: function(newName) {
      myName = newName
    }
  }

  return innerBar 
}
{
  let bar = foo()
  bar.setName("极客邦");
  console.log(bar.getName());
}




