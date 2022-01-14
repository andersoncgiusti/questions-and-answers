const express = require('express') //npm install express --save || npm install nodemon -g
const app = express()
const port = 3000
const bodyParser = require('body-parser') // npm install body-parser --save
const database = require('./database/database.js')
const PerguntaModel = require('./database/Pergunta')
const RespostaModel = require('./database/Resposta')

//conexao com o banco de dados
//npm install --save sequelize
//npm install --save mysql2
database
    .authenticate()
    .then(() => {
        console.log("Successfully connected to database")
    }).catch(err => {
        console.log(err)
    })

//motor que vizualiza o html com o express usando outras libs
app.set('view engine', 'ejs') //npm install ejs 

//arquivos staticos para o node encontrar como css etc..
app.use(express.static('public'))

//config rota body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) //para trabalhar com dados em formato json

// app.get('/', (req, res) => res.send('Hello World!'))

//busca dentro do view automaticamente
app.get('/', (req, res) => {
    PerguntaModel.findAll({ //igual ao select
        raw: true,
        order: [
            ['id', 'DESC'] //ASC CRESCENTE || DESC DECRESCENTE
        ]
    }).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        })
    })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

//salvando dados no banco de dados
app.post('/salvarperguntas', (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    PerguntaModel.create({ //igual ao INSERT
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id
    PerguntaModel.findOne({ //busca 1 dados 
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) { //pergunta achada
            RespostaModel.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else { //nao encontrada
            res.redirect('/')
        }
    })
})

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    RespostaModel.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId)
    })
})

//port do servidor
app.listen(port, (err) => {
    if (err) {
        console.log('No server')
    } else {
        console.log('Server online on port' + ` http://localhost:${port}/`)
    }
})