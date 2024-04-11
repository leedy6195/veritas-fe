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
    const userEmail = ref('');
    const error = ref(null);

    const getKakaoToken = async () => {
      try {
        const response = await axios.post('/auth/kakao/token', {
          code: code.value,
          state: state.value
        });

        token.value = response.data.data.token;
        userEmail.value = response.data.data.userEmail;

// 토큰과 사용자 정보를 저장하거나 처리할 수 있습니다.
// 예: localStorage에 저장
        localStorage.setItem('token', token.value);
        localStorage.setItem('userEmail', userEmail.value);
        store.commit('setLogin', true)
// 로그인 완료 후 원하는 페이지로 이동
        router.push('/');
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
      userEmail,
      error
    };
  }
};
</script>