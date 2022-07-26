const express = require('express');
const { engine } = require('express-handlebars');
const { create } = require('express-handlebars');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();

const fakedata = [
    {
        id: 1,
        nomedeck: 'BW Pestilence',
        modalidade: 'Pauper',
        arquetipo: 'Pestilence',
        commander: 'Não',
        companion: 'Não',
        listacartas: ' ',
    },
    {
        id: 2,
        nomedeck: 'Grixis Affinity',
        modalidade: 'Pauper',
        arquetipo: 'Affinity',
        commander: 'Não',
        companion: 'Não',
        listacartas: ' ',
    }
];
/*Configura a engine (motor) do express para utilizar o handlebars */
app.use(bodyparser.urlencoded({extended: false}));
app.set('view engine','handlebars');
app.engine('handlebars', engine());

/*disponibilizando acesso para as bibliotecas estaticas do bootstrap e jquery */
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
    //res.send("<h1>eu nao acredito</h1>");
    res.render('index');
});

app.get('/decks/delete/:id', function(req,res){
    let umdeck = fakedata.find(o => o.id == req.params['id']);
    let index = fakedata.indexOf(umdeck);
    if (index > -1){
        fakedata.splice(index,1);
    }
    res.render('deck/decks',{data: fakedata});
});


app.get('/decks/novo', function(req,res){
    res.render('deck/formdeck');
});

app.get('/decks/alterar/:id', function(req,res){
    let iddeck = req.params['id'];
    let umdeck = fakedata.find( o => o.id == iddeck);
    
    res.render('deck/formdeck', {deck: umdeck});
    
});

app.post('/decks/save', function(req,res){
    let deckantigo = fakedata.find(o => o.id == req.body.id);

    if(deckantigo != undefined){
        /*ALTERAR */
        deckantigo.nomedeck = req.body.nomedeck;
        deckantigo.modalidade = req.body.modalidade;
        deckantigo.arquetipo = req.body.arquetipo;
        deckantigo.commander = req.body.commander;
        deckantigo.companion = req.body.companion;
        deckantigo.listacartas = req.body.listacartas;
    }else{
        /*INCLUIR */
        let maxid = Math.max(...fakedata.map( o => o.id));
        if (maxid == -Infinity) maxid = 0;

        let novodeck = {
            nomedeck: req.body.nomedeck,
            modalidade: req.body.modalidade,
            arquetipo: req.body.arquetipo,
            commander: req.body.commander,
            companion: req.body.companion,
            listacartas: req.body.listacartas,
            id: maxid + 1,
            cancelado: req.body.cancelado
        };
        fakedata.push(novodeck);
    }
    res.redirect("/decks");
});

app.get('/decks', function(req,res){
    //res.send("<h1>eu nao acredito</h1>");
    res.render('deck/decks', {listadecks: fakedata});
});

/*inicialização da aplicação NodeJS + Express */
app.listen(3000, () =>{
    console.log('Server online - http://localhost:3000/');
});
