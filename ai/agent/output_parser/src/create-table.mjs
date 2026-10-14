import mysql from 'mysql2/promise'

async function main() {
  const connectionConfig = {
    host: "localhost",
    port: 3307,
    user: "root",
    password: "123456",
    multipleStatements: true
  }

  const connection = 
    await mysql.createConnection(connectionConfig);
  try {
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS hello CHARACTER 
      SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `) 
    // 切换到数据库 
    await connection.query(`USE hello;`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS friends (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      gender VARCHAR(10),                -- 性别
      birth_date DATE,                   -- 出生日期
      company VARCHAR(100),              -- 公司
      title VARCHAR(100),                -- 职位
      phone VARCHAR(20),                 -- 当前手机号
      wechat VARCHAR(50)                 -- 微信号
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  } catch(err) {

  }
}
main()
  .then(err => console.log(err))