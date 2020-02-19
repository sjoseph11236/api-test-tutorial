const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, DECIMAL, VIRTUAL} = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/acme_tdd_db', {
  logging:false
});

const Product = conn.define('product', { 
  id: { 
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: { 
      notEmpty: true
    }
  },
  suggestedPrice: {
    type: DECIMAL,
    defaultValue: 5
  } ,
  isExpensive: { 
    type: VIRTUAL,
    get: function() {
      return this.suggestedPrice > 10 ? true : false;
    }
  }
});

const Category = conn.define('category', { 
  id: { 
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: STRING 
});

Product.belongsTo(Category);

const syncAndSeed = async () => {
  await conn.sync({force: true});
  const categories = [
    {name: 'CatFoo'},
    {name: 'CatBar'},
    {name: 'CatBaz'},
  ];
  const [ catFoo, catBar, catBaz ]  = await Promise.all(categories.map(category => Category.create(category)));

  const products = [
    {name: 'foo', categoryId: catFoo.id},
    {name: 'bar', categoryId: catBar.id},
    {name: 'baz', categoryId: catBaz.id},
  ];
  const [ foo, bar, baz ]  = await Promise.all(products.map(product => Product.create(product)));

  return {
    products: {
      foo,
      bar, 
      baz
    },
    categories: {
      catFoo,
      catBar,
      catBaz
    }
  }
};

module.exports = { 
  syncAndSeed,
  models : { 
    Product, 
    Category
  }
}