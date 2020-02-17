const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd_db');

const Product = conn.define('product ', { 
  name: STRING
});
const syncAndSeed = async () => {
  const products = [
    {name: 'foo'},
    {name: 'bar'},
    {name: 'baz'},
  ];

  const [ foo, bar, bazz ]  = await Promise.all(products.map(product => Product.create(product)));
};

module.exports = { 
  syncAndSeed
}