<template>
    <form method="post" @submit.prevent="submit">
        <ion-list lines="full" class="ion-no-margin">
            <ion-list-header>
                <ion-label>Abonnement</ion-label>
            </ion-list-header>

            <ion-radio-group v-model="plan">
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
                <ion-input v-model="name"></ion-input>
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
                <ion-input v-model="coupon"></ion-input>
            </ion-item>
        </ion-list>

        <input type="hidden" v-model="payment_method" />

        <div class="ion-padding-top">
            <ion-button type="submit" :disabled="payment_processing">Payer maintenant</ion-button>
        </div>
    </form>
</template>

<script>
import {
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
    name: "StripeCheckout",
    data() {
        return {
            plan: "1",
            name: "",
            coupon: "",
            payment_method: "",
            payment_processing: false
        };
    },
    props: ["card", "stripe", "secret", "token"],
    components: {
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
    methods: {
        resetForm() {
            this.plan = 1;
            this.name = "";
            this.coupon = "";
            this.payment_method = "";
            this.payment_processing = false;
        },
        async submit() {
            this.payment_processing = true;
            const { setupIntent, error } = await this.stripe.confirmCardSetup(
                this.secret,
                {
                    payment_method: {
                        card: this.card,
                        billing_details: { name: this.name },
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
                this.payment_method = setupIntent.payment_method;

                await axios
                    .post(
                        "http://127.0.0.1:8000/api/stripe/subscribe",
                        {
                            plan: this.plan,
                            name: this.name,
                            payment_method: this.payment_method,
                            coupon: this.coupon,
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
                            this.$emit('paymentMethod', this.payment_method)
                            this.$emit('requiresAction', true)
                            this.$emit('paymentIntent', response.data)
                        } else {
                            this.resetForm();
                            this.$emit('paymentProcessed', true);
                            this.$emit('messageProcessed', "Merci de votre abonnement ! 🤑");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
    },
};
</script>
