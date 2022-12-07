/*********************************************************************
 * Objetivo: API responsável pela manipulacao de dados do Back-end
 *          (GET, POST, PUT, DELETE)
 * Autor: Nicolas Dobbeck
 * Data Criacao: 05/12/2022
 * Versao: 1.0
 * 
 * Versao: 2.0
 *      -Novas Implementacoes
 * 
 * Anotacoes: 
 *  //Para manipular o acesso a BD podemos utilizar o Prisma
    //Para instalar o prisma, devemos rodar os seguintes comandos
    //npm install prisma --save
    //npx prisma
    //npx prisma init
    //npm install @prisma/client
 *********************************************************************/

//Import das bibliotecas
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//arquivo de mensagens padronizadas
const { MESSAGE_ERROR, MESSAGE_SUCCESS } = require('./module/config.js');
const { request } = require('express');

const app = express();

//Configuracao de cors para liberar o acesso a API
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    app.use(cors());
    next();
});

//Criamos um objeto que permite receber um JSON no body das requisicoes
const jsonParser = bodyParser.json();


// ---------- EndPoint para inserir novo sabor de bebida ---------- //
app.post('/v1/saborBebida', cors(), jsonParser, async function (request, response) {
    let statusCode;
    let message;
    let headerContentType;

    //Reccebe o tipo de content-type que foi enviado no header da requisicao
    //application/json
    headerContentType = request.headers['content-type'];

    //Validar se o content-type é do tipo application/json
    if (headerContentType == 'application/json') {
        //Recebe do corpo da mensagem o conteudo
        let dadosBody = request.body;

        //Realiza um processo de conversao de dados para conseguir comparar o json vazio
        if (JSON.stringify(dadosBody) != '{}') {
            //imnport do arquivo da controller de sabor bebida
            const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');
            //Chama a funcao novoAluno da controller e encaminha os dados do body 
            const novoSaborBebida = await controllerSaborBebida.novoSaborBebida(dadosBody)
            statusCode = novoSaborBebida.status;
            message = novoSaborBebida.message;

        } else {
            statusCode = 400;
            message = MESSAGE_ERROR.EMPTY_BODY;
        }

    } else {
        statusCode = 415;
        message = MESSAGE_ERROR.CONTENT_TYPE;
    }

    response.status(statusCode);
    response.json(message);


});

// ---------- EndPoint para buscar sabor de bebida pelo ID---------- //
app.get('/v1/saborBebida/:id', cors(), async function (request, response) {

    let statusCode;
    let message;
    let id = request.params.id;

    //Validação do ID na requisição
    if (id != '' && id != undefined) {
        //import do arquivo controllerSaborBebida
        const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');

        //Retorna todos os sabores de bebidas existentes no BD
        const dadosSaborBebida = await controllerSaborBebida.buscarSaborBebida(id);

        //Valida se existe retorno de dados
        if (dadosSaborBebida) {   //Status 200
            statusCode = 200;
            message = dadosSaborBebida;
        } else {
            //Status 404
            statusCode = 404;
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }
    } else {
        statusCode = 400;
        message = MESSAGE_ERROR.REQUIRED_ID;
    }

    //Retorna os dados da API
    response.status(statusCode);
    response.json(message);

});

// ---------- EndPoint para listar todos os sabores existentes no BD---------- //
app.get('/v1/saboresBebidas', cors(), async function (request, response) {

    let statusCode;
    let message;

    //import do arquivo controllerSaborBebida
    const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');

    //Retorna todos os funcionarios existentes no BD
    const dadosSaboresBebidas = await controllerSaborBebida.listarSaboresBebidas();

    //Valida se existe retorno de dados
    if (dadosSaboresBebidas) {   //Status 200
        statusCode = 200;
        message = dadosSaboresBebidas;
    } else {
        //Status 404
        statusCode = 404;
        message = MESSAGE_ERROR.NOT_FOUND_DB
    }
    //console.log(message);
    //Retorna os dados da API
    response.status(statusCode);
    response.json(message);

});

