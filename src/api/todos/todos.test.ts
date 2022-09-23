import request from 'supertest'

import app from '../../app'
import { Todos } from './todos.model'

beforeAll(async () => {
  try {
    await Todos.drop()
  } catch (err) {}
})

describe('GET /api/v1/todos', () => {
  it('responds with an array of todos', async () =>
    request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toHaveProperty('length')
        expect(response.body.length).toBe(0)
      }))
})

describe('POST /api/v1/todos', () => {
  it('respond with an error if the todo is invalid', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: '',
      })
      .expect('Content-Type', /html/)
      .expect(422)
      .then((response) => {
        expect(response.text).toContain('<title>Error</title>')
      }))
})

let id: string = ''
describe('POST /api/v1/todos', () => {
  it('respond with an inserted object', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TypeScript',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id')
        id = response.body._id
        expect(response.body).toHaveProperty('content')
        expect(response.body.content).toBe('Learn TypeScript')
        expect(response.body).toHaveProperty('done')
        expect(response.body.done).toBe(true)
      }))
})

describe('GET /api/v1/todos/:id', () => {
  it('respond with a single todo', async () =>
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toBe(id)
        expect(response.body).toHaveProperty('content')
        expect(response.body.content).toBe('Learn TypeScript')
        expect(response.body).toHaveProperty('done')
        expect(response.body.done).toBe(true)
      }))

  it('respond with an invalid object ID error', (done) => {
    request(app)
      .get('/api/v1/todos/invalid-id')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(422, done)
  })

  it('respond with a not found error', (done) => {
    request(app)
      .get('/api/v1/todos/632d617419847fa1f664d174')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done)
  })
})
