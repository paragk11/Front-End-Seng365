<template>
  <div id="login">

    <h1>Login</h1>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'signup'})">Sign up</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'users'})">Search Users</button>

    <br><br>


    <div v-if="loggedIn">
        You are logged in
    </div>

    <div v-else>
      <form>
        <div class="form-group">
          <label for="inputEmail">Email address</label>
          <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" v-model="email" placeholder="Enter email">
        </div>
        <div class="form-group">
          <label for="inputUsername">Username</label>
          <input type="username" class="form-control" id="inputUsername" aria-describedby="emailHelp" v-model="username" placeholder="Enter username">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" v-model="password" placeholder="Password">
        </div>
        <button type="button" class="btn btn-primary" v-on:click="Log()">Login</button>
      </form>
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
        loggedIn: false,
        error: '',
        errorFlag: ''
      }
    },
    mounted: function () {
      this.checkLoggedIn();
    },
    methods: {

      checkLoggedIn: function(){
        if(localStorage.getItem('token') !== null){
          this.loggedIn = true;
        }
      },


      Log: function(){

        if(localStorage.getItem('token') == null){

          let loginInput = {};

          if (this.email == ''){
            loginInput = {
              "username": this.username,
              "password": this.password
            };
          } else  {
            loginInput = {
              "email": this.email,
              "password": this.password
            };
          }

          this.$http.post('http://localhost:4941/api/v1/users/login', loginInput

          ).then(function(response){
            let token = response.body.token;
            let user_id = response.body.userId;
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('password', this.password);
            this.loggedIn = true;

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

