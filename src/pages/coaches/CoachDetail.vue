<template>
  <div>
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}/hour</h3>
      </base-card>
    </section>
    <section>
      <base-card>
        <header>
          <h2>Interested? Reach out now!</h2>
          <base-button link :to="contactLink">Contact</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge
          v-for="area in areas"
          :key="area"
          :type="area"
          :title="area"
        ></base-badge>
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  props: ["id"],
  // router.js props:true
  setup(props) {
    let selectedCoach = ref(null);
    const route = useRoute();
    const store = useStore();

    let fullName = computed(function () {
      return selectedCoach.value.firstName + " " + selectedCoach.value.lastName;
    });
    let areas = computed(function () {
      return selectedCoach.value.areas;
    });
    let rate = computed(function () {
      return selectedCoach.value.hourlyRate;
    });
    let description = computed(function () {
      return selectedCoach.value.description;
    });
    let contactLink = computed(function () {
      return route.path + "/contact";
    });

    ////////////////////////////////////
    // Created Lifecycle Hook CODE

    selectedCoach.value = store.getters["coaches/coaches"].find(
      (coach) => coach.id === props.id
    );
    // we go through all coaches and then
    // with find, we compare coaches id with prop id in link

    return {
      fullName,
      areas,
      rate,
      description,
      contactLink,
    };
  },
  // data() {
  //   return {
  //     selectedCoach: null,
  //   };
  // },
  // computed: {
  //   fullName() {
  //     return this.selectedCoach.firstName + ' ' + this.selectedCoach.lastName;
  //   },
  //   areas() {
  //     return this.selectedCoach.areas;
  //   },
  //   rate() {
  //     return this.selectedCoach.hourlyRate;
  //   },
  //   description() {
  //     return this.selectedCoach.description;
  //   },
  //   contactLink() {
  //     return this.$route.path + '/' + this.id + '/contact';
  //   },
  // },
  // created() {
  //   this.selectedCoach = this.$store.getters['coaches/coaches'].find(
  //     (coach) => coach.id === this.id
  //   );
  // },
};
</script>
