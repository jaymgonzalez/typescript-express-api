import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsWithId } from '../../interfaces/ParamsWithId'
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

export async function findOne(
  req: Request<ParamsWithId, TodoWithId, {}>,
  res: Response<TodoWithId>,
  next: NextFunction
) {
  try {
    const result = await Todos.findOne({
      _id: new ObjectId(req.params.id),
    })
    if (!result) {
      res.status(404)
      throw new Error(`Todo with ID "${req.params.id}" not found`)
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function updateOne(
  req: Request<ParamsWithId, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction
) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _id = new ObjectId(req.params.id)
  try {
    const result = await Todos.updateOne(
      {
        _id,
      },
      {
        $set: req.body,
      }
    )
    if (result.matchedCount === 0) {
      res.status(404)
      throw new Error(`Todo with ID "${req.params.id}" not found`)
    }
    if (!result.acknowledged) {
      throw new Error(`Error updating Todo with ID "${req.params.id}".`)
    }
    res.json({
      _id,
      ...req.body,
    })
  } catch (err) {
    next(err)
  }
}
