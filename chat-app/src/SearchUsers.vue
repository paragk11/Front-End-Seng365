<template>
  <div>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'login'})">Login</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'signup'})">Sign up</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'user', params: { userId: id}})">Your Account</button>


    <br>
    <br>

      <form>
        <div class="input-group">
        </div>
        <h3>Search Users:</h3>
        <br>
        <div class="input-group">
        </div>
        <input name="searchField" type="text" placeholder="Search.." maxlength="30" v-model="userSearch">
        <br>

        <div class="form-group">
          <button type="button" class="btn btn-primary" v-on:click="searchUsers()">Search users</button>
        </div>
      </form>
    <div v-if="continueToUser">
      <button type="button" class="btn btn-edit" @click="$router.push({name: 'user', params: { userId: userSearch}})">Go to User Search</button>
    </div>
  </div>
    
</template>

<script>
    export default {
      data() {
        return {
          userSearch: null,
          user: [],
          continueToUser: false,
          id: localStorage.getItem('user_id'),

        }
      },

      methods: {
        searchUsers: function () {
          console.log(this.userSearch);

          if (this.userSearch == null || this.userSearch == "" || isNaN(parseInt(this.userSearch)) == true){
            alert("Enter an user id to find user!");

          } else {
            this.$http.get('http://localhost:4941/api/v1/users/' + this.userSearch)
              .then(function (response) {
                this.user = response.data;
                console.log(this.user);
                this.continueToUser = true;

              }, function (error) {
                alert("This user does not exist!");
                this.error = error;
                this.errorFlag = true;
              });
          }
        },
      }
    }


</script>

<style scoped>

</style>
