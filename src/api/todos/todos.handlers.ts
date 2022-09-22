import { NextFunction, Request, Response } from 'express'
import { Todos, TodoWithId } from './todos.model'

export async function findAll(
  req: Request,
  res: Response<TodoWithId[]>,
  next: NextFunction
) {
  try {
    const result = Todos.find()
    res.json(await result.toArray())
  } catch (err) {
    next(err)
  }
}
