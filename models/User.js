import { DataTypes } from '@sequelize/core';
import sequelize from '../db.js';

const User = sequelize.define('User', {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 ,
        unique:true,
        primaryKey:true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        },
       
      },
      password:{
        type: DataTypes.STRING,
        allowNull: false
      },
      
    },{
      indexes: [
        {
          unique: true,
          fields: ['id'],
          name: 'unique_id_index',  // Specify a unique name for the index
        },
      ]
      }
      
    )

    
    export default User;