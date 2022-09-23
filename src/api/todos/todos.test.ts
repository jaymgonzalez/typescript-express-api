import request from 'supertest'

import app from '../../app'
import { Todos } from './todos.model'

beforeAll(async () => {
  try {
    await Todos.drop()
  } catch (err) {}
})

describe('GET /api/v1/todos', () => {
  it('respondss with an array of todos', async () =>
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
  it('responds with an error if the todo is invalid', async () =>
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
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TypeScript',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id')
        id = response.body._id
        expect(response.body).toHaveProperty('content')
        expect(response.body.content).toBe('Learn TypeScript')
        expect(response.body).toHaveProperty('done')
        expect(response.body.done).toBe(false)
      }))
})

describe('GET /api/v1/todos/:id', () => {
  it('responds with a single todo', async () =>
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
        expect(response.body.done).toBe(false)
      }))

  it('responds with an invalid object ID error', (done) => {
    request(app)
      .get('/api/v1/todos/invalid-id')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(422, done)
  })

  it('responds with a not found error', (done) => {
    request(app)
      .get('/api/v1/todos/632d617419847fa1f664d174')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done)
  })
})

describe('PUT /api/v1/todos/:id', () => {
  it('responds with a single todo', async () =>
    request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TypeScript',
        done: true,
      })
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

  it('responds with an invalid object ID error', (done) => {
    request(app)
      .put('/api/v1/todos/invalid-id')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(422, done)
  })

  it('responds with a not found error', (done) => {
    request(app)
      .put('/api/v1/todos/632d617419847fa1f664d174')
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TypeScript',
        done: true,
      })
      .expect('Content-Type', /html/)
      .expect(404, done)
  })
})

describe('DELETE /api/v1/todos/:id', () => {
  it('responds with an invalid object ID error', (done) => {
    request(app)
      .delete('/api/v1/todos/invalid-id')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(422, done)
  })

  it('responds with a not found error', (done) => {
    request(app)
      .delete('/api/v1/todos/632d617419847fa1f664d174')
      .set('Accept', 'application/json')
      .expect('Content-Type', /html/)
      .expect(404, done)
  })

  it('responds with a 204 status code', (done) => {
    request(app).delete(`/api/v1/todos/${id}`).expect(204, done)
  })

  it('responds with a not found error', (done) => {
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect(404, done)
  })
})
