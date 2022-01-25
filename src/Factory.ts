import { parse as Parser } from 'regexparam'


export default abstract class Factory {
   protected req:any = null
   protected res:any = null
   protected routes:any = {}
   protected use_routes:any = {}
   protected middlewares: Function[] = []
   protected basepath: string = ''
   protected handlers: Function[] = []
   public params: any = {}
   public catchError: any = {}
   public callback: any = null
   public next: any = {}


   protected formatHandlers(handlers: Function[]){
      const h:Function[] = []
      for(let method of handlers){
         h.push(method.bind(this))
      }
      return h
   }


   protected formatParams(path: string, result: any) {
      let i = 0, _prams: any = {}
      let matches = result.pattern.exec(path)
      while (i < result.keys.length) {
         _prams[result.keys[i]] = matches[++i] || null
      }
      return _prams
   }

   protected formatRoutes() {
      const url         = this.req.url
      const method      = this.req.method.toLowerCase()
      const routes      = this.routes[method]
      const use_routes  = this.use_routes
      const middlewares = this.middlewares
      const basepath    = this.basepath.replace(/\/$/, "")
      
      let handlers = [...middlewares], params: object = {}

      for (let path in use_routes) {
         const parse = Parser(basepath + path)
         if (parse.pattern.test(url)) {
            handlers = [...handlers, ...use_routes[path]]
            params   = {...params, ...this.formatParams(url, parse) }
            break
         }
      }

      for (let path in routes) {
         const parse = Parser(basepath + path)
         if (parse.pattern.test(url)) {
            handlers = [...handlers, ...routes[path]]
            params   = {...params, ...this.formatParams(url, parse) }
            break
         }
      }

      this.params = params
      this.handlers = handlers
   }
}