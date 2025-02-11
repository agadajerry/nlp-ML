import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import pdfRoutes from "./routes/pdfRoutes";
import httperror from "http-errors";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class Server {
  constructor() {
    this.useMiddleware();
    this.useRoutes();
    this.useError();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  private useError() {
    app.use((req: Request, res: Response, next: NextFunction) => {
      next(httperror(404, "Not Found"));
    });
  }
  private useMiddleware() {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
  private useRoutes() {
    app.use("/api/pdf", pdfRoutes);
    app.get("", (req:Request,res:Response)=>{

        res.send({msg:"I am running"})

    })  
  }
}
new Server();

export default app;
