<template>
  <the-header></the-header>
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";

export default {
  components: {
    TheHeader,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const didAutoLogout = computed(function () {
      return store.getters.didAutoLogout;
    });

    //////////////////////////////
    // Created Lifecyle Hook CODE
    store.dispatch("tryLogin");

    // watch

    watch(didAutoLogout, function (curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        router.replace("/coaches");
      }
    });
    // when we auto logout we redirect to coaches
    // automatically

    return {
      didAutoLogout,
    };
  },
  // computed: {
  //   didAutoLogout() {
  //     return this.$store.getters.didAutoLogout;
  //   }
  // },
  // created() {
  //   this.$store.dispatch('tryLogin');
  // },
  // watch: {
  //   didAutoLogout(curValue, oldValue) {
  //     if (curValue && curValue !== oldValue) {
  //       this.$router.replace('/coaches');
  //     }
  //   }
  // }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
