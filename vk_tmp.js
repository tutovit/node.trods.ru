/*const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();

    await page.goto('https://vk.com/') ;
    await page.emulateMedia('screen') ;
    await page.pdf({
        path: 'devconf.pdf',
        printBackground: true
    });
    await browser.close() ;
})();*/

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const cookies_path = 'cookies/cookies.json';
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--user-data-dir']});
    const page = await browser.newPage();

    fs.readFile(cookies_path, async (err, data) => {
        if(err)
            throw err;

        if (data.length) {
            let cookies = JSON.parse(data);

            for (let i = 0, len = cookies.length; i < len; i++)
                await page.setCookie(cookies[i]);
        }
    });

    await page.goto('https://www.vk.com/');
    await page.waitFor(3000);

    //вход ещё не выполнен?
    if (await page.$('input[name="email"]') !== null) {
        console.log('No Cookies');
        await page.waitForSelector('input[name="email"]');
        await page.type('#index_email', '*****');
        await page.type('#index_pass', '******');
        await page.click('#index_login_button');
        await page.waitForSelector('#page_add_media');

        await page.goto('https://www.vk.com/gdes_nvkz');

        await page.waitFor(1000);

        let cookies = page.cookies();

        console.log(cookies);

        let data = JSON.stringify(cookies);

        console.log(data);

        fs.writeFile(cookies_path, data, function (err, text) {
            return true;
        });

        await page.waitFor(3000);

    } else {
        console.log('Have Cookies');
    }


    await page.goto('https://www.vk.com/gdes_nvkz');
    await page.waitForSelector('#post_field');

    await page.type('#post_field', 'Ура!!! Скоро новые посты!!!');


    await page.waitFor(1500);
    await page.click('._type_photo');

    await page.waitFor(1500);

    const input = await page.$('#choose_photo_upload')
    await page.waitFor(3000);
    await input.uploadFile('/home/node/headless/8519beb6db83f38d6707f15089a21210.jpg')
    // now manually submit the form and wait for network activity to stop
    //await page.click('#html-upload')

    await page.waitFor(4000);

    await page.click('#send_post');

    await browser.close();

})();