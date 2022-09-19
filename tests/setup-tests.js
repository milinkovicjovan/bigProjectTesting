import fetch from "node-fetch";
import { createStore } from "vuex";
import { store } from "../src/store/modules/coaches";
import { render } from "@testing-library/vue";
import CoachesList from "../src/pages/coaches/CoachesList.vue";
// console.log(fetch);

// (async () => {
//   const response = await fetch("https://github.com/");
//   const body = await response.text();

//   console.log(body);
// })();

export function renderVuexTestComponent(customStore) {
  // Create a custom store with the original one and the one coming as a
  // parameter. This way we can alter some of its values.
  const mergedStoreInstance = createStore({ ...store, ...customStore });

  //   console.log("this is mergedStore", mergedStoreInstance);

  return render(CoachesList, {
    global: {
      plugins: [mergedStoreInstance],
    },
  });
}

// console.log(renderVuexTestComponent);
