import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';


const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database:process.env.dbname,
  user:process.env.dbuser,
  password:process.env.dbpassword,
  host:"172.17.0.2",
  port: 3306,
 
});


    
    
export default sequelize   ;