
const express = require('express');
const app = express();
const stripe = require('stripe')('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');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantité invalide' });
  }

  const productPrice = 600; // 6€ en centimes
  const shipping = 650; // 6.50€ en centimes
  const totalAmount = quantity * productPrice + shipping;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Planche DTF personnalisée (x${quantity})`,
          },
          unit_amount: totalAmount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://sublims-dtf.netlify.app/success',
      cancel_url: 'https://sublims-dtf.netlify.app/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
