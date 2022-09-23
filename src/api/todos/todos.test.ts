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
        expect(response.body).toHaveProperty('content')
        expect(response.body.content).toBe('Learn TypeScript')
        expect(response.body).toHaveProperty('done')
        expect(response.body.done).toBe(true)
      }))
})
