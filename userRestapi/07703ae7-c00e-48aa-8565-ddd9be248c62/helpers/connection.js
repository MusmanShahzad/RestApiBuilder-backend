const env = require('dotenv').config();
const mysql = require('mysql');
const { makeDb } = require('mysql-async-simple');

class connection{
     db = makeDb();
     con=mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database:process.env.DB_NAME
    });
     constructor() {    }
    async connect(){
        try {
            
            await this.db.connect( this.con);
            return this.db;
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async executeQuery(query){
        try {
           let data=await this.db.query(this.con,query)
           return {
                error:false,
                data
            } 
        } catch (error) {
            return {
                error:true,
                message:error.message
            }
        }
    }
    async close(){
        await this.db.close(this.con)
    }
}
module.exports=new connection();