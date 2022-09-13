<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">E-Mail</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">
          Please enter a valid email and password (must be at least 6 characters
          long).
        </p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{
          switchModeButtonCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const formIsValid = ref(true);
    const mode = ref("login");
    const isLoading = ref(false);
    const error = ref(null);
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const submitButtonCaption = computed(function () {
      if (mode.value === "login") {
        return "Login";
      } else {
        return "Signup";
      }
    });

    const switchModeButtonCaption = computed(function () {
      if (mode.value === "login") {
        return "Signup instead";
      } else {
        return "Login instead";
      }
    });

    async function submitForm() {
      formIsValid.value = true;
      if (
        email.value === "" ||
        !email.value.includes("@") ||
        password.value.length < 6
      ) {
        formIsValid.value = false;
        return;
      }
      isLoading.value = true;
      const actionPayload = {
        email: email.value,
        password: password.value,
      };
      try {
        if (mode.value === "login") {
          await store.dispatch("login", actionPayload);
          // with dispatch 'login' we run login function in actions
        } else {
          await store.dispatch("signup", actionPayload);
        }
        const redirectUrl = "/" + (route.query.redirect || "coaches");
        router.replace(redirectUrl);
      } catch (err) {
        error.value = err.message || "Failed to authenticate, try later";
      }
      isLoading.value = false;
    }

    function switchAuthMode() {
      if (mode.value === "login") {
        mode.value = "signup";
      } else {
        mode.value = "login";
      }
    }

    function handleError() {
      error.value = null;
    }

    return {
      email,
      password,
      formIsValid,
      mode,
      isLoading,
      error,
      submitButtonCaption,
      switchModeButtonCaption,
      submitForm,
      switchAuthMode,
      handleError,
    };
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
