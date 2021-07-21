let db = require('mysql');

let pool = db.createPool({
    connectionLimit: 10,
    host: '****',
    user: '****',
    password: '****',
    database: '****'
})

exports.pool = pool;

/*
pool.query('INSERT INTO links (link) VALUES("test test")');

pool.query('SELECT * FROM links', function (err, result, fields) {
    if (result) {
        for(let ind in result) {
            console.log(result[ind].link);
        }
    }

    pool.end();
});
*/
