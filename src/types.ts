import type { NextApiRequest, NextApiResponse } from "next"
import {StatusCodeType} from './StatusCode'


export type ValueOf<T> = T[keyof T];

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


export interface RouterType{
   routes: Partial<{[key in MethodTypes]: string}>,
   response: string | object;
   statusCodes: StatusCodeType;
   query: {[key: string]: string | string[]};
   params: {[key: string]: string | string[]};
   body: any;
}