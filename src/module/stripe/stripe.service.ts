import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
  readonly stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
      typescript: true,
    });
  }

  createPaymentMethod(paymentMethodParams: Stripe.PaymentMethodCreateParams) {
    return this.stripe.paymentMethods.create(paymentMethodParams);
  }

  getPaymentMethod(
    id: string,
    params: Stripe.PaymentIntentRetrieveParams | null,
  ) {
    return this.stripe.paymentMethods.retrieve(id, params);
  }

  createPaymentIntent(paymentIntentParams: Stripe.PaymentIntentCreateParams) {
    return this.stripe.paymentIntents.create(paymentIntentParams);
  }
}
