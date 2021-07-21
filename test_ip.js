const puppeteer = require('puppeteer');
const fs = require("fs");
const request = require("request");
const db = require("./db.js");

(async () => {
    function download(uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            request(uri)
                .pipe(fs.createWriteStream(filename))
                .on("close", callback);
        });
    }

    function insert(link) {
        db.pool.query('SELECT * FROM links WHERE link = '+'"' + link +'"', function (err, result, fields) {
            if (typeof(result[0]) === 'undefined') {
                db.pool.query('INSERT INTO links (link, socname) VALUES(' + '"' + link + '",' + '"instagram"' + ')', (err, result, fields) => {
                    db.pool.end();
                });
            }
        });
    }

    //const browser = await puppeteer.launch({headless: false,args:['--no-sandbox', '--disable-setuid-sandbox ',  '--user-data-dir ', '--proxy-server=socks5://127.0.0.1:9050']});
    //const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--user-data-dir']});
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--user-data-dir', '--proxy-server=socks5://127.0.0.1:9050']});

    try {
        const page = await browser.newPage();

        await page.setViewport({width: 1024, height: 2500})

        await page.goto('https://translate.google.ru/');


        await page.waitFor(2000);
        await page.type('#source', 'Hello');



        await page.waitFor(2000);

        await page.screenshot({path: '/home/node/headless/ip.jpg', type: 'jpeg'});


        await browser.close();

    } catch (error) {
        console.log(error);
        await browser.close();
        console.log('Browser Closed');
    }

})();