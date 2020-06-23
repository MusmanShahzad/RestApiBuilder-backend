const {keys,defaults,type} = require('./../../data/optionsData');
const createQuery=(data) =>{
    return `${createDataBaseQuery(data.name)} ${createTable(data)}`;
}
const createDataBaseQuery=(databaseName)=>{
return `CREATE DATABASE IF NOT EXISTS ${databaseName};
USE ${databaseName};\n`;
}
const createTable=(data)=>{
    let query=[];
    data.tables.forEach((table)=>{
        query.push(generateTable(table,data.name));
    })
    return query.join(';')
}
const generateTable=(tableData,dbName)=>{
    return `CREATE TABLE IF NOT EXISTS ${dbName+"."+tableData.name} (${createColumns(tableData.columns)}) ENGINE = MyISAM;
    `;
}
const generateColumn=(columnData)=>{
    return `${columnData.name} ${type[columnData.type]} (${columnData.length}) ${columnData.null?'NULL':'NOT NULL'} ${columnData.default?defaults[columnData.default]:''} ${keys[columnData.key]}`;
}
const createColumns=(columns)=>{
    let query = [];
    columns.forEach(column =>{
        query.push(generateColumn(column));
        return;
    });
    return query.join(',');
}
module.exports = {createDataBaseQuery,createColumns,createQuery}