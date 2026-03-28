import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({ message: "Webhook Error." });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        const session = sessionList.data[0];
        const { transactionId, appId } = session.metadata;

        if (appId === "quickgpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          await User.updateOne(
            { _id: transaction.userId },
            {
              $inc: {
                credits: transaction.credits,
              },
            },
          );

          transaction.isPaid = true;
          await transaction.save();
        } else {
          return res.status(400).json({ message: "Ignored event: Invalid app" });
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }
    return res.json({ received: true });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export { stripeWebhooks };
