<template>
    <div>
        <ion-button color="success" @click="confirmPaymentMethod"
            >Confirmer</ion-button
        >
        <ion-button color="danger" @click="cancelPaymentMethod"
            >Annuler</ion-button
        >
    </div>
</template>

<script>
import { IonButton } from "@ionic/vue";

export default {
    name: "StripePaymentConfirmation",
    components: {IonButton},
    props: ["stripe", "payment_intent", "payment_method"],
    methods: {
        confirmPaymentMethod() {
            this.stripe
                .confirmCardPayment(this.payment_intent.client_secret, {
                    payment_method: this.payment_method,
                })
                .then((result) => {
                    if (result.error) {
                        console.log("error");
                    } else {
                        console.log("ok");
                        this.$emit('paymentProcessed', true);
                        this.$emit('messageProcessed', "Merci de votre abonnement ! 🤑");
                    }
                });
        },
        cancelPaymentMethod() {
            this.$emit('paymentProcessed', true);
            this.$emit('messageProcessed', "Votre demande d'abonnement a bien été annulée 😞");
        },
    },
};
</script>
