import {testingMongoRepository} from "../repositories/testing-mongo-repozitory";
import {Request, Response} from "express";

export const testingController = async (req: Request, res: Response) => {
    await testingMongoRepository.deleteAllData()
    res
        .status(204)
        .json({message: 'Attention the database has been cleared'})
}