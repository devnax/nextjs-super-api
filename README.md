> Basic and Simple Routing system for nextjs



## Configure
```js
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:base/:path*',
        destination: '/api/v1/:base*'
      }
    ]
  }
  
}

```



## Uses
```js
// api/v1/users.js

import Router from 'nextjs-super-api'

class UserRoutes extends Router{
  basepath = '/api/v1/users' // required

  constructor(){
    super()
    this.post('/', this.createUser)
    this.get('/', this.getUsers)
    
    this.put(...)
    this.delete(...)
    this.connect(...)
    this.option(...)
    this.trace(...)
    this.patch(...)

    // Middleware
    this.use(this.middleware, (req, res) => {}, () => {})

    // With Path
    this.use('/', this.middleware, () => {}, () => {})


    // you can use also
    this.get(path, this.anymethod, () => {}, this.another, ...)


    // params
    this.get('/:user_id', this.getUser)

    // another example
    this.get('/:post_category/:post_id', this.getPosts)

  }

  middleware(req, res, next){

    next()

    // or you can call this.next()
  }

  async catchError(err){
    this.error(err.message)
  }

  async createUser(req, res){
    const {firstname, lastname, email, password} = this.data
    const create = '...'

    if(create){
      this.json({message: "User Created"}, 200); // default 200
    }else{
      this.error("Something wrong") // or you can catch all  error from this.catchError method
    }
  }

  async getUsers(){
    // ....
    const user = ""

    this.json(user)
  }

}



export default UserRoute.listen() // Must call this


// Class Public Properties

this.next() // this is for middleare
this.data // it's just return req.body
this.params // req.headers
this.query // req.headers
this.headers // req.headers
this.json(string|object, code)
this.error(string|object, code)
this.status(200).json()
this.status(400).end()
```

