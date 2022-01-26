import Factory from "./Factory"
import StatusCode from "./StatusCode"

export default class Handler extends Factory {

   public status(code: number, json: string | object) {
      let _ = this._res.status(code)
      return typeof json === 'object' ? _.json(json) : _.end(json)
   }

   public error(info: any, code: any) {
      code = code || 400
      let message = "Bad Request"
      if (StatusCode.hasOwnProperty(code)) {
         message = StatusCode[code]
      }
      return this.status(code, info || { message })
   }

   public json(info: any, code: any) {
      code = code || 200
      let message = "OK"
      if (StatusCode.hasOwnProperty(code)) {
         message = StatusCode[code]
      }
      return this.status(code, info || { message })
   }

   get data(){
      return this._req.body
   }

   get query(){
      return this._req.query
   }

   get headers(){
      return this._req.headers
   }

   get req(){
      return this._req
   }

   get res(){
      return this._res
   }

   async excute(index: number = 0) {
      if (!this.handlers[index]) {
         return
      }
      const handler: Function = this.handlers[index]
      const next = async () => {
        return await this.excute(index + 1)
      }
      if(typeof this.callback === 'function'){
         await this.callback('next', next)
      }
      
      try {
         return await handler(this._req, this._res, next)
      } catch (err) {
         if (typeof this.catchError === 'function') {
            await this.catchError(err)
         } else {
            throw err
         }
      }
   }


   static listen() {
      const self = new this

      return async (req: any, res: any) => {
         self._req = req
         self._res = res
         self.formatRoutes()
         self.callback = (type: string, next: any) => {
            if(type == 'next'){
               self.next   = next
            }
         }
         if (!self.handlers.length) {
            return res.status(404).end("404 This route could not be found.")
         }

         try {
            await self.excute()
         } catch (err) {
            if (typeof self.catchError === 'function') {
               self.catchError(err)
            } else {
               throw err
            }
         }

      }
   }
}