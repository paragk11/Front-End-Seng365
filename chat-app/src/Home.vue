<template>
  <div>
    Home Page

    <br><br>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'login'})">Login</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'signup'})">Sign up</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'user', params: { userId: id}})">Your Account</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'users'})">Search Users</button>




    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
      Launch demo modal
    </button>

    <!-- Modal -->
    <div class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>


  </div>




</template>

<script>
  export default {
    name: "Home",
    data(){
    return{
      id: localStorage.getItem('user_id'),
    }
    }
  }
</script>

<style scoped>

</style>
