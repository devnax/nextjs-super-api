import { parse } from 'regexparam'

const statusCode = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout"
}




const Events = ['get', 'head', 'post', 'put', 'delete', 'connect', 'option', 'trace', 'patch', 'use']


class RouteSetter{
    
    _routes             = {
        'get': {
            '/admin': []
        }
    }
    _middlewares        = []
    current_method     = null
    base_path           = ''

    constructor(base_path){
        this.base_path = base_path || ''

        for(let m of Events){
            if(this.current_method){
                if(this.current_method.toLowerCase() != m.toLowerCase()){
                    continue;
                }
            }
            this._routes[m] = {}
            
            this[m] = (path, ...handlers) => {
                if(typeof path == 'function'){
                    this._middlewares.push(path.bind(this))
                }else if(handlers.length){
                    const methods = []
                    for(let handler of handlers){
                        if(typeof handler === 'function' ){
                            methods.push(handler.bind(this))
                        }
                    }
                    this._routes[m][path] = methods
                }
                return this
            }
        }
    }


    formatParams(path, result) {
        let i=0, _prams={};
        let matches = result.pattern.exec(path);
        while (i < result.keys.length) {
            _prams[ result.keys[i] ] = matches[++i] || null;
        }
        return _prams;
    }

    /**
     * 
     * @param {*} methods_name REQUEST METHOD
     * @param {*} path url
     * 
     * @format
     * {
     *  path: [fn, fn]
     * }
     */

    formate(self, method_name){
        const obs = self._routes[method_name], formated = {}
        for(let path in obs){
            const handlerItems = obs[path]
            if(!formated[path]){
                formated[path] = []
            }

            for(let handler of handlerItems){
                if(Array.isArray(handler)){
                    formated[path] = [...formated[path], ...handlers]
                }else{
                    formated[path].push(handler)
                }
            }
        }

        return formated
    }

    find(method_name, path_url){
        method_name = method_name.toLowerCase()
        let formated    = this.formate(this, method_name)
        
        let handlers = [], params = []
        for(let path in formated){
            let _parse = parse(this.base_path+path)
            let test = _parse.pattern.test(path_url)
            if(test){
                handlers = formated[path]
                params   = {...params, ...this.formatParams(path_url, _parse)}
                this.params = params
                break
            }
        }

        return [params, handlers]
    }
}


class Handler{

    _routers = {}
    runCallback = null
    catchError = null

    add_route(base_path, setter){
        this._routers[base_path+"/*"] = setter
    }

    async run(req, res, cbs, idx){
        idx = idx || 0
        if(!cbs[idx]){
            return
        }
        
        const cb = cbs[idx]
        if(typeof cb !== 'function'){
            throw new Error("Expecting a callback ("+req.url+")")
        }
        const next = async () => {
            await this.run(req, res, cbs, idx+1)
        }
        
        if(typeof this.runCallback === 'function'){
            this.runCallback(cb, next)
        }
        
        await cb(req, res, next)
    }

    async excute(req, res){
        const url = req.url.split('?')[0]
        let handlers = [], params   = {}

        for(let path in this._routers){
            let _parse = parse(path)
            let test = _parse.pattern.test(url+'/')
            
            if(test){
                const setter = this._routers[path]
                const [uprms, usefind] = setter.find('use', url)
                const middlewares = setter._middlewares
                const [methodParams, methodfind] = setter.find(req.method, url)
                params = methodParams
                handlers = [...middlewares, ...usefind, ...methodfind]
                break;
            }
        }

        if(!handlers.length){
            return res.status(404).end("404 This route could not be found.")
        }
        req.params = params
        try{
            await this.run(req, res, handlers)
        }catch(err){
            if(typeof this.catchError === 'function'){
                this.catchError(err)
            }else{
                throw err
            }
        }
        
    }
}



export default class Router extends RouteSetter{
    base_path = '/api'
    
    status(code, json){
        let _ =  this.res.status(code)
        return typeof json === 'object' ? _.json(json) : _.end(json)
    }

    error(info, code){
        code = code || 400
        let message = "Bad Request"
        if(statusCode.hasOwnProperty(code)){
            message = statusCode[code]
        }
        return this.status(code, info || {message})
    }

    json(info, code){
        code = code || 200
        let message = "OK"
        if(statusCode.hasOwnProperty(code)){
            message = statusCode[code]
        }
        return this.status(code, info || {message})
    }

    static excute(){
        const handler = new Handler()
        const self    = new this
        const base_path = self.base_path.replace(/\/$/, "")
        self.base_path = base_path
        if(self.middleware){
            self.use(self.middleware)
        }
        
        handler.add_route(base_path, self)

        return async (req, res) => {
            self.req    = req
            self.res    = res
            self.headers    = req.headers
            self.query  = req.query
            self.data   = req.body
            self.current_method   = req.method
            
            handler.runCallback = (cb, next) => {
                self.next   = next
            }

            if(self.catchError){
                handler.catchError = self.catchError.bind(self)
            }else{
                handler.catchError = (err) => {
                    console.error(err)
                    res.status(500).end("Server Error")
                }
            }

            try{
                await handler.excute(req, res)
            }catch(e){
                console.error(e)
            }
        }
    }
}