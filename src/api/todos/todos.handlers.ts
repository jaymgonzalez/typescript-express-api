import { NextFunction, Request, Response } from 'express'
import { InsertOneResult } from 'mongodb'
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
  req: Request<{}, InsertOneResult<Todo>, Todo>,
  res: Response<InsertOneResult>,
  next: NextFunction
) {
  try {
    const validateResult = await Todo.parse(req.body)
    const insertResult = await Todos.insertOne(validateResult)
    res.json(insertResult)
  } catch (err) {
    next(err)
  }
}
