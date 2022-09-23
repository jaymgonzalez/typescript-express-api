import { NextFunction, Request, Response } from 'express'
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
    const insertResult = await Todos.insertOne(req.body)
    if (!insertResult.acknowledged) throw new Error('Error inserting ToDo')
    res.status(201)
    res.json({
      _id: insertResult.insertedId,
      ...req.body,
    })
  } catch (err) {
    next(err)
  }
}
