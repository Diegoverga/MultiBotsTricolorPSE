const express = require('express');
const router = express.Router();
const { loadGetImg } = require('../controllers/pupeController');
const { Bot } = require('./helpers/bots');


var Bots = [];
setInterval(() => {
    Bots.forEach((bot)=>{
        bot.recharge(); 
        
    });
}, 110500);

router.get('/', async (req, res)=>{
    Bots.push(new Bot(`Bot${Bots.length}`));
    for (let i = 0; i < Bots.length; i++) {
        const bot = Bots[i];
        if (bot.name === `Bot${Bots.length-1}`) {
            bot.CreateBot()
                .then(async (data) => {
                    bot.imprimir();
                    req.flash('imgCapcha', `/img/bots/${bot.name}.jpg`);
                    req.flash('bot', `${Bots[0].name}`);
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
        console.log('ENTRO 1');
        req.flash('imgCapcha', res.locals.imgCapcha);
        req.flash('bot', res.locals.bot);
        res.render('CreateBot');
    }else{
        if (req.body.capcha) {
            for (let i = 0; i < Bots.length; i++) {
                const bot = Bots[i];
                if (bot.name === req.body.botname) {
                    bot.fillForm1(req.body.capcha).then(data=>res.send('Bot creado')).catch(data=>{
                        Bots = Bots.splice(0, Bots.length-1);
                        res.send('Error');
                        
                    });
                    break;
                }
            }
        }else{
            for (let i = 0; i < Bots.length; i++) {
                const bot = Bots[i];
                if (bot.name === req.body.botname) {
                    bot.close().then(data=>res.send('Bot Eliminado')).catch(data=>res.send('Erro to delete Bot'))
                    break;
                }
            }

        }
        
        
    }
});

router.post('/pupe', (req, res)=>{
    if (Bots.length === 0) {
        console.log('Crear bot');
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
                    await bot.Page.goBack();
                    bot.status = true;
                })
                break;
            }
        }
    }
    // bot = Bots[parseInt(Math.random() * Bots.length)];
    // console.log(bot);
    //getimg
});

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

module.exports = router;