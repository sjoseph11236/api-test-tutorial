const { expect } = require('chai');
const db = require('./db');
const { Product, Category } = db.models;
const app = require('supertest')(require('./app'));

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

  describe('findAllExpensiveProducts ', ()=> {
    it('there is one expensive product', async()=> {
      const expensive = await Product.findAllExpensive();
      expect(expensive.length).to.equal(1);
    });
  })

  describe('isExpensive', () => { 
    it('a product with a suggestedPrice greater than 10 is expensive', ()=> {
      expect(Product.build({ suggestedPrice: 11 }).isExpensive).to.equal(true);
    });

    it('a product with a suggestedPrice  10 or less  is not expensive', ()=> {
      expect(Product.build({ suggestedPrice: 10 }).isExpensive).to.equal(false);
    });
  })

  describe('hooks', ()=> {
    it('an empty categoryId will get set to null', async () => {
      const product = await Product.create({ name: 'quq', categoryId: '' });
      expect(product.categoryId).to.equal(null);
    });
  });



  describe('Product validation', () => {
    it('name must be required', ()=> {
      return Product.create({})
      .then(()=> {
        throw 'nooooo' 
      })
        .catch( ex => expect(ex.errors[0].path).to.equal('name'));
    });
    it('name can not be an empty string', ()=> {
      return Product.create({name: ''})
      .then(()=> {
        throw 'nooooo' 
      })
        .catch( ex => expect(ex.errors[0].path).to.equal('name'));
    });
  });

  describe('API', ()=> {
    describe(' GET/api/products', ()=> {
      it('returns the products', () => {
        return app.get('/api/products')
          .expect(200)
          .then( response => { 
            expect(response.body.length).to.equal(3);
          })
      });
    });
  
    describe(' POST /api/products', ()=> {
      it('creates a product', () => {
        return app.post('/api/products')
          .send({ name: 'quq', suggestedPrice: 4})
          .expect(201)
          .then( response => { 
            expect(response.body.name).to.equal('quq');
            expect(response.body.isExpensive).to.equal(false);
          })
      });
    });
  
    describe(' PUT /api/products', ()=> {
      it('creates a product', () => {
        return app.put(`/api/products/${seed.products.foo.id}`)
          .send({ name: 'Foo', suggestedPrice: 44})
          .expect(200)
          .then( response => { 
            expect(response.body.name).to.equal('Foo');
            expect(response.body.isExpensive).to.equal(true);
          })
      });
    });
  
    describe(' DELETE /api/products', ()=> {
      it('creates a product', () => {
        return app.delete(`/api/products/${seed.products.foo.id}`)
          .expect(204);
      });
    });
  })
});

