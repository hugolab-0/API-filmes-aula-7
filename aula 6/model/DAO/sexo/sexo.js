// Import da biblioteca knex, utilizada para facilitar a comunicação com o banco de dados MySQL
const knex = require('knex')

// Import do arquivo de configuração que contém as credenciais e parâmetros de conexão com o banco
const knexConfig = require('../../database_config_knex/knexFile.js')

// Cria a conexão com o banco de dados utilizando as configurações do ambiente "development"
const knexConex = knex(knexConfig.development)


// ======================== INSERT ========================
// Função responsável por inserir um novo registro (sexo) na tabela tbl_sexo
const insertSexo = async function(sexo){
    try {
        
        // Monta manualmente a instrução SQL de INSERT utilizando template string
        // Os dados do objeto "sexo" são inseridos diretamente na query
        let sql = `insert into tbl_sexo (
                            nome, 
                            sigla
                            )
                    values (
                            '${sexo.nome}', 
                            '${sexo.sigla}'
                            );`

        // Executa o SQL diretamente no banco de dados
        // O "await" faz com que o código espere o banco responder antes de continuar
        let result = await knexConex.raw(sql)

        // Se houve retorno do banco, considera sucesso
        if(result)
            return result[0].insertId
        else
            return false

    } catch (error) {
        // Exibe o erro no console para debug
        console.log(error)

        // Retorna false indicando falha
        return false
    }
}


// ======================== UPDATE ========================
// Função responsável por atualizar os dados de um sexo existente
const updateSexo = async function(sexo){

    try {
        // Monta o SQL de UPDATE com os novos dados do sexo
        let sql = `update tbl_sexo set 
        nome = '${sexo.nome}',
        data_lancamento = '${sexo.data_lancamento}',
        duracao = '${sexo.duracao}',
        sinopse = '${sexo.sinopse}', 
        avaliacao = if('${sexo.avaliacao}' = '', null, '${sexo.avaliacao}'), 
        valor = '${sexo.valor}', 
        capa = '${sexo.capa}'

        where id = '${sexo.id}';` // atualiza sempre o ID 

        // Executa o SQL no banco
        let result = await knexConex.raw(sql)

        // Verifica retorno
        if(result) {
            return true
        }else{
            return false
        }
        
    } catch (error) {
        // Em caso de erro, retorna false
        return false
    }
   
}


// ======================== SELECT ALL ========================
// Função para buscar todos os sexos cadastrados no banco
const selectAllSexo = async function(){
    try {
        // Query SQL para selecionar todos os registros da tabela
        // "order by id desc" ordena do maior ID para o menor (mais recente primeiro)
        let sql = `select * from tbl_sexo order by id desc`

        // Executa a query no banco
        let result = await knexConex.raw(sql)
        
        // Verifica se o retorno é um array (formato esperado do knex)
        if(Array.isArray(result)){
            // O resultado real vem na posição [0]
            return result[0]
        }else{
            // Caso não seja array, considera erro
            return false
        }
    } catch (error) {
        // Em caso de erro, retorna false
        return false
    }
}


// ======================== SELECT BY ID ========================
// Função para buscar um sexo específico pelo ID
const selectByIdSexo = async function(id){
    try {
        // Query SQL para buscar um registro filtrando pelo ID
        let sql =  `select * from tbl_sexo where id=${id}`

        // Executa no banco
        let result = await knexConex.raw(sql)

        // Verifica se retornou array
        if(Array.isArray(result)) {
            return result[0]
        }else {
            return false
        }

    } catch (error) {
        // Em caso de erro, retorna false
        return false
    }
}


// ======================== DELETE ========================
// Função para deletar um sexo pelo ID (ainda não implementada)
const deleteSexo = async function(id){

    try {
    let sql =  `delete from tbl_sexo where id= ${id};`

    let result = await knexConex.raw(sql)
        if(result) {
            return true 
        }else {
            return false
        }
    } catch (error) {
        return false
    }


   
}


// Exporta todas as funções para serem utilizadas em outros arquivos (ex: controller)
module.exports = {
    insertSexo,
    updateSexo,
    selectAllSexo,
    selectByIdSexo,
    deleteSexo
}