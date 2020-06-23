const bodyParser = require('body-parser');
const mysql = require('mysql');
const env = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const startServer = async () => {
    try {
        await fs.copyFileSync('.env', 'destination.txt');
        let connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database:process.env.DB_NAME
        });
        connection.connect((err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log('connected')
            }
        });
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
        app.use(bodyParser.raw());
        app.get('/api/:tableName',async (req, res) => {
            connection.query(
                `Select * from ${req.params.tableName} ${Object.keys(req.body).length>0?`where ${getQueryWhere(req.body).join(' and ')}`:''}`,(err, result, fields)=>{
                    console.log(err);
                    if(err){
                        res.json({
                            error:true,
                            message:err.message
                        })
                    }
                    res.json({
                        error:false,
                        data:result
                    });
                    return;
                });
            
        });
        app.post('/api/:tableName', (req, res) => {
            connection.query(
                (`insert into ${req.params.tableName} (${Object.keys(req.body).join(',')}) values (${Object.values(req.body).map(i => "'" + i +"'").join(',')})`),(err, result, fields)=>{
                    console.log(err);
                    if(err){
                        res.json({
                            error:true,
                            message:err.message
                        })
                    }
                    res.json({
                        error:false,
                        data:result
                    });
                    return;
                });
        });
        app.put('/api/:tableName', (req, res) => {
            connection.query(
                (`update  ${req.params.tableName} set ${getQueryWhere(req.body).join(',')} where ${getQueryWhere(req.query).join(' and ')}`),(err, result, fields)=>{
                    console.log(err);
                    if(err){
                        res.json({
                            error:true,
                            message:err.message
                        })
                    }
                    res.json({
                        error:false,
                        data:result
                    });
                    return;
                });
        });
        app.delete('/api/:tableName',async (req, res) => {
            connection.query(
                `DELETE  from ${req.params.tableName} ${Object.keys(req.body).length>0?`where ${getQueryWhere(req.body).join(' and ')}`:''}`,(err, result, fields)=>{
                    console.log(err);
                    if(err){
                        res.json({
                            error:true,
                            message:err.message
                        })
                    }
                    res.json({
                        error:false,
                        data:result
                    });
                    return;
                });
            
        });
        app.listen(PORT, () => {
            console.log(`🚀 Listening at http://localhost:${PORT}`)
    });

    } catch (err) {
        console.log(err);
    }
}
const getQueryWhere=(data) =>{
    const query = [];
    Object.keys(data).forEach(key =>{
        query.push(`${key}='${data[key]}'`)
    });
    return query;
}
startServer();