import puppeteer from 'puppeteer';

( async () => {

    const busLocationBaseUrl = "https://transfer.navitime.biz/justline/pc/location/BusLocationResult?startId="
    const busLocationResultUrls = {
        "00251794": "掛川",
        "00251708": "菊川",
        "00251765": "浜岡",
        "00251377": "島田",
        "00251224": "藤枝",
        "00250993": "焼津",
    }


    const browser = await puppeteer.launch();

    const buses = {}

    for(const url of Object.keys(busLocationResultUrls)) {
        const page = await browser.newPage();
        await Promise.all([
            page.waitForNavigation({waitUntil: ['load', 'networkidle2'] }),
            page.goto(busLocationBaseUrl + url),
        ]);
        const busIdArray = await page.evaluate(() => {return window.busIdArray})
        const namesArray = await page.evaluate(() => {return window.namesArray})
        const vehicleTypeArray = await page.evaluate(() => {return window.vehicleTypeArray})
        const onTimeElementHandle = await page.$$('.on-time')
        const onTimeArry = await Promise.all(onTimeElementHandle.map(handle => handle.evaluate(node => node.innerText)))

        buses[url] = []

        for(let i = 0; i < busIdArray.length; i++) {
            buses[url].push({
                start: busLocationResultUrls[url],
                busId: busIdArray[i],
                vehicleType: vehicleTypeArray[i],
                name: namesArray[i],
                onTime: onTimeArry[i]
            })
        }
        
        // console.log(busIdArray, namesArray, onTimeArry)
    }
    browser.close();
    console.log(JSON.stringify(buses) )
})();