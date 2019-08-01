import Vue from 'vue';
import App from './App.vue';

import Home from './Home.vue';
import Users from './Users1.vue';
import Login from './Login.vue';
import Logout from './Logout.vue';
import Signup from './Signup.vue';
import Venues from './Venues.vue';
import Reviews from './Reviews.vue';
import SearchVenues from './SearchVenues.vue';
import SearchUsers from './SearchUsers.vue';

import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.emulateJSON = false;

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';


const routes = [

  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/users/login",
    name: "login",
    component: Login
  },
  {
    path: "/users/logout",
    name: "logout",
    component: Logout
  },
  {
    path: "/users/:userId",
    name: "user",
    component: Users
  }
  ,
  {
   path: "/users",
   name: "users",
   component: SearchUsers
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup
  },
  {
    path: "/venues/search",
    name: "search",
    component: SearchVenues
  },
  {
    path: "/venues/:venueId/reviews",
    name: "review",
    component: Reviews
  },
  {
    path: "/venues/:venueId",
    name: "venue",
    component: Venues
  },
  {
    path: "/venues",
    name: "venue1",
    component: Venues
  }



];

const router = new VueRouter({
  routes: routes,
  mode: 'history'

});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});