// ---------- EndPoint para atualizar um sabor existente---------- //
app.put('/v1/saborBebida/:id', cors(), jsonParser, async function(request, response){
    let statusCode;
    let message;
    let headerContentType;

    //Reccebe o tipo de content-type que foi enviado no header da requisicao
        //application/json
    headerContentType = request.headers['content-type'];

    //Validar se o content-type é do tipo application/json
    if (headerContentType == 'application/json'){
        //Recebe do corpo da mensagem o conteudo
        let dadosBody = request.body;

        //Realiza um processo de conversao de dados para conseguir comparar o json vazio
        if (JSON.stringify(dadosBody) != '{}')
        {
            //Recebe o id enviado por parametro na requisição
            let id = request.params.id;
            
            //Validação do ID na requisição
            if (id != '' && id != undefined)
            {
                //Adiciona o id no JSON que chegou do corpo da requisição
                dadosBody.id = id;
                //imnport do arquivo da controller de sabor bebida
                const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');
                //Chama a funcao novoFuncionario da controller e encaminha os dados do body 
                const novoFuncionario = await controllerSaborBebida.atualizarSaborBebida(dadosBody);

                statusCode = novoFuncionario.status;
                message = novoFuncionario.message;
            }else{
                statusCode = 400;
                message = MESSAGE_ERROR.REQUIRED_ID;
            }

            
        }else{
            statusCode = 400;
            message = MESSAGE_ERROR.EMPTY_BODY;
        }

    }else{
        statusCode = 415;
        message = MESSAGE_ERROR.CONTENT_TYPE;
    }

    response.status(statusCode);
    response.json(message);

});



// ---------- EndPoint para excluir sabor existente---------- //
app.delete('/v1/saborBebida/:id', cors(), jsonParser, async function(request, response){
    let statusCode;
    let message;
    let id = request.params.id;
    
    //Validação do ID na requisição
    if (id !== '' && id !== undefined){
        //import do arquivo da controller de funcionario
        const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');
        
        //Chama a funcao para excluir um item 
        const saborBebida = await controllerSaborBebida.excluirSaborBebida(id);

        statusCode = saborBebida.status;
        message = saborBebida.message;

    }else{
        statusCode = 400;
        message = MESSAGE_ERROR.REQUIRED_ID;
    }

    response.status(statusCode);
    response.json(message);

});





// ---------- EndPoint para inserir novo tipo de bebida ---------- //
app.post('/v1/tipoBebida', cors(), jsonParser, async function (request, response) {
    let statusCode;
    let message;
    let headerContentType;

    //Reccebe o tipo de content-type que foi enviado no header da requisicao
    //application/json
    headerContentType = request.headers['content-type'];

    //Validar se o content-type é do tipo application/json
    if (headerContentType == 'application/json') {
        //Recebe do corpo da mensagem o conteudo
        let dadosBody = request.body;

        //Realiza um processo de conversao de dados para conseguir comparar o json vazio
        if (JSON.stringify(dadosBody) != '{}') {
            //imnport do arquivo da controller de sabor bebida
            const controllerTipoBebida = require('./controller/controller_tipo_bebida.js');
            //Chama a funcao novoAluno da controller e encaminha os dados do body 
            const novoTipoBebida = await controllerTipoBebida.novoTipoBebida(dadosBody)
            statusCode = novoTipoBebida.status;
            message = novoTipoBebida.message;

        } else {
            statusCode = 400;
            message = MESSAGE_ERROR.EMPTY_BODY;
        }

    } else {
        statusCode = 415;
        message = MESSAGE_ERROR.CONTENT_TYPE;
    }

    response.status(statusCode);
    response.json(message);


});

