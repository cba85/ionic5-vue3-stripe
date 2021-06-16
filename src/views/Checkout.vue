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
        <form
          v-if="!requires_action"
          method="post"
          @submit.prevent="submit"
        >
          <ion-list lines="full" class="ion-no-margin">
            <ion-list-header>
              <ion-label>Abonnement</ion-label>
            </ion-list-header>

            <ion-radio-group v-model="form.plan">
              <ion-item>
                <ion-label>Mensuel : 19,90 €</ion-label>
                <ion-radio slot="start" value="1"></ion-radio>
              </ion-item>

              <ion-item>
                <ion-label>Annuel : 200 €</ion-label>
                <ion-radio slot="start" value="2"></ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>

          <ion-list lines="full" class="ion-no-margin">
            <ion-list-header lines="full">
              <ion-label>
                Paiement
              </ion-label>
            </ion-list-header>
            <ion-item>
              <ion-label>Nom</ion-label>
              <ion-input v-model="form.name"></ion-input>
            </ion-item>
          </ion-list>

          <ion-grid>
            <ion-row>
              <ion-col>
                <div id="card-element"></div>
              </ion-col>
            </ion-row>
          </ion-grid>

          <ion-list lines="full" class="ion-no-margin ion-padding-vertical">
            <ion-item>
              <ion-label>Code promo</ion-label>
              <ion-input v-model="form.coupon"></ion-input>
            </ion-item>
          </ion-list>

          <input type="hidden" v-model="form.payment_method" />

          <div class="ion-padding-top">
            <ion-button type="submit">Payer maintenant</ion-button>
          </div>
        </form>

        <div v-if="requires_action">
          <ion-button color="success" @click="confirmPaymentMethod"
            >Confirmer</ion-button
          >
          <ion-button color="danger" @click="cancelPaymentMethod"
            >Annuler</ion-button
          >
        </div>
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
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonList,
  IonRadio,
  IonListHeader,
  IonRadioGroup,
  toastController,
} from "@ionic/vue";
import axios from "axios";

export default {
  name: "Checkout",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonLabel,
    IonButton,
    IonItem,
    IonCol,
    IonGrid,
    IonRow,
    IonList,
    IonRadio,
    IonRadioGroup,
    IonListHeader,
  },
  data() {
    return {
      token: process.env.VUE_APP_AUTH_TOKEN,
      stripe_public_key: process.env.VUE_APP_STRIPE_PUBLIC_KEY,
      secret: null,
      stripe: null,
      requires_action: null,
      payment_intent: null,
      form: {
        plan: "1",
        name: "",
        coupon: "",
        payment_method: "",
        card: null,
      },
    };
  },
  methods: {
    async submit() {
      console.log(this.form);
      const { setupIntent, error } = await this.stripe.confirmCardSetup(
        this.secret,
        {
          payment_method: {
            card: this.form.card,
            billing_details: { name: this.form.name },
          },
        }
      );

      if (error) {
        console.log(error);
        const toast = await toastController.create({
          message: error.message,
          duration: 2000,
          color: "danger",
        });
        return toast.present();
      } else {
        console.log(setupIntent);
        this.form.payment_method = setupIntent.payment_method;

        await axios
          .post(
            "http://127.0.0.1:8000/api/stripe/subscribe",
            {
              plan: this.form.plan,
              name: this.form.name,
              payment_method: this.form.payment_method,
              coupon: this.form.coupon,
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            if (
              response.data.status &&
              response.data.status == "requires_action"
            ) {
              // Confirmation
              this.requires_action = true;
              this.payment_intent = response.data;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    confirmPaymentMethod() {
      this.stripe
        .confirmCardPayment(this.payment_intent.client_secret, {
          payment_method: this.payment_method,
        })
        .then(function(result) {
          if (result.error) {
            console.log("error");
          } else {
            console.log("ok");
            this.$router.push({ name: "CheckoutSuccess" });
          }
        });
    },
    cancelPaymentMethod() {
      this.requires_action = false;
      this.$router.push({ name: "Home" });
    },
  },
  mounted() {
    this.stripe = window.Stripe(this.stripe_public_key);
    const elements = this.stripe.elements();
    this.form.card = elements.create("card");
    this.form.card.mount("#card-element");

    axios
      .post(
        "http://127.0.0.1:8000/api/stripe/intent",
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

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
