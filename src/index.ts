import Handler from "./Handler"

export default class Router extends Handler{


   private assign(method_name: string, path:string, methods: Function[]){
      if(!this.routes[method_name]){
         this.routes[method_name] = {}
      }
      this.routes[method_name][path] =  methods
   }

   public use(path: string | Function, ...methods: Function[]){
      //methods = this.formatHandlers(methods)

      if(typeof path == 'string'){
         this.use_routes[path] =  methods
      }else{
         this.middlewares = [...this.middlewares, path.bind(this), ...methods ]
      }
   }

   public get(path: string, ...handlers: any){
      this.assign('get', path, handlers);
   }

   public post(path: string, ...handlers: any): void {
      this.assign('post', path, handlers);
   }

   public put(path: string, ...handlers: any): void {
      this.assign('put', path, handlers);
   }

   public delete(path: string, ...handlers: any): void {
      this.assign('delete', path, handlers);
   }

   public connect(path: string, ...handlers: any): void {
      this.assign('connect', path, handlers);
   }

   public option(path: string, ...handlers: any): void {
      this.assign('option', path, handlers);
   }

   public trace(path: string, ...handlers: any): void {
      this.assign('trace', path, handlers);
   }

   public patch(path: string, ...handlers: any): void {
      this.assign('patch', path, handlers);
   }

}