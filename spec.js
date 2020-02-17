const { expect } = require('chai');
const db = require('./db');
describe('Acme TDD ', ()=> { 
  let seed; 
  beforeEach( async () => seed = await db.syncAndSeed());
  
  describe('Data Layer', () => { 
    it('Foo, Bar and Bazz products', ()=> {
      expect(seed.products.foo.name).to.equal('foo');
    });

  });
});