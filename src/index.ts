import Handler from "./Handler"
import { HandlerType, MethodTypes, RouterType } from './types'

export type {RouterType}

export default class Router<Type extends RouterType = any> extends Handler<Type> {


   private assign(method_name: MethodTypes, path: string, methods: HandlerType[]) {
      if (!this.routes[method_name]) {
         this.routes[method_name] = {}
      }
      this.routes[method_name][path] = methods
   }

   public use(path: string | HandlerType, ...methods: HandlerType[]) {
      if (typeof path == 'string') {
         this.use_routes[path] = methods
      } else {
         this.middlewares = [...this.middlewares, path.bind(this), ...methods]
      }
   }

   public get(path: Type['routes']['get'], handler: HandlerType,  ...handlers: HandlerType[]) {
      this.assign('get', path as string, [handler, ...handlers]);
   }

   public post(path: Type['routes']['post'], handler: HandlerType, ...handlers: HandlerType[]) {
      this.assign('post', path as string, [handler, ...handlers]);
   }

   public put(path: Type['routes']['put'], handler: HandlerType, ...handlers: HandlerType[]) {
      this.assign('put', path as string, [handler, ...handlers]);
   }

   public delete(path: Type['routes']['delete'], handler: HandlerType, ...handlers: HandlerType[]) {
      this.assign('delete', path as string, [handler, ...handlers]);
   }

   public connect(path: Type['routes']['connect'], handler: HandlerType, ...handlers: HandlerType[]) {
      this.assign('connect', path as string, [handler, ...handlers]);
   }

   public option(path: Type['routes']['option'], handler: HandlerType, ...handlers: HandlerType[]) {
      this.assign('option', path as string, [handler, ...handlers]);
   }

   public trace(path: Type['routes']['trace'], handler: HandlerType, ...handlers: HandlerType[]) {
      this.assign('trace', path as string, [handler, ...handlers]);
   }

   public patch(path: Type['routes']['patch'], handler: HandlerType, ...handlers: HandlerType[]) {
      this.assign('patch', path as string, [handler, ...handlers]);
   }

}