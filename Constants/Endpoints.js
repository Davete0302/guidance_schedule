const BASE_URL = 'http://52.74.70.6/api/auth/';
// const BASE_URL = 'http://18.136.194.145:81/api/';
const WEB_URL = 'http://192.168.0.122';
const WEB_BROADCAST = '3.1.20.199';

export default {
    WEB_URL: WEB_URL,
    LOGIN_URL: `${BASE_URL}login`,
    CreateSchedule_URL:`${BASE_URL}createSchedule`,
    ListofSchedules:`${BASE_URL}getSchedules`,
    ListofScores:`${BASE_URL}getPersonalScore`,
    Questions_URL:`${BASE_URL}getQuestions`,
    Submit_URL:`${BASE_URL}submit`,
    Logout_URL:`${BASE_URL}`,
    Notif_URL:`${BASE_URL}getNotif`,
}