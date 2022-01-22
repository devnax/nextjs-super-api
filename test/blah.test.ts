import Router from '../src'

class UserRoute extends Router{

  constructor(){
    super()
    this.get('/any', () => {

    })
  }
  
}

UserRoute.run({method: 'get'},{})

describe('blah', () => {
  it('works', () => {

  });
});
