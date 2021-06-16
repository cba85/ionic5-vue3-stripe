<template>
    <div>
          <h4>{{ message_processed }}</h4>
          <div>
          <a href="/checkout">New subscription</a>
      </div>
          <router-link :to="{ name: 'Home'}">Go to home</router-link>
        </div>
</template>

<script>
export default {
    name: "PaymentProcessed",
    props: ["message_processed"],
};
</script>
