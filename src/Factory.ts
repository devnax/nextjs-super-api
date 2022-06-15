import { parse as Parser } from 'regexparam'
import type { NextApiRequest, NextApiResponse } from "next";
import { HandlerType, RouteFactoryType, UseRouteFactoryType, MethodTypes, ParseType } from './types'


export default abstract class Factory {
   protected _req: NextApiRequest | null = null;
   protected _res: NextApiResponse | null = null
   protected routes: RouteFactoryType = {} as any
   protected use_routes: UseRouteFactoryType = {} as any
   protected middlewares: HandlerType[] = []
   protected basepath: string = __filename.split(/api\\(.*)\./)[1].replace(/\\/, "/")
   protected handlers: HandlerType[] = []
   public params: object = {}
   public catchError: ((err: any) => void) | null = null;
   protected _next_cb: Function = null as any


   protected formatHandlers(handlers: HandlerType[]) {
      const h: HandlerType[] = []
      for (let method of handlers) {
         h.push(method.bind(this))
      }
      return h
   }


   protected formatParams(path: string, result: ParseType) {
      let i = 0, _prams: any = {}
      let matches = result.pattern.exec(path)
      if (matches) {
         while (i < result.keys.length) {
            _prams[result.keys[i]] = matches[++i] || null
         }
      }
      return _prams
   }

   protected formatRoutes() {
      if (this._req && this._res) {
         const url = this._req.url?.split('?').shift() || ''
         const method = this._req.method?.toLowerCase() as MethodTypes || ''
         const routes = this.routes[method]
         const use_routes = this.use_routes
         const middlewares = this.middlewares
         let basepath = `api/${this.basepath}`
         basepath = basepath.replace(/\/$/, "")

         let handlers = [...middlewares], params: object = {}

         for (let path in use_routes) {
            const parse = Parser(basepath + path)
            if (parse.pattern.test(url)) {
               handlers = [...handlers, ...use_routes[path]]
               params = { ...params, ...this.formatParams(url, parse) }
               break
            }
         }

         for (let path in routes) {
            const parse = Parser(basepath + path)
            if (parse.pattern.test(url)) {
               handlers = [...handlers, ...routes[path]]
               params = { ...params, ...this.formatParams(url, parse) }
               break
            }
         }

         this.params = params
         this.handlers = handlers
      }

   }
}