<template>
  <div id="logout">

    <h1>Logout</h1>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'signup'})">Sign up</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'user', params: { userId: id}})">Your Account</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'users'})">Search Users</button>


    <br><br>

    <div v-if="!loggedIn">
      You are logged out, you can't log out again
    </div>

    <div v-else>

      <b-container class="notsure">
        <h2>Are you sure you want to logout?</h2>
        <button type="button" class="btn btn-primary" v-on:click="Log()">Logout</button>
      </b-container>


    </div>

  </div>
</template>


<script>
  export default{
    data(){
      return {
        username:'',
        password: '',
        email: '',
        loggedIn: true,
        id: localStorage.getItem('user_id'),

        error: ''

      }
    },
    mounted: function () {
      this.checkLoggedIn();
    },
    methods: {

      checkLoggedIn: function(){
        if(localStorage.getItem('token') == null){
          this.loggedIn = false;
        }
      },


      Log: function(){

        if(localStorage.getItem('token') !== null){

          let authorizationLogout = {"X-Authorization": localStorage.getItem('token')};
          console.log(authorizationLogout);

          this.$http.post('http://localhost:4941/api/v1/users/logout', {} ,{headers: authorizationLogout}

          ).then(function(response){

            localStorage.clear();
            this.loggedIn = false;

          }, function (error) {
            this.error = error.bodyText;
            this.errorFlag = true;
          });
        } else {
          this.loggedIn = true;
        }
      }
    }
  }
</script>

