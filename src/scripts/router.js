import {createRouter, createWebHistory} from 'vue-router'


import ReadingRooms from "@/pages/admin/facility/ReadingRooms.vue";
import ReadingRoom from "@/pages/admin/facility/ReadingRoom.vue";
import Test from "@/pages/admin/Test.vue";
import AdminLogin from "@/pages/admin/Login.vue";

import AdminLayout from "@/components/AdminLayout.vue";
import Test2 from "@/pages/student/Test2.vue";
import KakaoCallback from "@/pages/student/KakaoCallback.vue";
import StudentHome from "@/pages/student/StudentHome.vue";
import ReadingRoomView from "@/pages/view/ReadingRoomView.vue";
import Kiosks from "@/pages/admin/device/Kiosks.vue";
import EntryDevices from "@/pages/admin/device/EntryDevices.vue";
import Students from "@/pages/admin/student/Students.vue";
import ReadingRoomExitView from "@/pages/view/ReadingRoomExitView.vue";
import LectureRooms from "@/pages/admin/facility/LectureRooms.vue";
import LectureRoomEnterView from "@/pages/view/LectureRoomEnterView.vue";
import LectureRoomExitView from "@/pages/view/LectureRoomExitView.vue";
import Attendances from "@/pages/admin/attendance/Attendances.vue";
import KakaoLogin from "@/pages/student/KakaoLogin.vue";
import MemberLayout from "@/components/MemberLayout.vue";
import axios from "axios";
import Privacy from "@/pages/view/Privacy.vue";
import Lectures from "@/pages/admin/lecture/Lectures.vue";
import Schedules from "@/pages/admin/lecture/Schedules.vue";
import Enrollments from "@/pages/admin/enrollment/Enrollments.vue";
import EnrolledStudents from "@/pages/admin/lecture/EnrolledStudents.vue";


const routes = [
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            {path: 'attendances', component: Attendances},
            {path: 'readingrooms', component: ReadingRooms},
            {path: 'readingrooms/:roomId', component: ReadingRoom},
            {path: 'lecturerooms', component: LectureRooms},
            {path: 'kiosks', component: Kiosks},
            {path: 'entryDevices', component: EntryDevices},
            {path: 'test', component: Test},
            {path: 'login', component: AdminLogin},
            {path: 'students', component: Students},
            {path: 'lectures', component: Lectures},
            {path: 'lectures/:lectureId/schedules',component: Schedules },
            {path: 'lectures/:lectureId/enrolled',component: EnrolledStudents},
            {path: 'enrollments', component: Enrollments}

        ],
    },
    {
        path: '/',
        component: MemberLayout,
        children: [
            {path: '', component: StudentHome},
            {path: 'login', component: KakaoLogin},
            {path: 'test', component: Test2},
            {path: 'enrollments'}
        ]
    },
    {
        path: '/views', children: [
            {path: 'readingrooms/:roomId', component: ReadingRoomView},
            {path: 'readingroom/exit/:deviceId', component: ReadingRoomExitView},
            {path: 'lectureroom/enter/:deviceId', component: LectureRoomEnterView},
            {path: 'lectureroom/exit/:deviceId', component: LectureRoomExitView},
            {path: 'privacy', component: Privacy}
        ]
    },
    {
        path: '/kakaocallback', component: KakaoCallback
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach(async (to, from, next) => {
    if (to.path.startsWith('/admin')) {
        await checkAuth(to, from, next);
    } else if (to.path !== '/login'
            && to.path !== '/kakaocallback'
            && !to.path.startsWith('/views/')) {
        await checkLogin(to, from, next);
    } else {
        next();
    }
});

async function checkLogin(to, from, next) {

    if (to.path === '/login') {
        next()
    } else {
        await axios.get("https://veritas-s.app/api/auth/check").then((response) => {
            if (response.data.header.success && response.data.data.isLoggedIn) {
                next()
            }
        })
        next('/login')
    }


    next()
}

async function checkAuth(to, from, next) {
    if (to.path === '/admin/login') {
        next()
    } else {
        await axios.get("https://veritas-s.app/api/admin/check").then((response) => {
            if (response.data.header.success && response.data.data.isLoggedIn) {
                next()
            }
        })
        next('/admin/login')
    }
}


export default router;