import { Router } from 'express'
import { validateRequest } from '../../middlewares'
import * as TodoHandlers from './todos.handlers'
import { Todo } from './todos.model'

const router = Router()

router.get('/', TodoHandlers.findAll)
router.post(
  '/',
  validateRequest({
    body: Todo,
  }),
  TodoHandlers.createOne
)

export default router
