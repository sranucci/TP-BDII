const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'mri2022bd2',
});


const executeQuery = async (query, ...values) => {


    return new Promise( (resolve, reject) => { pool.query(query, [...values], (err, rows, fields) => {
        if (err){
          reject(err);
        }
        
        resolve(rows);

      }) });    
};

const destroyPool = () => {
    pool.end(()=>{})
}


module.exports = {executeQuery, destroyPool}