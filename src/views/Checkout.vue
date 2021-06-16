<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Checkout</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <StripeCheckout
          v-if="!requires_action && !payment_processed"
          :card="card"
          :stripe="stripe"
          :secret="secret"
          :token="token"
          @requiresAction="requires_action = $event"
          @paymentIntent="payment_intent = $event"
          @paymentMethod="payment_method = $event"
          @paymentProcessed="payment_processed = $event"
        />

        <StripePaymentConfirmation
          v-if="requires_action && !payment_processed"
          :stripe="stripe"
          :payment_intent="payment_intent"
          :payment_method="payment_method"
          @paymentProcessed="payment_processed = $event"
        />

        <PaymentProcessed v-if="payment_processed" :message_processed="message_processed"/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import StripeCheckout from "../components/StripeCheckout";
import StripePaymentConfirmation from "../components/StripePaymentConfirmation";
import PaymentProcessed from "../components/PaymentProcessed";
import axios from "axios";

export default {
  name: "Checkout",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    StripeCheckout,
    StripePaymentConfirmation,
    PaymentProcessed,
  },
  data() {
    return {
      token: process.env.VUE_APP_AUTH_TOKEN,
      secret: null,
      stripe: null,
      payment_method: null,
      requires_action: null,
      payment_intent: null,
      card: null,
      payment_processed: false,
      message_processed: "",
    };
  },
  emits: ["update:requiresAction", "update:paymentIntent"],
  mounted() {
    this.stripe = window.Stripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY);
    const elements = this.stripe.elements();
    this.card = elements.create("card");
    this.card.mount("#card-element");

    axios
      .post(
        `${process.env.VUE_APP_API_URL}/api/stripe/intent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        this.secret = response.data.client_secret;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
