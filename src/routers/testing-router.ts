import {Router} from "express";
import {TestingController} from "../controllers/testing-controller";
import {container} from "../composition-root";

const testingController = container.resolve(TestingController);
export const testingRouter = Router()

testingRouter.delete('/', testingController.deleteAll.bind(testingController))