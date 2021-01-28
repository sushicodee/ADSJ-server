const { v4: uuid } = require('uuid');

const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const insert = (req, res, next) =>
  new Promise((resolve, reject) => {
    const { product, token } = req.body;
    console.log({ product });
    const idempontencyKey = uuid();
    stripe.customers
      .create({
        email: token.email,
        source: token.id,
      })
      .then((customer) => {
        stripe.charges.create(
          {
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `payment successful for ${product.name}`,
            shipping: {
              name: token.card.name,
              address: {
                country: token.card.address_country,
              },
            },
          },
          { idempontencyKey }
        );
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });

module.exports = { insert };
