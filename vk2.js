'use strict';

const fs = require( 'fs' );
const puppeteer = require( 'puppeteer' );

const write_file = ( file, data ) => new Promise( ( resolve, reject ) =>
{
    fs.writeFile( file, data, 'utf8', error =>
    {
        if ( error )
        {
            console.error( error );

            reject( false );
        }

        else
        {
            resolve( true );
        }
    });
});

const read_file = file => new Promise( ( resolve, reject ) =>
{
    fs.readFile( file, 'utf8', ( error, data ) =>
    {
        if ( error )
        {
            console.error( error );

            reject( false );
        }

        else
        {
            resolve( data );
        }
    });
});

( async () =>
{

    const cookies_path = 'cookies/cookies.json';
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--user-data-dir']});
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();

    // Open First Page
    await page.goto( 'https://www.vk.com/', { 'waitUntil' : 'networkidle0' } );

    let cookies_content = await read_file(cookies_path);

    if (cookies_content === '' || cookies_content === '{}') {
        console.log('No Cookies');
        await page.waitForSelector('input[name="email"]');
        await page.type('#index_email', '******');
        await page.type('#index_pass', '*******');

        //https://stackoverflow.com/questions/46948489/puppeteer-wait-page-load-after-form-submit

        await page.click('#index_login_button');

        await page.waitFor(12000);

        await write_file(cookies_path, JSON.stringify(await page.cookies()));
    } else {
        console.log('Have Cookies');
        console.log(page.setCookie);
        await page.setCookie( ...JSON.parse(cookies_content || '[]'));
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