import { Router } from 'express';

const router = Router();

router.get("/api/products", (request, response) => {
    response.send([
        {id: 1, name: "demo1", price: 12.90},
        {id: 2, name: "demo2", price: 1.99},
        {id: 3, name: "demo3", price: 0.9},
    ]);
});

export default router;