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

  createCustomer(customerParams: Stripe.CustomerCreateParams) {
    return this.stripe.customers.create(customerParams);
  }

  deleteCustomer(customerId: string) {
    return this.stripe.customers.del(customerId);
  }

  createPaymentMethod(paymentMethodParams: Stripe.PaymentMethodCreateParams) {
    return this.stripe.paymentMethods.create(paymentMethodParams);
  }

  detachPaymentMethod(paymentMethodId: string) {
    return this.stripe.paymentMethods.detach(paymentMethodId);
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
