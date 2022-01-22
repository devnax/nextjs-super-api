import Factory from "./Factory"
import StatusCode from "./StatusCode"

export default class Handler extends Factory {

   public status(code: number, json: string | object) {
      let _ = this.res.status(code)
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

   async excute(index: number = 0) {
      if (!this.handlers[index]) {
         return
      }
      const handler: Function = this.handlers[index]
      const next = async () => {
         await this.excute(index + 1)
      }
      if(typeof this.callback === 'function'){
         this.callback('next', next)
      }
      await handler(this.req, this.res, next)
   }


   static listen() {
      const self = new this

      return async (req: any, res: any) => {
         self.req = req
         self.res = res
         self.data = req.body
         self.query = req.query
         self.headers = req.headers
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