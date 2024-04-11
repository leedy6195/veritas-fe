import {createRouter, createWebHistory} from 'vue-router'


import ReadingRooms from "@/pages/admin/ReadingRooms.vue";
import ReadingRoom from "@/pages/admin/ReadingRoom.vue";
import Test from "@/pages/admin/Test.vue";
import AdminLogin from "@/pages/admin/Login.vue";
import studentLogin from "@/pages/student/Login.vue"

import AdminLayout from "@/components/AdminLayout.vue";
import MemberLayout from "@/components/MemberLayout.vue";
import store from "@/scripts/store";
import Test2 from "@/pages/student/Test2.vue";
import KakaoCallback from "@/pages/student/KakaoCallback.vue";



const routes = [
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            {path: 'readingrooms', component: ReadingRooms},
            {path: 'readingrooms/:roomId', component: ReadingRoom},
            {path: 'test', component: Test},
            {path: 'login', component: AdminLogin}
        ],
        beforeEnter: checkAuth
    },
    {
        path: '/',
        component: MemberLayout,
        children: [
            {path: 'login', component: studentLogin },
            {path: 'test', component: Test2}
        ],
        beforeEnter: checkLogin
    },
    {
        path: '/kakaocallback', component: KakaoCallback}

]

const router = createRouter({
    history: createWebHistory(),
    routes
})
function checkLogin(to, from, next) {

    if (to.path === '/login') {
        next()
    } else if (to.path.startsWith('/') && !store.state.isLogin) {
        next('/login')
    } else {
        next()
    }


    next()
}
function checkAuth(to, from, next) {
    if (to.path === '/admin/login') {
        next()
    } else if (to.path.startsWith('/admin') && !store.state.isAuth) {
        next('/admin/login')
    } else {
        next()
    }
}

router.beforeEach((to, from, next) => {
    const isLoggedIn = false; // 로그인 여부 확인 로직
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !isLoggedIn) {
        // 로그인이 필요한 페이지에 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        next('/admin/login');
    } else {
        next();
    }
});


export default router;