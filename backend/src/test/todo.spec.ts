import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
import * as E from 'fp-ts/Either'
import { ITodo } from '../types/todo'
import { constTrue } from 'fp-ts/lib/function'

describe('Form test', () => {
    let server: FastifyInstance<Server, IncomingMessage, ServerResponse>

    beforeAll(async () => {
        await dbHandler.connect()
        server = startFastify(8888)
    })

    afterEach(async () => {
        await dbHandler.clearDatabase()
    })

    afterAll(async () => {
        E.match(
            (e) => console.log(e),
            (_) => console.log('Closing Fastify server is done!')
        )(
            E.tryCatch(
                () => {
                    dbHandler.closeDatabase()
                    server.close((): void => { })
                },
                (reason) => new Error(`Failed to close a Fastify server, reason: ${reason}`)
            )
        )
    })    

    // TODO: Add some test cases like CRUD, i.e. get, post, update, delete
    it('should successfully get a empty list of Todos', async () =>{
        const response = await server.inject({ 
            method:'GET', 
            url:'/api/todos'
        })
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(JSON.stringify({ todos:[]}))
    })

    it('should get todo item after input', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/todos',
            payload:{
                name: 'clean',
                description:'desk',
                status: false
            }
        })
    })

    

})
