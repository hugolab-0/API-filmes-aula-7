/**
 * Objetivo: arquivo responsavel pela configuração e padronização das mensagens da API
 * Data: 17-04-2026
 * autor: hugo
 * versão: 1.0
 **/

// ======================== PADRÃO DE RESPOSTA ========================
// Este objeto serve como BASE para todas as respostas da API.
// Ele garante que todas as respostas sigam o mesmo formato (padronização),
// facilitando o entendimento tanto no backend quanto no frontend.
const DEFAULT_MESSAGE = {
    api_description: 'API para gerenciar o controle de filmes', // descrição geral do que a API faz
    development:     'Hugo Alves Vieira', // nome do desenvolvedor responsável
    version:         '1.0.4.26', // versão atual da API (controle de versionamento)

    status: Boolean,      // indica se a requisição deu certo (true) ou erro (false)
    status_code: Number,  // código HTTP correspondente (200, 201, 400, 500, etc.)
    response: {}          // objeto onde serão armazenados os dados retornados (ex: lista de filmes, filme específico, etc.)
}


// ======================== ERRO 400 ========================
// Usado quando os dados enviados pelo cliente estão inválidos,
// incompletos ou fora do padrão esperado.
const ERROR_BAD_REQUEST = {
    status: false, 
    status_code: 400, 
    message:'Os dados enviados na requisição não estão corretos...'
}


// ======================== SUCESSO 201 ========================
// Usado quando um novo registro é criado com sucesso no banco de dados
// (ex: inserção de um novo filme).
const SUCESS_CREATED_ITEM = {
    status: true, 
    status_code: 201, 
    message: 'requisitos inseridos com sucesso'
} 


// ======================== ERRO 500 (MODEL) ========================
// Usado quando ocorre um erro na camada de model (banco de dados),
// como falha na query SQL, conexão, etc.
const ERROR_INTERNAL_SERVER_MODEL = {
    status: false, 
    status_code: 500, 
    message:'Não foi possivel processar a requisição por conta de erro na modelagem de dados.'
}


// ======================== ERRO 415 ========================
// Usado quando o tipo de conteúdo da requisição (Content-Type)
// não é suportado pela API (ex: não é JSON).
const ERROR_CONTENT_TYPE = {
    status: false, 
    status_code: 415, 
    message:'Não foi possivel processar a requisição, pois formato de dados aceito pela api é somente json.'
}


// ======================== ERRO 500 (CONTROLLER) ========================
// Usado quando ocorre erro na camada de controle (lógica da aplicação),
// como exceções inesperadas durante o processamento.
const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: false, 
    status_code: 500, 
    message:'Não foi possivel processar a requisição por conta de erro no controle de dados.'
}


// ======================== ERRO 404 ========================
// Usado quando nenhum dado é encontrado (ex: ID inexistente no banco).
const ERROR_NOT_FOUND = {   
    status: false, 
    status_code: 404, 
    message:'Não foi possivel encontrar nenhum dado para retorno.'
}


// ======================== SUCESSO 200 ========================
// Usado para respostas bem-sucedidas de leitura (GET),
// quando os dados são retornados corretamente.
const SUCESS_RESPONSE = {
    status: true,
    status_code: 200
}


// ======================== SUCESSO UPDATE ========================
// Usado quando um registro é atualizado com sucesso no banco.
const SUCESS_UPDATE_ITEM = {
    status: true,
    status_code: 200,
    message: 'registro atualizado com sucesso!'
}

const SUCESS_DELETE_ITEM = {
    status: true, 
    status_code: 200, 
    message: 'Item excluido com sucesso!'
} 


// ======================== EXPORTAÇÃO ========================
// Exporta todos os objetos para serem utilizados em outros arquivos,
// como controllers e models, garantindo padronização nas respostas da API.
module.exports = {
    ERROR_BAD_REQUEST,
    SUCESS_CREATED_ITEM,
    DEFAULT_MESSAGE,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_NOT_FOUND,
    SUCESS_RESPONSE,
    SUCESS_UPDATE_ITEM,
    SUCESS_DELETE_ITEM

}