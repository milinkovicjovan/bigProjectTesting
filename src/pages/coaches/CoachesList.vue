<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)"
            >Refresh</base-button
          >
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn"
            >Login to Register as Coach</base-button
          >
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >Register as Coach</base-button
          >
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :first-name="coach.firstName"
            :last-name="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          ></coach-item>
        </ul>
        <h3 v-else>No coaches found.</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import CoachItem from "../../components/coaches/CoachItem.vue";
import CoachFilter from "../../components/coaches/CoachFilter.vue";

export default {
  components: {
    CoachItem,
    CoachFilter,
  },
  setup() {
    let isLoading = ref(false);
    let error = ref(null);
    let activeFilters = ref({
      frontend: true,
      backend: true,
      career: true,
    });
    const store = useStore();

    const isLoggedIn = computed(function () {
      return store.getters.isAuthenticated;
    });

    const isCoach = computed(function () {
      return store.getters["coaches/isCoach"];
    });

    const filteredCoaches = computed(function () {
      const coaches = store.getters["coaches/coaches"];
      return coaches.filter((coach) => {
        if (activeFilters.value.frontend && coach.areas.includes("frontend")) {
          return true;
        }
        if (activeFilters.value.backend && coach.areas.includes("backend")) {
          return true;
        }
        if (activeFilters.value.career && coach.areas.includes("career")) {
          return true;
        }
        return false;
      });
    });

    const hasCoaches = computed(function () {
      return !isLoading.value && store.getters["coaches/hasCoaches"];
    });

    //////////////////////////////
    // Created Lifecycle Hook CODE
    loadCoaches();

    // console.log(loadCoaches(), "this is loadCoaches");

    function setFilters(updatedFilters) {
      activeFilters.value = updatedFilters;
    }

    async function loadCoaches(refresh = false) {
      isLoading.value = true;
      try {
        await store.dispatch("coaches/loadCoaches", {
          forceRefresh: refresh,
        });
        // console.log("this is string");
      } catch (error) {
        error.value = error.message || "Something went wrong!";
      }
      isLoading.value = false;
    }

    function handleError() {
      error.value = null;
    }

    return {
      isLoading,
      error,
      activeFilters,
      isLoggedIn,
      isCoach,
      filteredCoaches,
      hasCoaches,
      setFilters,
      loadCoaches,
      handleError,
    };
  },
  // data() {
  //   return {
  //     isLoading: false,
  //     error: null,
  //     activeFilters: {
  //       frontend: true,
  //       backend: true,
  //       career: true,
  //     },
  //   };
  // },
  // computed: {
  //   isLoggedIn() {
  //     return this.$store.getters.isAuthenticated;
  //   },
  //   isCoach() {
  //     return this.$store.getters['coaches/isCoach'];
  //   },
  //   filteredCoaches() {
  //     const coaches = this.$store.getters['coaches/coaches'];
  //     return coaches.filter((coach) => {
  //       if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
  //         return true;
  //       }
  //       if (this.activeFilters.backend && coach.areas.includes('backend')) {
  //         return true;
  //       }
  //       if (this.activeFilters.career && coach.areas.includes('career')) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   },
  //   hasCoaches() {
  //     return !this.isLoading && this.$store.getters['coaches/hasCoaches'];
  //   },
  // },
  // created() {
  //   this.loadCoaches();
  // },
  // methods: {
  //   setFilters(updatedFilters) {
  //     this.activeFilters = updatedFilters;
  //   },
  //   async loadCoaches(refresh = false) {
  //     this.isLoading = true;
  //     try {
  //       await this.$store.dispatch('coaches/loadCoaches', {
  //         forceRefresh: refresh,
  //       });
  //     } catch (error) {
  //       this.error = error.message || 'Something went wrong!';
  //     }
  //     this.isLoading = false;
  //   },
  //   handleError() {
  //     this.error = null;
  //   },
  // },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
