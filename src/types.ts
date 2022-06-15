import type { NextApiRequest, NextApiResponse } from "next"


export type MethodTypes = "get" | "post" | "put" | "delete" | "connect" | "option" | "trace" | "patch"

export type HandlerType = (req: NextApiRequest, res: NextApiResponse, next?: HandlerType) => any;

export type RouteFactoryType = {
   [key in MethodTypes]: {
      [path: string]: HandlerType[]
   }
}
export type UseRouteFactoryType = {
   [key: string]: HandlerType[]
}


export type ParseType = {
   keys: string[];
   pattern: RegExp;
}