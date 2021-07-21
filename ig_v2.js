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
        if (link) {
            db.pool.query('SELECT * FROM links WHERE link = '+'"' + link +'"', function (err, result, fields) {
                if (typeof(result) === 'undefined' || typeof(result[0]) === 'undefined') {
                    db.pool.query('INSERT INTO links (link, socname) VALUES(' + '"' + link + '",' + '"instagram"' + ')', (err, result, fields) => {
                        db.pool.end();
                    });
                }
            });
        }
    }

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--user-data-dir', '--proxy-server=socks5://127.0.0.1:9058']});

    try {
        const page = await browser.newPage();

        await page.setViewport({width: 1024, height: 2500})


        await page.goto('https://www.instagram.com/accounts/login/?source=auth_switcher');
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', '******');
        await page.type('input[name="password"]', '*****');
        await page.click('button[type="submit"]');


        await page.waitFor(3000);

        await page.screenshot({path: '/home/node/headless/instagram00.jpg', type: 'jpeg'});

        await page.waitForSelector('a[href="/nikolaus65856585/"]');


        await page.screenshot({path: '/home/node/headless/instagram01.jpg', type: 'jpeg'});

        await page.waitFor(2000);
        await page.goto('https://www.instagram.com/explore/tags/%D0%BE%D1%80%D1%83/');



        await page.waitFor(7000);

        await page.screenshot({path: '/home/node/headless/instagram.jpg', type: 'jpeg'});

        let counterImg = 0;
        while(counterImg++ < 10) {
            await page.evaluate(() => {
                let a = document.querySelectorAll('a');
                let i = 0;
                for (let index in a) {
                    if (typeof (a[index].href) === 'undefined') {
                        continue;
                    }
                    if (a[index].href.indexOf('/p/') > -1) {
                        i++;
                        if (i > 9) {
                            let a_check_divs = document.querySelectorAll('a[href="' + a[index].attributes[0].value + '"] > div');

                            if (a_check_divs.length < 2) {
                                a[index].click();
                                a[index].remove();
                                break;
                            }
                        }
                    }
                }
            });


            await page.waitFor(2000);

            let memeSrc = '';
            memeSrc = await page.evaluate(() => {
                let img = document.querySelector('div[role="dialog"] article img[srcset]'),
                    src = '';
                if (img) {
                    src = img.src;
                }
                return src;
            });


            console.log(memeSrc);

            await insert(memeSrc);
        }

        await browser.close();

    } catch (error) {
        console.log(error);
        await browser.close();
        console.log('Browser Closed');
    }

})();