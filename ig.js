const puppeteer = require('puppeteer');
const fs = require("fs");
const request = require("request");
//ps axu
//ps -eo comm |grep -i chrome | xargs -n1 killall -9c
//ps -eo comm |grep -i nodejs | xargs -n1 killall -9c
(async () => {
    function download(uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            request(uri)
                .pipe(fs.createWriteStream(filename))
                .on("close", callback);
        });
    }

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--user-data-dir']});

    try {
        const page = await browser.newPage();
/*        await page.goto('https://www.instagram.com/accounts/login/?source=auth_switcher');
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', '111');
        await page.type('input[name="password"]', '111');
        await page.click('button[type="submit"]');

        await page.waitForSelector('a[href="/ytrods/"]');*/

        await page.goto('https://www.instagram.com/explore/tags/%D0%BE%D1%80%D1%83/');

        await page.waitFor(7000);
        await page.evaluate(() => {
            let a = document.querySelectorAll('a');
            let i = 1;
            for (let index in a) {
                if (a[index].href.indexOf('/p/') > -1) {
                    i++;
                    if (i > 8) {
                        let a_check_divs = document.querySelectorAll('a[href="' + a[i].attributes[0].value + '"] > div');

                        if (a_check_divs.length < 2) {
                            a[i].click();
                            break;
                        }
                    }
                }
            }
        });


        await page.waitFor(2000);

        let memeSrc = '';
        memeSrc = await page.evaluate(() => {
            return document.querySelector('div[role="dialog"] article img[srcset]').src
        });


        console.log(memeSrc);
        await download(memeSrc, '/home/node/headless/meme.jpg', function() {
            console.log('Done!');
        });


        await page.waitFor(5000);
        await page.screenshot({path: '/home/node/headless/instagram.jpg', type: 'jpeg'});
        await browser.close();

    } catch (error) {
        console.log(error);
        await browser.close();
        console.log('Browser Closed');
    }

})();