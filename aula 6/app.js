// ======================== IMPORTS ========================

// Importa o framework Express, utilizado para criar a API (rotas, servidor, etc.)
const express       = require('express')

// Importa o CORS, que permite controlar quais origens podem acessar a API
const cors          = require('cors')

// Importa o body-parser, utilizado para interpretar dados enviados no corpo da requisição (body)
const bodyParser    = require('body-parser')


// ======================== CONTROLLER ========================

// Importa a controller de filmes, que contém as regras de negócio (validação, lógica, etc.)
const controllerFilme = require('./controller/filme/controller_filmes.js')


// ======================== CONFIG BODY ========================

// Cria um middleware para permitir que a API receba e interprete JSON no body das requisições
const bodyParserJSON = bodyParser.json()


// ======================== APP ========================

// Cria a instância do Express (objeto principal da API)
const app =  express()


// ======================== CONFIG CORS ========================

// Define as regras de acesso da API (quem pode acessar e como)
const corsOptions = {
    origin: ['*'], // Permite acesso de qualquer origem ("*" = todos)
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // Define quais métodos HTTP são permitidos
    allowedHeaders: ['content-type', 'autorization'] // Define quais headers são permitidos (OBS: "authorization" está com erro de digitação)
}

// Aplica as configurações de CORS na aplicação
app.use(cors(corsOptions))


// ======================== ENDPOINT: INSERT ========================

// Endpoint para cadastrar (inserir) um novo filme
app.post('/v1/senai/locadora/filme', bodyParserJSON, async function(req, res){

    // Recebe os dados enviados no body da requisição (JSON)
    let dados = req.body
 
    // Captura o content-type do header da requisição
    let contentType = req.headers['content-type']

    // Envia os dados para a controller realizar validação e inserção
    let result = await controllerFilme.inserirNovoFilme(dados, contentType)

    // Define o status HTTP da resposta
    res.status(result.status_code)

    // Retorna o resultado em formato JSON
    res.json(result)
})


// ======================== ENDPOINT: SELECT ALL ========================

// Endpoint para listar todos os filmes
app.get('/v1/senai/locadora/lista/filme', async function(req, res) {

    // Chama a controller para buscar todos os filmes
    let result = await controllerFilme.listaFilme()

    // Define status HTTP
    res.status(result.status_code)

    // Retorna os dados
    res.json(result)
    
})


// ======================== ENDPOINT: SELECT BY ID ========================

// Endpoint para buscar um filme específico pelo ID
app.get('/v1/senai/locadora/filme/:id', async function(req, res) {

    // Captura o ID enviado na URL
    let id = req.params.id
    
    // Chama a controller para buscar o filme
    let result = await controllerFilme.buscarFilme(id)

    // Define status HTTP
    res.status(result.status_code)

    // Retorna o resultado
    res.json(result)
    
})


// ======================== ENDPOINT: UPDATE ========================

// Endpoint para atualizar um filme 
// OBS: Está apenas declarado, sem função callback
app.put('/v1/senai/locadora/filme/:id', bodyParserJSON, async function(req, res) {

    // Captura o Content-Type enviado no header da requisição
    // Exemplo: application/json
    let contentType = req.headers['content-type']

    // Captura o ID que vem na URL (parâmetro de rota)
    // Exemplo: /filme/10 → id = 10
    let id = req.params.id

    // Captura os dados enviados no corpo da requisição (body)
    // Esses dados geralmente vêm em formato JSON
    let dados = req.body

    // Chama a função da controller responsável por atualizar o filme
    // Envia:
    // - dados atualizados (body)
    // - id do registro (parâmetro da rota)
    // - content-type (validação)
    // OBS: a ordem dos parâmetros precisa ser igual à da função na controller
    let result = await controllerFilme.atualizarFilme(dados, id, contentType)

    // Define o status HTTP da resposta (ex: 200, 400, 500)
    res.status(result.status_code)

    // Retorna a resposta em formato JSON para o cliente
    res.json(result)
})


app.delete('/v1/senai/locadora/lista/filme/:id', async function(req, res) {
    let id = req.params.id

    let result = await controllerFilme.deletarFilme(id)

        res.status(result.status_code)
        res.json(result)
})



// ======================== SERVER ========================

// Inicializa o servidor na porta 8080
// A API ficará disponível em: http://localhost:8080
app.listen(8080, function(){

    // Mensagem exibida no console quando o servidor inicia
    console.log('arquivo pronto')
})