// ---------- EndPoint para buscar tipo de bebida pelo ID---------- //
app.get('/v1/saborBebida/:id', cors(), async function (request, response) {

    let statusCode;
    let message;
    let id = request.params.id;

    //Validação do ID na requisição
    if (id != '' && id != undefined) {
        //import do arquivo controllerSaborBebida
        const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');

        //Retorna todos os sabores de bebidas existentes no BD
        const dadosSaborBebida = await controllerSaborBebida.buscarSaborBebida(id);

        //Valida se existe retorno de dados
        if (dadosSaborBebida) {   //Status 200
            statusCode = 200;
            message = dadosSaborBebida;
        } else {
            //Status 404
            statusCode = 404;
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }
    } else {
        statusCode = 400;
        message = MESSAGE_ERROR.REQUIRED_ID;
    }

    //Retorna os dados da API
    response.status(statusCode);
    response.json(message);

});

// ---------- EndPoint para listar todos os tipos de bebida existentes no BD---------- //
app.get('/v1/saboresBebidas', cors(), async function (request, response) {

    let statusCode;
    let message;

    //import do arquivo controllerSaborBebida
    const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');

    //Retorna todos os funcionarios existentes no BD
    const dadosSaboresBebidas = await controllerSaborBebida.listarSaboresBebidas();

    //Valida se existe retorno de dados
    if (dadosSaboresBebidas) {   //Status 200
        statusCode = 200;
        message = dadosSaboresBebidas;
    } else {
        //Status 404
        statusCode = 404;
        message = MESSAGE_ERROR.NOT_FOUND_DB
    }
    //console.log(message);
    //Retorna os dados da API
    response.status(statusCode);
    response.json(message);

});

// ---------- EndPoint para atualizar um tipo de bebida existente---------- //
app.put('/v1/saborBebida/:id', cors(), jsonParser, async function(request, response){
    let statusCode;
    let message;
    let headerContentType;

    //Reccebe o tipo de content-type que foi enviado no header da requisicao
        //application/json
    headerContentType = request.headers['content-type'];

    //Validar se o content-type é do tipo application/json
    if (headerContentType == 'application/json'){
        //Recebe do corpo da mensagem o conteudo
        let dadosBody = request.body;

        //Realiza um processo de conversao de dados para conseguir comparar o json vazio
        if (JSON.stringify(dadosBody) != '{}')
        {
            //Recebe o id enviado por parametro na requisição
            let id = request.params.id;
            
            //Validação do ID na requisição
            if (id != '' && id != undefined)
            {
                //Adiciona o id no JSON que chegou do corpo da requisição
                dadosBody.id = id;
                //imnport do arquivo da controller de sabor bebida
                const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');
                //Chama a funcao novoFuncionario da controller e encaminha os dados do body 
                const novoFuncionario = await controllerSaborBebida.atualizarSaborBebida(dadosBody);

                statusCode = novoFuncionario.status;
                message = novoFuncionario.message;
            }else{
                statusCode = 400;
                message = MESSAGE_ERROR.REQUIRED_ID;
            }

            
        }else{
            statusCode = 400;
            message = MESSAGE_ERROR.EMPTY_BODY;
        }

    }else{
        statusCode = 415;
        message = MESSAGE_ERROR.CONTENT_TYPE;
    }

    response.status(statusCode);
    response.json(message);

});



// ---------- EndPoint para excluir tipo de bebida existente---------- //
app.delete('/v1/saborBebida/:id', cors(), jsonParser, async function(request, response){
    let statusCode;
    let message;
    let id = request.params.id;
    
    //Validação do ID na requisição
    if (id !== '' && id !== undefined){
        //import do arquivo da controller de funcionario
        const controllerSaborBebida = require('./controller/controller_sabor_bebida.js');
        
        //Chama a funcao para excluir um item 
        const saborBebida = await controllerSaborBebida.excluirSaborBebida(id);

        statusCode = saborBebida.status;
        message = saborBebida.message;

    }else{
        statusCode = 400;
        message = MESSAGE_ERROR.REQUIRED_ID;
    }

    response.status(statusCode);
    response.json(message);

});




//Ativa o servidor para receber requisicoes HTTP
app.listen(5050, function () {
    console.log('Servidor aguardando requisicoes! :)');
});