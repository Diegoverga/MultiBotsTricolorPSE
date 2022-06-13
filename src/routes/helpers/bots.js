
//puppeter
const puppeteer = require('puppeteer');
const chn = require('chance');
const chance = new chn();

class Bot {
    constructor (n){

        this.status = false;
        this.created = false;
        this.name = n;

    }
    
    async CreateBot () {
        return new Promise(async (resolve, reject)=>{
            try {
                this.Browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                this.Page = await this.Browser.newPage();            
                await this.Page.goto('https://www.psepagos.co/psehostingui/ShowTicketOffice.aspx?ID=262');
                await this.Page.screenshot({path:`./src/public/img/bots/${this.name}.jpg`, clip:{
                    x:462,
                    y:339,
                    width:168,
                    height:48
                }});
                await this.Page.waitForSelector('#id_cliente');
                resolve(true)
            } catch (error) {
                console.log(error);
                await this.Page.close();
                await this.Browser.close();
                reject(false)
            }

            
        });
    }

    async fillForm1(capcha, mail){
        return new Promise( async (resolve, reject)=>{
            try {
                await this.Page.type('#content-in > div.formulario > form > p:nth-child(3) > input.campo_text', capcha);
                await this.Page.type('#id_cliente', chance.ssn({ dashes: false })); //
                await this.Page.type('#info_opcional2', chance.ssn({ dashes: false }));
                await this.Page.type('#total_con_iva', `${parseInt(Math.random()*100000)}`);
                await this.Page.type('#descripcion_pago', 'Renta');
                await this.Page.type('#nombre_cliente', chance.name());
                await this.Page.on('dialog', async(dialog)=>{
                    console.log('Dialog');
                    await this.delay(2000)
                    await dialog.accept();
                });
                await this.Page.click('#btnPay');
                await this.Page.waitForSelector('#listBanks > option:nth-child(19)');
                await this.Page.click('#listBanks > option:nth-child(19)');
                await this.Page.click('#btnContinue');
                await this.Page.waitForSelector('#PNEMail');
                await this.Page.click('#PNEMail');
                // await this.Page.type('#PNEMail', 'carlosgomez@gmail.com');
                await this.Page.type('#PNEMail', mail);
                await this.delay(10000);
                await this.Page.on('dialog', async(dialog)=>{
                    console.log('Dialog');
                    await this.delay(2000)
                    await dialog.accept();
                });
                await this.Page.click('#btnSeguir2');
                await this.Page.waitForSelector('#userId');
                this.status = true;
                this.created = true;
                resolve(true);
            } catch (error) {
                try {
                    await this.Page.close();
                    await this.Browser.close();
                } catch (error) {
                    
                }
                reject(false);
            }
        });
        
    }

    async getimg(user){
        return new Promise(async(resolve, reject)=>{
            try {
                await this.Page.waitForSelector('#userId');
                await this.Page.type('#userId', user, { delay: 20 });
                await this.Page.click('#bank-people > div.btn-center.btn-container > input.btn.btn-main');
                await this.Page.waitForSelector('#securityImage');
    
                const datos = await this.Page.evaluate(() => {
                const img = document.querySelector('#securityImage').src;
                const texto = document.querySelector('#content > div.row.panel-body > div > div > div > div.pull-left.security-question > p:nth-child(2) > b').textContent.replace(/[\n\t]/g, '');
                return {
                    "img": img,
                    "texto": texto
                };
                });
                
                await this.Page.waitForSelector('#authenticationForm > div.col-lg-4.col-md-5.col-sm-6.login-col > div > div.btn-center.btn-container > input.btn.btn-secondary');
                await this.Page.click('#authenticationForm > div.col-lg-4.col-md-5.col-sm-6.login-col > div > div.btn-center.btn-container > input.btn.btn-secondary');
                
                resolve({
                    "status":0,
                    "img": datos.img,
                    "texto": datos.texto
                    
                });
            } catch (error) {
        
                reject({
                    "status":1,
                    "texto": 'Error al cargar su imagen de seguridad.'
                });
            }
        });
    }

    async recharge(){
        return new Promise(async(resolve, reject)=>{
            this.status = false;
            try {
                await this.Page.waitForSelector('#userId')
                await this.Page.type('#userId', 'Prueba123', { delay: 20 });
                await this.Page.click('#bank-people > div.btn-center.btn-container > input.btn.btn-main');
                await this.Page.waitForSelector('#authenticationForm > div.col-lg-4.col-md-5.col-sm-6.login-col > div > div.btn-center.btn-container > input.btn.btn-secondary');
                await this.Page.click('#authenticationForm > div.col-lg-4.col-md-5.col-sm-6.login-col > div > div.btn-center.btn-container > input.btn.btn-secondary');
                this.status = true;
                resolve();
            } catch (error) {
                
                try {
                    await this.Page.click('#wrapper > div > form:nth-child(4) > div > div > div.col-xs-12.col-md-12.btn-center > input');
                    reject();
                } catch (error) {
                    this.status = false;
                    resolve();
                    setTimeout( async() => {
                        await this.Page.goBack();
                        this.status = true;
                    }, 210000);
                }
            }
        })
    }

    async close(){
        return new Promise(async(resolve, reject)=>{
            try {
                await this.Page.close();
                await this.Browser.close();
                resolve();
            } catch (error) {
                reject();
            }
        })
        
    }

    imprimir(){
        console.log('Nombre: '+ this.name);
    }
     
    delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }
}


module.exports = {
    Bot:Bot
}
 
