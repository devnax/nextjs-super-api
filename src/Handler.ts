import Factory from "./Factory"
import StatusCode from "./StatusCode"
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodeIndex } from './StatusCode'
import { HandlerType } from './types'


export default class Handler extends Factory {

   public status(code: StatusCodeIndex, data: string | object) {
      let _ = this._res?.status(code)
      return typeof data === 'object' ? _?.json(data) : _?.end(data)
   }

   public error(info: string | object, code?: StatusCodeIndex) {
      code = code || 400
      let message = "Bad Request"
      if (StatusCode.hasOwnProperty(code)) {
         message = StatusCode[code]
      }
      return this.status(code, info || { message })
   }

   public json(info: object, code?: StatusCodeIndex) {
      code = code || 200
      let message = StatusCode[code] || "OK"
      return this.status(code, info || { message })
   }

   get body() {
      return this._req?.body as NextApiRequest['body']
   }

   get query() {
      return this._req?.query as NextApiRequest['query']
   }

   get headers() {
      return this._req?.headers as NextApiRequest['headers']
   }

   get req() {
      return this._req as NextApiRequest
   }

   get res() {
      return this._res as NextApiResponse
   }

   next() {
      if (this._next_cb) {
         this._next_cb()
      }
   }

   async excute(req: NextApiRequest, res: NextApiResponse, index: number = 0) {
      if (!this.handlers[index]) {
         return
      }

      const handler: HandlerType = this.handlers[index].bind(this)
      const next = async () => {
         await this.excute(req, res, index + 1)
      }

      this._next_cb = next.bind(this);
      try {
         await handler(req, res, next)
      } catch (err) {
         if (typeof this.catchError === 'function') {
            this.catchError(err)
         } else {
            throw err
         }
      }
   }


   errorPage() {
      this.status(404, "404 This route could not be found.")
   }


   static listen() {
      const self = new this

      return async (req: NextApiRequest, res: NextApiResponse) => {
         self._req = req
         self._res = res

         self.formatRoutes()
         if (!self.handlers.length) {
            return self.errorPage()
         }

         try {
            await self.excute(req, res)
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