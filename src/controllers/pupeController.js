const puppeteer = require('puppeteer');
const chn = require('chance');
const chance = new chn();

async function loadGetImg() {

    const browser = await puppeteer.launch({
  
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
  
      function delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
      }
  
      // const usuario = req.body.user;
  
      await page.goto('https://www.psepagos.co/psehostingui/ShowTicketOffice.aspx?ID=262');
      
      // page.screenshot({path:"body.jpg"});
      await page.waitForSelector('#id_cliente');
      
      await page.type('#id_cliente', chance.ssn({ dashes: false })); //
      await page.type('#info_opcional2', chance.ssn({ dashes: false }));
      await page.type('#total_con_iva', `${parseInt(Math.random()*100000)}`);
      await page.type('#descripcion_pago', 'Renta');
      await page.type('#nombre_cliente', chance.name());
      await page.click('#btnPay');
      await page.waitForSelector('#listBanks > option:nth-child(19)');
      await page.click('#listBanks > option:nth-child(19)');
      await page.click('#btnContinue');
      await page.waitForSelector('#PNEMail');
      await page.click('#PNEMail');
      await page.type('#PNEMail', 'carlosgomez@gmail.com');
      await delay(10000);
      await page.click('#btnSeguir2');
      return page;
      
      // await page.close();
      // await browser.close();  
  
}

module.exports = {
  loadGetImg:loadGetImg,
}
