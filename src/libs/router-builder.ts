import { Request, Response, Router } from "express";

export type EndpointMethod = "get" | "post" | "put" | "delete" | "patch";

export class HandlingError {
  constructor(public status: string) {}
};

export type EndpointResponse = {
  success: boolean;
  status: string;
  [key: string]: any;
};

export const createRouter = () => {
  const router = Router();

  const builder = {
    addEndpoint: (
      path: string,
      method: EndpointMethod,
      handler: (parameters: {
        [key: string]: any;
        _req?: Request;
        _res?: Response;
      }) => Promise<EndpointResponse>
    ) => {
      router[method](path, async (req, res) => {
          try {
              const response = await handler({ ...req.body, _req: req, _res: res });
              res.send(response)
          } catch (e) {

              if (e instanceof HandlingError) {
                res.send({
                    success: false,
                    status: e.status,
                })
              }
          }
      });
      return builder;
    },
    build: () => {
      return router;
    },
  };
  return builder;
};
