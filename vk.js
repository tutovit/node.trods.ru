const puppeteer = require('puppeteer');

(async () => {

    function closeActualize() {

        //#actualize_box
    }
    function checkActualize() {
        console.log(page.url());
        //#actualize_box
    }


    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--user-data-dir']});

    try {
        const page = await browser.newPage();
        await page.setViewport({width: 1024, height: 1500})
        await page.goto('https://www.vk.com/');
        await page.waitForSelector('input[name="email"]');
        await page.type('#index_email', '****');
        await page.type('#index_pass', '****');
        await page.click('#index_login_button');
        await page.waitForSelector('#page_add_media');

        await page.goto('https://vk.com/JustDoMeme');
        await page.waitForSelector('#post_field');

        await page.type('#post_field', '');

        await page.click('._type_photo');

        await page.waitFor(2000);

        await page.screenshot({path: '/home/node/headless/inputUpload.jpg', type: 'jpeg'});
        const input = await page.$('#choose_photo_upload');
        await input.uploadFile('/home/node/headless/meme.jpg')

        await page.waitFor(2000);

        await page.click('#post_postpone_btn1');
        await page.waitFor(1200);

        await page.evaluate(() => {
            let d = new Date();
            d.setMonth(d.getMonth() + 3);
            cals.getDay(undefined, d.getDate(), d.getMonth() + 1, d.getFullYear());
        });

        await page.waitFor(4000);

        await page.click('#send_post');

        await page.waitFor(2000);

        await page.screenshot({path: '/home/node/headless/page5.jpg', type: 'jpeg'});
        await browser.close();
    } catch (e) {
        console.log(e);
        await browser.close();
        console.log('Browser Closed');
    }

})();
