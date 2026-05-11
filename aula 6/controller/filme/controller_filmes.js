/************
 * Objetivo: Arquivo responsavel pela validação, tratamento 
 *           e manipulação de dados para o CRUD de filmes
 * 
 * data: 17/04/2026
 * autor: Hugo 
 * Versão: 1.0
 *************/


// Importa o objeto que contém todas as mensagens padrão da API,
// como erros (400, 500, etc.) e mensagens de sucesso.
// Isso ajuda a padronizar as respostas do sistema.
const config_message = require('../modulo/configMensagens.js')

// Importa o DAO (Data Access Object), que é responsável por
// acessar diretamente o banco de dados e executar as operações CRUD.
const filmeDAO = require('../../model/DAO/filme/filme.js')

// Importação do body-parser (não está sendo utilizado diretamente neste arquivo,
// mas geralmente serve para trabalhar com requisições JSON no Node.js)
const { json } = require('body-parser')


// ======================== INSERT ========================
// Função responsável por inserir um novo filme no banco
const inserirNovoFilme = async function(filme, contentType) {

    // Cria uma cópia do objeto de mensagens para evitar alterar o original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        
        // Verifica se o tipo de conteúdo da requisição é JSON
        // Isso é importante para garantir que os dados estejam no formato correto
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Chama a função de validação dos dados do filme
            let validar = await validarDados(filme)

            // Se a validação retornar algo, significa que houve erro
            if(validar) {
                return validar
            }else{ 
                // Se passou na validação, envia os dados para o DAO inserir no banco
                let result = await filmeDAO.insertFilme(filme)

                

                // Se o DAO retornou sucesso
                if(result) { // 201 - criado com sucesso
                    filme.id = id
                    message.DEFAULT_MESSAGE.status = message.SUCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = filme
                }
                else{ 
                    // Erro ao inserir no banco (camada model)
                    return  message.ERROR_INTERNAL_SERVER_MODEL
                }

                // Retorna a resposta padrão de sucesso
                return message.DEFAULT_MESSAGE
            }
        }else {
            // Caso o content-type não seja JSON
            return message.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        // Caso ocorra algum erro inesperado no controller
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// ======================== UPDATE ========================
// Função responsável por atualizar um filme existente
const atualizarFilme = async function(filme, id, contentType) {

    // Clona as mensagens padrão
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        
        // Verifica o content-type
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Busca o filme pelo ID antes de atualizar
            let resultBuscarId = await buscarFilme(id)

            // Se encontrou o filme (status true)
            if(resultBuscarId.status) {

                // Valida os novos dados enviados
                let validar = await validarDados(filme)

                // Se não houver erro de validação
                if(!validar) {

                    // Adiciona o ID ao objeto filme para enviar ao DAO
                    filme.id = id

                    // Chama o DAO para atualizar os dados no banco
                    let result = await filmeDAO.updateFilme(filme)

                    // Se atualizou com sucesso
                    if(result) {
                        message.DEFAULT_MESSAGE.status = message.SUCESS_UPDATE_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message = message.SUCESS_UPDATE_ITEM.message

                        return message.DEFAULT_MESSAGE
                    }else {
                        // Erro no banco
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }

                }else {
                    // Retorna erro de validação
                    return validar
                }

            }else {
                // Retorna erro da busca (filme não encontrado ou erro)
                return resultBuscarId
            }
        }else {
            // Content-type inválido
            return message.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        // Erro inesperado no controller
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
        
    }
    
}


