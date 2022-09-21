import { Router, Request, Response } from 'express'
import Todo from './todos.model'

const router = Router()

router.get('/', (req: Request, res: Response<Todo[]>) => {
  res.json([
    {
      content: 'WOW',
      done: false,
    },
  ])
})

export default router
