const { expect } = require('chai');
const db = require('./db');
const { Product, Category } = db.models;

describe('Acme TDD ', ()=> { 
  let seed; 
  beforeEach( async () => seed = await db.syncAndSeed());
  
  describe('Data Layer', () => { 
    it('Foo, Bar and Baz products', ()=> {
      expect(seed.products.foo.name).to.equal('foo');
      expect(seed.products.bar.name).to.equal('bar');
      expect(seed.products.baz.name).to.equal('baz');
    });

    it('A product belongs to a category ', () => { 
      expect(seed.products.foo.categoryId).to.equal(seed.categories.catFoo.id);
    });
  });

  describe('isExpensive', () => { 
    it('a product with a suggestedPrice greater than 10 is expensive', ()=> {
      expect(Product.build({ suggestedPrice: 11 }).isExpensive).to.equal(true);
    });

    it('a product with a suggestedPrice  10 or less  is not expensive', ()=> {
      expect(Product.build({ suggestedPrice: 10 }).isExpensive).to.equal(false);
    });
  })

  describe('Product validation', () => {
    it('name must be required', ()=> {
      return Product.create({})
      .then(()=> {
        throw 'nooooo' 
      })
        .catch( ex => expect(ex.errors[0].path).to.equal('name'));
    });
    it('name cant be an empty string', ()=> {
      return Product.create({name: ''})
      .then(()=> {
        throw 'nooooo' 
      })
        .catch( ex => expect(ex.errors[0].path).to.equal('name'));
    });
  });
});