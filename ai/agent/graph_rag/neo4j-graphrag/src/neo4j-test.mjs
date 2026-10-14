import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic('neo4j', '12345678')
);

// 获取会话
const session = driver.session() 

async function createData() {
  // cypher
  const result = await session.run(`
    CREATE (p:Product {name: "珍珠奶茶"})
    CREATE (i:Ingredient {name: "珍珠"})  
  `)
  console.log(result)
}

async function createRelation() {
  await session.run(`
    MATCH (p:Product {name: "珍珠奶茶"}), (i:Ingredient {name: "珍珠"})
    CREATE (p)-[:包含]->(i)
  `);
  console.log('关系创建成功');
}

async function queryData() {
  const result = await session.run(`
    MATCH (p:Product {name: "珍珠奶茶"})-[r]->(i)
    RETURN p,r,i  
  `);
  console.log(result);
  result.records.forEach(record => {
    console.log('奶茶：', record.get('p').properties.name)
    console.log('关系:', record.get('r').type)
    console.log('配料：', record.get('i').properties.name)
  })
}

async function updateData() {
  await session.run(`
    MATCH (p:Product {name: "珍珠奶茶"})
    SET p.price = 15, p.calorie="中高"  
  `)
  console.log("更新成功")
}

async function deleteRelation() {
  await session.run(`
    MATCH (p:Product {name: "珍珠奶茶"})-[r:包含]->(i:Ingredient {name: "珍珠"})  
    DELETE r
  `);
  console.log("删除关系成功")
}

async function deleteNode() {
  await session.run(`
    MATCH(p:Product {name: "珍珠奶茶"})
    DELETE p  
  `)
  console.log("删除节点成功")
}

// createData()
// createRelation();
// await queryData();
// await deleteRelation();
await deleteNode();
// 释放 session 与 driver 连接
await session.close();
await driver.close();



