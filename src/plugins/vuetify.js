import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    rtl: true,
    theme: {
        themes: {
          light: {
            primary: '#00a7b7',
            secondary: '#7d8ec4',
          },
        },
      },
});
