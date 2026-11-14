import { FastifyInstance } from "fastify";
import { MealsService } from "../services/meals.service";

export default function MealsRoutes(app: FastifyInstance) {
    const service = new MealsService(app);

    app.get<{ Params: { userid: string } }>("/:userid", async (request, reply) => {
        const userid = request.params.userid;
        const result = await service.getMeals(userid);
        return reply.code(200).send({result});
    })

}