const puppeteer = require('puppeteer');
const db = require("./db.js");
const request = require("request");
const fs = require("fs");

(async () => {
    let imageRow = {id: 0};

    function download(uri, filename, callback) {
        return new Promise(function (resolve, reject) {
            try {
                request.head(uri, (err, res, body) => {
                    request(uri)
                        .pipe(fs.createWriteStream(filename))
                        .on("close", () => {

                            if (typeof (callback) == 'function') {
                                resolve();
                                callback();
                            }
                        });
                });
            } catch (e) {
                reject();
            }
        });
    }

    function getImageRow() {
        return new Promise(function (resolve, reject) {
            try {
                db.pool.query('SELECT * FROM links WHERE checked = 1 AND deleted = 0 LIMIT 1', (err, result, fields) => {
                    if (typeof (result[0]) !== 'undefined') {
                        imageRow = result[0];
                    }
                    resolve();
                });
            } catch (e) {
                imageRow = '';
                reject();
            }
        });
    }

    function deleteImageRow(id) {
        return new Promise(function (resolve, reject) {
            try {
                db.pool.query('UPDATE links SET deleted = 1 WHERE id = ' + id, (err, result, fields) => {
                    resolve();
                });
            } catch (e) {
                reject();
            }
        });
    }

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
        await page.goto('https://account.mail.ru/login/?mode=simple&v=2.7.1&account_host=account.mail.ru&type=login&allow_external=1&success_redirect=https%3A%2F%2Fe.mail.ru%2Fmessages%2Finbox%3Fback%3D1&opener=mail.login&noinnerscroll=1&wide=1&rebranding2018=1&modal=1&parent_url=https%3A%2F%2Fe.mail.ru%2Flogin%3Flang%3Dru_RU%26Page%3D');
        await page.waitForSelector('#root');
        await page.waitFor(1000);
        await page.type('.username input', '*******');
        await page.click('.login-row button');
        await page.waitFor(1000);
        await page.type('.password input', '*********');
        await page.click('.login-row button');
        await page.waitFor(2000);
        await page.goto('https://wf.mail.ru/minigames/bpservices');
        await page.waitFor(5000);
        /*

                await page.evaluate(() => {
                    let d = new Date();
                    d.setMonth(d.getMonth() + 3);
                    cals.getDay(undefined, d.getDate(), d.getMonth() + 1, d.getFullYear());
                });
        */

        await page.click('div.navigation-tabs__tab:nth-child(4)');
        await page.waitFor(2000);
        await page.screenshot({path: '/home/node/headless/wf.jpg', type: 'jpeg'});


        let btnLength = await page.evaluate(() => {
            let buttons = document.querySelectorAll('.craft-container__button');

            let interval = setInterval(function () {
                let btnOpen = document.querySelectorAll('.craft-popup-controls__button--open');

                if (btnOpen.length) {
                    btnOpen[0].click();
                    let haveOther = false;
                    for (let i in buttons) {
                        if (buttons[i].innerHTML == 'Открыть кейс') {
                            haveOther = true;
                        }
                    }

                    if (!haveOther) { console.log('!haveOther');
                        clearInterval(interval);
                    }
                } else {
                    for (let i in buttons) {
                        if (buttons[i].innerHTML == 'Открыть кейс') {
                            console.log('open');buttons[i].innerHTML='ok';
                            buttons[i].click();break;
                        }
                    }
                }


            }, 500);

            for (let i in buttons) {
                if (buttons[i].innerHTML == 'Забрать содержимое') {
                    buttons[i].click();
                }
            }

            return buttons.length;

        });

        await page.waitFor(btnLength * 1000);

        await page.goto('https://wf.mail.ru/bonus/');

        await page.waitFor(3000);

        await page.screenshot({path: '/home/node/headless/wf2.jpg', type: 'jpeg'});

        await page.evaluate(() => {
            let min = 0,
                max = 7,
                rand = Math.floor(Math.random() * (max - min + 1)) + min;

                document.querySelectorAll('.gifts__item.ref_weapon')[rand].click();
                document.querySelector('.bonus_buttons .btn_profile').click();
        });

        await page.waitFor(1000);

        await page.screenshot({path: '/home/node/headless/wf2.jpg', type: 'jpeg'});


        await browser.close();
    } catch (e) {
        console.log(e);
        await browser.close();
        console.log('Browser Closed');
    }

})();