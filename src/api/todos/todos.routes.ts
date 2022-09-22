import { Router, Request, Response } from 'express'
import { Todos, TodoWithId } from './todos.model'

const router = Router()

router.get('/', async (req: Request, res: Response<TodoWithId[]>) => {
  const result = Todos.find()
  res.json(await result.toArray())
})

export default router
