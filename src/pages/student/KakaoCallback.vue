<script>
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from 'axios';
import store from "@/scripts/store";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const code = ref(route.query.code);
    const state = ref(route.query.state);
    const token = ref('');
    const error = ref(null);

    const getKakaoToken = async () => {
      try {
        const response = await axios.post('/auth/kakao/token', {
          code: code.value,
          state: state.value
        });
        if (response.data.header.success) {
          token.value = response.data.data.token;
          localStorage.setItem('token', token.value);
          store.commit('setLogin', true)

          router.push('/');
        } else if (response.data.header.status === 406) {
          alert(response.data.header.message)


          router.push('/login');
        } else {
          alert(response.data.header.message)
          router.push('/login');
        }

      } catch (err) {
        error.value = err;
        console.error(error.value);
// 에러 페이지로 이동하거나 알림을 표시할 수 있습니다.
      }
    };

    onMounted(() => {
      getKakaoToken();
    });

    return {
      code,
      state,
      token,
      error
    };
  }
};
</script>