import Handler from "./Handler"
import { HandlerType, MethodTypes } from './types'

export default class Router extends Handler {


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

   public get(path: string, ...handlers: HandlerType[]) {
      this.assign('get', path, handlers);
   }

   public post(path: string, ...handlers: HandlerType[]) {
      this.assign('post', path, handlers);
   }

   public put(path: string, ...handlers: HandlerType[]) {
      this.assign('put', path, handlers);
   }

   public delete(path: string, ...handlers: HandlerType[]) {
      this.assign('delete', path, handlers);
   }

   public connect(path: string, ...handlers: HandlerType[]) {
      this.assign('connect', path, handlers);
   }

   public option(path: string, ...handlers: HandlerType[]) {
      this.assign('option', path, handlers);
   }

   public trace(path: string, ...handlers: HandlerType[]) {
      this.assign('trace', path, handlers);
   }

   public patch(path: string, ...handlers: HandlerType[]) {
      this.assign('patch', path, handlers);
   }

}