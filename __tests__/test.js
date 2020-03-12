import faker from 'faker'
import puppeteer from 'puppeteer'
import notifier from 'node-notifier';
import path from 'path';
import { toMatchImageSnapshot } from "jest-image-snapshot";
expect.extend({ toMatchImageSnapshot });

const url = 'http://localhost:8080'
const routes = {
    public: {
        main: `${url}`,
        callback: `${url}/callback`,
        catalog: `${url}/stroymateriali/izolyacionnye-plenki.html`,
        product: `${url}/izospan-a-1-6m-43-75-pog-m-70-kv-m-rulon-7-5kg-vetro-vlagozaschitnaja-membrana.html`
    }
}
const width = 1920;
const height = 1080;

const data = {
    email: 'test_' + faker.internet.email(),
    password: 'test',
    firstName: 'test' + faker.name.firstName(),
    lastName: 'test' + faker.name.lastName(),
    phone: faker.phone.phoneNumber(),
    companyName: 'TEST ' + faker.company.companyName()
}

notifier.notify({
    title: 'UI TEST STARTED!',
    sound: true,
    icon: path.join(__dirname, '../dest/img/homescreen_72.png')
});
let browser;
let page;
let frames;

beforeAll(async () => {
    browser = await puppeteer.launch(
        process.env.DEBUG
        ? {
            headless: false,
            slowMo: 250
        }
        : {
            headless: true,
            args: [`--window-size=${width},${height}`],
            slowMo: 100
        })
    page = await browser.newPage()
    await page.setViewport({width: width, height: height});
})

describe('forms', () => {
    // test('callback form', async () => {
    //     await page.goto(routes.public.callback, {waituntil: "networkidle0"})
    //     frames = await page.frames();
    //     const frame = frames.find(f => f.url().indexOf('https://www.google.com/recaptcha/api2/anchor') >= 0);
    //     await page.waitForSelector('#callback-name-page')
    //     await page.click('#callback-name-page')
    //     await page.keyboard.type(data.firstName)
    //     await page.click('#callback-tel-page')
    //     await page.keyboard.type(data.phone)
    //     await page.click('#call-me-back-page [name="is_agreement"]')
    //     await frame.click('.recaptcha-checkbox')
    //     await page.click('[form="call-me-back-page"]')
    //     await page.waitForSelector('.modal-body__inner-remote:not(.hidden)')
    // }, 26000)

    test('calculation form modal', async () => {
        await page.goto(routes.public.main, {waituntil: "networkidle0"})
        await page.click('.nav-item--feedback [data-toggle="dropdown"]')
        await page.click('.nav-link[href="#sendAplication"]')
        await page.waitForSelector('#appl-name')
        await page.click('#appl-name')
        await page.keyboard.type(data.firstName)
        await page.click('#appl-email')
        await page.keyboard.type(data.email)
        await page.click('#appl-tel')
        await page.keyboard.type(data.phone)
        // await page.click('#appl-file')
        // await page.$('#appl-file').uploadFile('C:\datas\MZ\Desktop\Corporate.jpg')
        await page.click('#sendAplication [name="is_agreement"]')
        await page.frames().find(f => f.url().indexOf('https://www.google.com/recaptcha/api2/anchor') >= 0).click('.recaptcha-checkbox')
        await page.click('[form="calculation"]')
        await page.waitForSelector('#sendAplication .modal-body__inner-remote:not(.hidden)')
    }, 260000)

    test('callback form modal', async () => {
        await page.goto(routes.public.main, {waituntil: "networkidle0"})
        await page.click('.nav-item--feedback [data-toggle="dropdown"]')
        await page.click('.nav-link[href="#callback"]')
        await page.waitForSelector('#callback-name')
        await page.click('#callback-name')
        await page.keyboard.type(data.firstName)
        await page.click('#callback-tel')
        await page.keyboard.type(data.phone)
        await page.click('#call-me-back [name="is_agreement"]')
        await page.frames().find(f => f.url().indexOf('https://www.google.com/recaptcha/api2/anchor') >= 0).click('.recaptcha-checkbox');
        await page.click('[form="call-me-back"]')
        await page.waitForSelector('#callback .modal-body__inner-remote:not(.hidden)')
    }, 260000)

    test('provider form modal', async () => {
        await page.goto(routes.public.main, {waituntil: "networkidle0"})
        await page.click('.nav-item--feedback [data-toggle="dropdown"]')
        await page.click('.nav-link[href="#provider"]')
        await page.waitForSelector('#provider-company-name')
        await page.click('#provider-company-name')
        await page.keyboard.type(data.companyName)
        await page.click('#provider-contact')
        await page.keyboard.type(data.firstName)
        await page.click('#provider-tel')
        await page.keyboard.type(data.phone)
        await page.select('#provider-offer-type', 'services')
        await page.select('#subjects1', 'services_2')
        await page.click('#provider [name="is_agreement"]')
        await page.frames().find(f => f.url().indexOf('https://www.google.com/recaptcha/api2/anchor') >= 0).click('.recaptcha-checkbox');
        await page.click('[form="form-provider-block"]')
        await page.waitForSelector('#provider .modal-body__inner-remote:not(.hidden)')
    }, 260000)

    test('review form modal', async () => {
        await page.goto(routes.public.main, {waituntil: "networkidle0"})
        await page.click('.nav-item--feedback [data-toggle="dropdown"]')
        await page.click('.nav-link[href="#workReview"]')
        await page.waitForSelector('#workReview-fio')
        await page.click('#workReview-fio')
        await page.keyboard.type(data.firstName)
        await page.click('#workReview-email')
        await page.keyboard.type(data.email)
        await page.click('#workReview [name="is_agreement"]')
        await page.frames().find(f => f.url().indexOf('https://www.google.com/recaptcha/api2/anchor') >= 0).click('.recaptcha-checkbox');
        await page.click('[form="send-review-mobile"]')
        await page.waitForSelector('#workReview .modal-body__inner-remote:not(.hidden)')
    }, 260000)
})

describe('screens', () => {
    it("matches snapshot catalog", async () => {
        await page.goto(routes.public.catalog);
        const screen = await page.screenshot({fullPage: true});
        expect(screen).toMatchImageSnapshot();
    }, 260000)

    it("matches snapshot product", async () => {
        await page.goto(routes.public.product);
        const screen = await page.screenshot({fullPage: true});
        expect(screen).toMatchImageSnapshot();
    }, 260000)
})

afterAll(async () => {
    notifier.notify({
        title: 'UI TEST FINISHED!',
        message: 'Checkout test status.',
        sound: true,
        icon: path.join(__dirname, '../dest/img/homescreen_72.png')
    });
    if (!process.env.DEBUG) {
        browser.close()
    }
})
