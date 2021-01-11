
const convertor=(data)=>{
    return {
        projectId: data.name,
        port:8080,
        secretKey: 'Token Genrating key',
        routes:Routes(data.tables)
    }
    
}
const Routes=(data)=>{
    let out=[];
    //console.log(data.length);
    
   data.forEach(ele=>
    {
       //console.log( {...GetVariables(ele.columns)[0],name:GetVariables(ele.columns)[0].name+"_id"})
       out.push( {
           path:ele.name,
           auth :false,
           methods:{
               get:{
                   auth:false,
                   query:GetQuery(ele),
                   variables:GetVariables(ele.columns)
               },
               post:{
                auth:false,
                query:PostQuery(ele),
                variables:PostVariables(ele.columns)
            },
            put:{
                auth:false,
                query:PutQuery(ele),
                variables:PostVariables(ele.columns).concat([{...GetVariables(ele.columns)[0],name:GetVariables(ele.columns)[0].name+"_id"}])
            },
            patch:{
                auth:false,
                query:`Select * from ${ele.name}`
            },
            delete:{
                auth:false,
                query:DeleteQuery(ele),
                variables:GetVariables(ele.columns)
            },
           }
    })
   }
   );
   return out;
}
const GetQuery=(data)=>{
    let query = `Select * from ${data.name}`;
    let variables=GetVariables(data.columns);
    if(variables.length>0){
        query+=" where "+variables[0].name+"='${"+variables[0].name+"}'";
    }
    return query;
}

const PostQuery=(data)=>{
    let query =`Insert into ${data.name}(${PostVariables(data.columns).map(
        (ele)=>ele.name
    ).join(',')}) Values(${PostVariables(data.columns).map(
        (ele)=>"'${"+ele.name+"}'"
    ).join(',')})`;
    return query;
}
const PutQuery=(data)=>{
    let query = `Update ${data.name} set ${PostVariables(data.columns).map((ele)=>ele.name+"="+"'${"+ele.name+"}'").join(',')}`;
    query+=" where "+GetVariables(data.columns)[0].name+"='${"+GetVariables(data.columns)[0].name+"_id}'";
    return query;
}
const DeleteQuery=(data)=>{
    let variable=GetVariables(data.columns);
    let query = `Delete from ${data.name} where ${variable[0].name}=`+"'${"+variable[0].name+"}'";
    return query;
}
const PostVariables=(data)=>{
    let out=[];
    for(let column of data){
        if(column.default==0){
        out.push(Variable(column,'body'));
    }
    }
    return out;
}
const GetVariables=(data)=>{
    let out=[];
    for(let column of data){
        if(column.key==1){
        out.push(Variable(column,'query'));
        return out;
    }
    }
    return out;
    
}
const Variable=(column,parse)=>{
   return {
        name:column.name,
        type:typeConvertor(column),
        parse,
        validator:{
            max:column.length,
            required:column.null
        }
    }
}

const typeConvertor=(data)=>{
    if(data.type===2||(data.type>=8&&data.type<=10)){
        return 'int';
    }
    if(data.type>10&&data.type<=14){
        return 'float';
    }
    if(data.type===15){
        return 'boolean';
    }
    return 'string'
}

module.exports={convertor}