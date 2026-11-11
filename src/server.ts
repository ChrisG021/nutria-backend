import { buildApp } from "./app.ts";
import 'dotenv/config'
const app = await buildApp();

try {
    await app.listen({
        port: 3333,
        host: "0.0.0.0",
    });
} catch (error) {
    app.log.error(error);
    process.exit(1);
}