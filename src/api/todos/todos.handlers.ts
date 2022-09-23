import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { Todo, Todos, TodoWithId } from './todos.model'

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

export async function createOne(
  req: Request<{}, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction
) {
  try {
    const validateResult = await Todo.parseAsync(req.body)
    const insertResult = await Todos.insertOne(validateResult)
    if (!insertResult.acknowledged) throw new Error('Error inserting ToDo')
    res.status(201)
    res.json({
      _id: insertResult.insertedId,
      ...validateResult,
    })
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(422)
    }
    next(err)
  }
}