// ======================== SELECT ALL ========================
// Função responsável por listar todos os filmes
const listaFilme = async function() {

    // Clona as mensagens
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        // Chama o DAO para buscar todos os filmes
        let result = await filmeDAO.selectAllFilme()

        // Verifica se houve retorno
        if(result) {
            if(result.length > 0) {

                // Define status de sucesso
                message.DEFAULT_MESSAGE.status = message.SUCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCESS_RESPONSE.status_code

                // Define quantidade de registros encontrados
                // OBS: este valor é sobrescrito na linha abaixo
                message.DEFAULT_MESSAGE.response.result = result.length

                // Define os dados retornados (lista de filmes)
                message.DEFAULT_MESSAGE.response.result = result

                return message.DEFAULT_MESSAGE

            }else {
                // Nenhum filme encontrado
                return message.ERROR_NOT_FOUND
            }

        }else {
            // Erro ao acessar o banco
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        // Erro no controller
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}

const deletarFilme = async function(id) {
      // Clona as mensagens padrão
      let message = JSON.parse(JSON.stringify(config_message))

      try {

        let resultValidarID= await buscarFilme(id)

        if(resultValidarID.status) {

            let result = await filmeDAO.deleteFilme(id)

            if(result) {
                message.DEFAULT_MESSAGE.status = message.SUCESS_DELETE_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCESS_DELETE_ITEM.status_code
                message.DEFAULT_MESSAGE.message = message.SUCESS_DELETE_ITEM.message

                return message.DEFAULT_MESSAGE
            }else {
                return message.ERROR_BAD_REQUEST
            }

        }else {
            return resultValidarID
        }
      } catch (error) {
        return false
      }
    
}

// ======================== SELECT BY ID ========================
// Função para buscar um filme específico pelo ID
const buscarFilme = async function(id) {

    // Clona as mensagens
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        // Valida o ID recebido
        if(id == '' || id == null || id == undefined || isNaN(id)) {

            // Define qual campo está inválido
            message.ERROR_BAD_REQUEST.field = '[ID] INVALIDO'

            return message.ERROR_BAD_REQUEST //400

        }else{
            // Busca o filme no banco pelo ID
            let result = await filmeDAO.selectByIdFilme(id)

            // Exibe no console para debug (visualizar retorno do banco)
            console.log(result)

            // Verifica se o DAO retornou algo
            if(result) {
                if(result.length > 0) {

                    // Preenche resposta de sucesso
                    message.DEFAULT_MESSAGE.status = message.SUCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.filme = result

                    return message.DEFAULT_MESSAGE
                }else {
                    // Filme não encontrado
                    return message.ERROR_NOT_FOUND
                }
            }else {
                // Erro no banco
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }
        
    } catch (error) {
        // Erro inesperado no controller
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}



// ======================== VALIDAÇÃO ========================
// Função responsável por validar todos os campos do filme antes de inserir/atualizar
const validarDados = async function(filme) {

    // Clona as mensagens
    let message = JSON.parse(JSON.stringify(config_message))

    // ======================== VALIDAÇÕES ========================

    // Validação do nome (não pode ser vazio, nulo, undefined ou maior que 80 caracteres)
    if(filme.nome == '' || filme.nome == null || filme.nome.length > 80 || filme.nome == undefined) {
        message.ERROR_BAD_REQUEST.field =  '[NOME] INVALIDO'
        return message.ERROR_BAD_REQUEST
    }

    // Validação da data de lançamento (espera formato tipo YYYY-MM-DD com 10 caracteres)
    else if(filme.data_lancamento == undefined || filme.data_lancamento.length != 10 || filme.data_lancamento == null || filme.data_lancamento == '') {
        message.ERROR_BAD_REQUEST.field = '[DATA_LANCAMENTO] INVALIDA'
        return message.ERROR_BAD_REQUEST
    }

    // Validação da duração (mínimo de 5 caracteres, ex: "02:30")
    else if(filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length < 5) {
        message.ERROR_BAD_REQUEST.field = '[DURACAO] INVALIDA'
        return message.ERROR_BAD_REQUEST
    }

    // Validação da sinopse (não pode ser vazia ou nula)
    else if(filme.sinopse == '' || filme.sinopse == null || filme.sinopse == undefined ) {
        message.ERROR_BAD_REQUEST.field = '[SINOPSE] INVALIDA'
        return message.ERROR_BAD_REQUEST
    }

    // Validação da avaliação (deve ser número e com no máximo 3 caracteres)
    else if(isNaN(filme.avaliacao) || filme.avaliacao.length > 3) {
        message.ERROR_BAD_REQUEST.field = '[AVALIACAO] INVALIDA'
        return message.ERROR_BAD_REQUEST
    }

    // Validação do valor (não pode ser vazio, deve ser número e parte inteira até 3 dígitos)
    else if(filme.valor == '' || filme.valor == null || filme.valor == undefined || filme.valor.split('.')[0].length > 3 || isNaN(filme.valor)) {
        message.ERROR_BAD_REQUEST.field = '[VALOR] INVALIDA'
        return message.ERROR_BAD_REQUEST
    }

    // Validação da capa (limite de tamanho do campo)
    else if(filme.capa.length > 255){
        message.ERROR_BAD_REQUEST.field = '[CAPA] INVALIDA'
        return message.ERROR_BAD_REQUEST
    }else {
        // Se passou por todas as validações, retorna false (sem erro)
        return false
    }
}


// Exporta as funções para serem utilizadas em outros arquivos (ex: controller ou rotas)
module.exports = {
    inserirNovoFilme,
    buscarFilme,
    listaFilme,
    atualizarFilme,
    deletarFilme
}