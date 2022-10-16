const { FakeBrowser } = require('fakebrowser')
const { parse } = require('node-html-parser')
const loggy = require('loggy')

async function parser(url, service) {
    try {
        const windowsDD = require('../../node_modules/fakebrowser/device-hub-demo/Windows.json')

        let args = [
            '--enable-features=NetworkService',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--shm-size=3gb'
        ]

        if (service.includes('Subito')) {
            args.push('--proxy-server=socks5://127.0.0.1:9050')
        }

        const builder = new FakeBrowser.Builder()
        .deviceDescriptor(windowsDD)
        .displayUserActionLayer(true)
        .vanillaLaunchOptions({
            headless: true,
            args: args
        }).userDataDir('./fakeBrowserUserData')

        const fakeBrowser = await builder.launch()
        const page = await fakeBrowser.vanillaBrowser.newPage()
        
        try {
            await page.goto(url, { waitUntil: 'networkidle0' })
        } catch (e) {
            loggy.warn(`Some problems with parser => ${e}`)
        }

        const content = await page.content()
        /* console.log(content) */

        let tmpres = []
        if (service == '🇸🇪 Blocket 2.0') {
            let elHandle = await page.$x('//*[@id="skip-tabbar"]/div[2]/div[2]/div[1]/div/article/div[1]/div[2]/h1')
            let property = await page.evaluate(el => el.textContent, elHandle[0])
            tmpres.push(property)

            elHandle = await page.$x('//*[@id="skip-tabbar"]/div[2]/div[2]/div[1]/div/article/div[1]/div[2]/div[2]/div')
            property = await page.evaluate(el => el.textContent, elHandle[0])
            tmpres.push(parseInt(property))

            let backgroundImage = await page.evaluate(el => window.getComputedStyle(el).backgroundImage, await page.$('#skip-tabbar > div.MediumLayout__CenterWithPadding-sc-y8zw9h-4.MediumLayout__CenterWithPaddingAndBg-sc-y8zw9h-5.hITmPl.ieLceE > div.MediumLayout__BodyWrapper-sc-y8zw9h-0.epfGTY > div.MediumLayout__BodyLeft-sc-y8zw9h-2.bCaYRZ > div > article > div.LoadingAnimationStyles__PlaceholderWrapper-sc-c75se8-0.fDsjsL > div.LoadingAnimationStyles__PlaceholderWrapper-sc-c75se8-0.fDsjsL > div > div:nth-child(1) > div > div:nth-child(1)'))
            tmpres.push(backgroundImage.match(/url\("(.*)"/)[1])
        } else if (service == "🇵🇹 OLX 2.0") {
            
        } else if (service == "🇷🇴 OLX 2.0") {
            
        } else if (service == "🇵🇱 OLX 2.0") {
            
        } else if (service == '🇮🇹 Subito 2.0') {
            let name = await page.evaluate(() => { return document.querySelector("#layout > main > div.container_outer-ad-container__2ebNj > div.container_inner-ad-container__2GOJI.grid_detail-container__1b6ka > section.general-info_general-info__dpGJ_.grid_detail-component__L7JhN.grid_ad-info-container__dDCg5.grid_ad-info-override__-SQLj > div.general-info_ad-info__2ZJq4 > h1").innerText })
            let price = await page.evaluate(() => { return parseInt(document.querySelector("#layout > main > div.container_outer-ad-container__2ebNj > div.container_inner-ad-container__2GOJI.grid_detail-container__1b6ka > section.general-info_general-info__dpGJ_.grid_detail-component__L7JhN.grid_ad-info-container__dDCg5.grid_ad-info-override__-SQLj > div.general-info_ad-info__2ZJq4 > p").innerText) })
            let image

            try {
                image = await page.evaluate(() => { return document.querySelector("#layout > main > div.container_outer-ad-container__2ebNj > div.container_inner-ad-container__2GOJI.grid_detail-container__1b6ka > section.grid_detail-component__L7JhN.grid_gallery__zunPB > div > div:nth-child(2) > div.Carousel_carousel__Q328w.Flickity_carousel-wrapper__2ZXHt.flickity-enabled.is-draggable > div.flickity-viewport.is-pointer-down > div > figure.CarouselCell_carousel-cell__2TpC2.is-selected > img").src })
            } catch (e) {
                image = await page.evaluate(() => { return document.querySelector("#layout > main > div.container_outer-ad-container__2ebNj > div.container_inner-ad-container__2GOJI.grid_detail-container__1b6ka > section.grid_detail-component__L7JhN.grid_gallery__zunPB > div > div:nth-child(2) > div.Carousel_carousel__Q328w.Flickity_carousel-wrapper__2ZXHt.flickity-enabled.is-draggable > div.flickity-viewport > div > figure.CarouselCell_carousel-cell__2TpC2.is-selected > img").src })
            }

            if (!image) image = await page.evaluate(() => { return document.querySelector("#layout > main > div.container_outer-ad-container__2ebNj > div.container_inner-ad-container__2GOJI.grid_detail-container__1b6ka > section.grid_detail-component__L7JhN.grid_gallery__zunPB > div > div.Flickity_wrapper__2ZXwJ > div.Carousel_carousel__Q328w.Flickity_carousel-wrapper__2ZXHt.flickity-enabled > div.flickity-viewport > div > figure > img").src })
            
            tmpres.push(name, price, image)
        } else if (service == '🇩🇪 Quoka 2.0') {
            let name = await page.evaluate(() => { return document.querySelector("body > div.spr-wrp > div.cnv > div.cnt.display-flow-root > main > div.box.bdr-grey.docked.detail.big-image > div > div.headline > h1").innerText })
            let price = await page.evaluate(() => { return parseInt(document.querySelector("body > div.spr-wrp > div.cnv > div.cnt.display-flow-root > main > div.box.bdr-grey.docked.detail.big-image > div > div.price.has-type > strong").innerText.replace( /^\D+/g, '')) })
            let image = await page.evaluate(() => { return document.querySelector("#qx_detail-page__image-link > a > img").src })

            tmpres.push(name, price, image)
        } else if (service == '🇩🇪 Ebay 2.0') {
            let name = await page.evaluate(() => { return document.querySelector("#viewad-title").innerText })
            let price = await page.evaluate(() => { return parseInt(document.querySelector("#viewad-price").innerText) })
            let image = await page.evaluate(() => { return document.querySelector("#viewad-image").src })
            
            tmpres.push(name, price, image)
        } else if ((service == '🇩🇪 Vinted 2.0') || (service == '🇪🇸 Vinted 2.0')) {
            let ids = await page.evaluate(() => { return document.querySelector("body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--info").children[0].id.split('-') })

            let arr = []
            for (let i = 3; i < ids.length; i++) {
                arr.push(ids[i])
            }
            
            let id = arr.join('-')
            let name = await page.evaluate((id) => {
                return document.querySelector(`#ItemDescription-react-component-${id} > div > div > div > div:nth-child(1) > h2`).innerText
            }, id)

            let price = await page.evaluate((id) => {
                return parseInt(document.querySelector(`body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--main-info > div.details-list.details-list--pricing > div.details-list__item.details-list--price > span > div`).innerText)
            }, id)

            let image = await page.evaluate((id) => {
                return document.querySelector("body > div.site > div > section > div > div.row.u-position-relative > main > div > section > div.item-photos > figure.item-description.item-photo.item-photo--1 > a > img").attributes['data-src'].value
            }, id)
            
            tmpres.push(name, price, image)
        } else if (service == '🇮🇹 Vinted 2.0') {
            let ids = await page.evaluate(() => { return document.querySelector("body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--info").children[0].id.split('-') })

            let arr = []
            for (let i = 3; i < ids.length; i++) {
                arr.push(ids[i])
            }
            
            let id = arr.join('-')
            let name = await page.evaluate((id) => {
                return document.querySelector(`#ItemDescription-react-component-${id} > div > div > div > div:nth-child(1) > h2`).innerText
            }, id)

            let price = await page.evaluate((id) => {
                return parseInt(document.querySelector(`body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--main-info > div.details-list.details-list--pricing > div.details-list__item.details-list--price > span > div`).innerText.replace('€', ''))
            }, id)

            let image = await page.evaluate((id) => {
                return document.querySelector("body > div.site > div > section > div > div.row.u-position-relative > main > div > section > div.item-photos > figure.item-description.item-photo.item-photo--1 > a > img").attributes['data-src'].value
            }, id)
            
            tmpres.push(name, price, image)
        } else if (service == '🇵🇱 Vinted 2.0') {
            let ids = await page.evaluate(() => { return document.querySelector("body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--info").children[0].id.split('-') })

            let arr = []
            for (let i = 3; i < ids.length; i++) {
                arr.push(ids[i])
            }
            
            let id = arr.join('-')
            let name = await page.evaluate((id) => {
                return document.querySelector(`body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--info > div.details-list__item.details-list--description > h1`).innerText
            }, id)

            let price = await page.evaluate((id) => {
                return parseInt(document.querySelector(`body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--main-info > div.details-list.details-list--pricing > div.details-list__item.details-list--price > span > div`).innerText.replace('€', ''))
            }, id)

            let image = await page.evaluate((id) => {
                return document.querySelector("body > div.site > div > section > div > div.row.u-position-relative > main > div > section > div.item-photos > figure.item-description.item-photo.item-photo--1 > a > img").attributes['data-src'].value
            }, id)
            
            tmpres.push(name, price, image)
        } else if (service == '🇵🇹 Vinted 2.0') {
            let ids = await page.evaluate(() => { return document.querySelector("body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--info").children[0].id.split('-') })

            let arr = []
            for (let i = 3; i < ids.length; i++) {
                arr.push(ids[i])
            }
            
            let id = arr.join('-')
            let name = await page.evaluate((id) => {
                return document.querySelector(`#ItemDescription-react-component-${id} > div > div > div > div:nth-child(1) > h2`).innerText
            }, id)

            let price = await page.evaluate((id) => {
                return parseInt(document.querySelector(`body > div.site > div > section > div > div.row.u-position-relative > main > aside > div.box.box--item-details > div.details-list.details-list--main-info > div.details-list.details-list--pricing > div.details-list__item.details-list--price > span > div`).innerText.replace('€', ''))
            }, id)

            let image = await page.evaluate((id) => {
                return document.querySelector("body > div.site > div > section > div > div.row.u-position-relative > main > div > section > div.item-photos > figure.item-description.item-photo.item-photo--1 > a > img").attributes['data-src'].value
            }, id)
            
            tmpres.push(name, price, image)
        } else if (service.includes('🇪🇸 Milanuncios')) {
            
        } else if (service.includes('🇪🇸 Wallapop')) {
            let name = await page.evaluate(() => { return document.querySelector("#item-detail-title").innerText })
            let price = await page.evaluate(() => { return parseInt(document.querySelector('body > div.container-background-fullscreen > div.detail-item-wrapper > div.detail-item > div.container-detail.clearfix > div.container-detail-section.with-header > div.card-product-detail > div.card-product-detail-top > div.card-product-price-info-wrapper > div > span').innerText) })
            let image = await page.evaluate(() => { return document.querySelector("#js-card-slider-main > li > img").src })
            
            tmpres.push(name, price, image)
        }

        await fakeBrowser.shutdown()
        return await tmpres
    } catch (e) {
        loggy.warn(`Some problems with parser => ${e}`)
    }
}

module.exports = parser