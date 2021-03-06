const express = require('express');
const router = express.Router();
const { Bot } = require('./helpers/bots');


var Bots = [];
setInterval(() => {
    Bots.forEach((bot)=>{
        if (this.status === true) {
            bot.recharge().catch(data=>{
                bot.created = false;
                bot.close();
            })
                
        }
        
    });
    Bots = Bots.filter(bot=>bot.created === true);
}, 110500);

router.get('/', async (req, res)=>{
    Bots.forEach(async(bot) => {
        console.log(bot.created);
        if (bot.created === false) {
            bot.close();
        }
    });
    Bots = Bots.filter(bot=>bot.created === true);
    Bots.push(new Bot(`Bot${Bots.length}`));
    for (let i = 0; i < Bots.length; i++) {
        const bot = Bots[i];
        if (bot.name === `Bot${Bots.length-1}`) {
            bot.CreateBot()
                .then(async (data) => {
                    bot.imprimir();
                    req.flash('imgCapcha', `/img/bots/${bot.name}.jpg`);
                    req.flash('bot', `${bot.name}`);
                    res.render('CapchaBot');
                })
                .catch(data => {
                    Bots = Bots.splice(0, Bots.length-1);
                    res.send('Error');
                })
            break;
        }
        
    }
});

router.post('/', async (req, res)=>{
    if (req.body.status === '0') {
        req.flash('imgCapcha', res.locals.imgCapcha);
        req.flash('bot', res.locals.bot);
        res.render('CreateBot');
    }else{
        if (req.body.capcha) {
            for (let i = 0; i < Bots.length; i++) {
                const bot = Bots[i];
                if (bot.name === req.body.botname) {
                    bot.created = true;
                    bot.fillForm1(req.body.capcha, req.body.mail).then(data=>res.send('Bot creado')).catch(data=>{
                        bot.created = false;
                        Bots = Bots.filter(bot=>bot.created === true);
                        res.send('Error');
                        console.log(Bots);
                        
                    });
                    break;
                }
            }
        }else{
            for (let i = 0; i < Bots.length; i++) {
                const bot = Bots[i];
                if (bot.name === req.body.botname) {
                    bot.close().then(data=>res.send('Bot Eliminado')).catch(data=>res.send('Erro to delete Bot'));
                    Bots = Bots.filter(bot=>bot.created === true);
                    break;
                }
            }

        }
        
        
    }
});

router.post('/pupe', (req, res)=>{
    Bots = Bots.filter(bot=>bot.created === true);
    if (Bots.length === 0) {
        res.json({
            "status":2,
            "message": 'Error, no hay bots disponibles.'
        })
    }else{
        for (let i = 0; i < Bots.length; i++) {
            let bot = Bots[i];
            if (bot.status===true) {
                bot.status === false;
                bot.getimg(req.body.user).then(data=>{
                    bot.status = true;
                    res.json(data);
                }).catch(async(data)=>{
                    bot.status = false;
                    res.json(data);
                    await delay(210000);
                    try {
                        await this.Page.click('#wrapper > div > form:nth-child(4) > div > div > div.col-xs-12.col-md-12.btn-center > input');
                        bot.created = false;
                        Bots = Bots.filter(bot=>bot.created === true && bot.status);
                    } catch (error) {
                        await bot.Page.goBack();
                        bot.status = true;
                    }
                })
                break;
            }
        }
    }
});

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

module.exports = router;