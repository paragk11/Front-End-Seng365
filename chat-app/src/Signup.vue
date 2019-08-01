<template>
  <div id="signup">

    <h1>Sign up</h1>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'login'})">Login</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'user', params: { userId: id}})">Your Account</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'users'})">Search Users</button>

    <br><br>

    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div v-if="loggedIn">
      You are logged in, you can't sign up
    </div>



    <div v-else>


    <form v-on:submit.prevent="Signup" data-toggle="validator" role="form">
      <div class="form-group">
        <label for="inputFirstName" class="control-label">First Name</label>
        <input type="text" class="form-control" id="inputFirstName" v-model="givenName" placeholder="First Name" required>
      </div>
      <div class="form-group">
        <label for="inputFamilyName" class="control-label">Family Name</label>
        <input type="text" class="form-control" id="inputFamilyName" v-model="familyName" placeholder="Family Name" required>
      </div>
      <div class="form-group">
        <label for="inputEmail" class="control-label">Email</label>
        <input type="email" class="form-control" id="inputEmail" v-model="email" placeholder="Email" data-error="Email address is invalid" required>
        <div class="help-block with-errors"></div>
      </div>
      <div class="form-group">
        <label for="inputUsername" class="control-label">Username</label>
        <input type="text" class="form-control" id="inputUsername" maxlength="64" v-model="username" placeholder="Username" required>
      </div>
      <div class="form-group">
        <label for="inputPassword" class="control-label">Password</label>
        <div class="form-inline row">
          <div class="form-group col-sm-6">
            <input type="password" class="form-control" id="inputPassword" v-model="password" placeholder="Password" required>
          </div>
          <div class="form-group col-sm-6">
            <input type="password" class="form-control" id="inputPasswordConfirm" match="#inputPassword" match-error="Whoops, these don't match"
                   v-model="confirmedPassword" placeholder="Confirm" required>
            <div class="help-block with-errors"></div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary" v-on:click="SignUp()">Sign up</button>
      </div>
    </form>
    </div>




  </div>
</template>



<script>


  export default{
    data(){
      return {
        username: '',
        email: '',
        password: '',
        confirmedPassword: '',
        givenName: '',
        familyName: '',
        loggedIn: false,
        error: '',
        errorFlag: '',
        // nameRules:[(v) => /^[a-zA-Z0-9_]*$/.test(v) || 'Username can only contain letters, numbers and underscores'],
        // emailRules: [
        //   (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        // ]
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

      SignUp: function () {

        if (this.username == "") {
          this.error = "Please enter an username!";
          this.errorFlag = true;
        } else if (/[^a-zA-Z0-9]/.test(this.username)) {
          this.error = "Please enter an username with only numbers or letters!";
        this.errorFlag = true;
        } else if (this.email == "") {
          this.error = "Please enter a email!";
          this.errorFlag = true;
        } else if (this.givenName == "") {
          this.error = "Please enter a First Name!";
          this.errorFlag = true;
        } else if (this.familyName == "") {
          this.error = "Please enter a Family Name!";
          this.errorFlag = true;
        } else if (this.password == "") {
          this.error = "Please enter a password!";
          this.errorFlag = true;
        } else if (this.confirmedPassword == "") {
          this.error = "Please enter a password confirmation!";
          this.errorFlag = true;
         } else if (this.password !== this.confirmedPassword) {
          this.error = "Passwords do not match!";
          this.errorFlag = true;
        } else {
          this.$http.post('http://localhost:4941/api/v1/users', {
            "username": this.username,
            "givenName": this.givenName,
            "familyName": this.familyName,
            "email":this.email,
            "password": this.password,

          }).then(function (response) {
            this.error = '';

            let loginInput = {
              "username": this.username,
              "password": this.password
            };

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
          },function (error) {
            this.error = "Username or email is already in use, please choose another one!";
            this.errorFlag = true;
          });
        }
      }

    }
  }
</script>

