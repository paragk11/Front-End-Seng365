<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'login'})">Login</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'signup'})">Sign up</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'users'})">Search Users</button>


    <div v-if="userAuthorized">
      <div id="userAuth">
        <br>
        <h2>User Profile: {{ user.username }}</h2>
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <td><img :src = getPhoto($route.params.userId) width = 500> </td>
            </div>
            <div class="col-sm">
              <button type="button" class="btn btn-primary" v-on:click="deletePhoto()">Delete Photo</button>
              <br/><br/>

              <form>
                <div class="form-group">
                  <label for="file">Upload Profile Photo or Replace current Profile Photo</label>
                  <input type="file" id="file" ref="myFiles" class="form-control-file"
                         @change="previewFiles" accept="image/jpeg, image/png" placeholder="upload">
                </div>
              </form>

            </div>
          </div>
        </div>


        <br/><br/>
        <div class="container">
          <h3>Given Name:</h3><p>{{ user.givenName }}</p>
        </div>

        <div class="container">
          <h3>Last Name:</h3><p>{{ user.familyName }}</p>
        </div>

        <div class="container">
          <h3>Username:</h3><p>{{ user.username }}</p>
        </div>

        <div class="container">
          <h3>Email address:</h3><p>{{ user.email }}</p>
        </div>
      </div>
      <button type="button" class="btn btn-edit" data-toggle="modal" data-target="#editUserModal">Edit
      </button>
    </div>


    <div v-else-if="$route.params.userId">
      yo
      <div id="user">
        <br>
        <h2>User Profile: {{ user.username }}</h2>
        <td><img :src = getPhoto($route.params.userId) width = 500> </td>
        <br/><br/>
        <div class="container">
          <h3>Given Name:</h3><p>{{ user.givenName }}</p>
        </div>

        <div class="container">
          <h3>Last Name:</h3><p>{{ user.familyName }}</p>
        </div>

        <div class="container">
          <h3>Username:</h3><p>{{ user.username }}</p>
        </div>
      </div>
    </div>



    <div class="modal" id="editUserModal" tabindex="-1" role="dialog" aria-labelledby="editUserModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="inputGivenName">Given name</label>
                <input type="text" class="form-control" id="inputGivenName" aria-describedby="emailHelp" v-model="givenName" placeholder="Enter new given name">
              </div>

              <div class="form-group">
                <label for="inputFamilyName">Family Name</label>
                <input type="text" class="form-control" id="inputFamilyName" aria-describedby="emailHelp" v-model="familyName" placeholder="Enter new family name">
              </div>

              <div class="form-group">
                <label for="inputNewPassword" class="control-label">New Password</label>
                <div class="form-inline row">
                  <div class="form-group col-sm-6">
                    <input type="password" class="form-control" id="inputNewPassword" v-model="newPassword" placeholder="Enter new password" required>
                  </div>

                  <div class="form-group col-sm-6">
                    <label for="inputOldPassword" class="control-label">Old Password</label>
                    <input type="password" class="form-control" id="inputOldPassword" v-model="oldPassword" placeholder="Enter old password" required>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <input type="button" class="btn btn-edit" data-dismiss="modal" v-on:click="editUser()" value="Confirm"/>
          </div>
        </div>
      </div>
    </div>
  </div>



</template>

<script>
  export default {
    name: "users",
    data() {
      return {
        error: "",
        errorFlag: false,
        userAuthorized: false,

        givenName: "",
        familyName: "",
        newPassword: "",
        oldPassword: "",
        passwordSame: false,
        files: [],
        id: localStorage.getItem('user_id'),


        user: []
      }
    },

    mounted: function () {
      this.checkAuthorized(),
      this.getUserDetails()
    },
    methods: {
      getPhoto: function (id) {
        return "http://localhost:4941/api/v1/users/" + id + "/photo";
      },

      checkAuthorized: function(){
        if (localStorage.getItem('token') !== null && this.$route.params.userId == localStorage.getItem('user_id')) {
          this.userAuthorized = true;
        }
      },

      getUserDetails: function () {
        this.$http.get("http://localhost:4941/api/v1/users/" + this.$route.params.userId
          , {
          headers: {
            'X-Authorization': localStorage.getItem('token')
          }
        })
          .then(function (response) {
            this.user = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      editUser: function () {

        let patchInput = {};

        if (this.givenName !== "") {
          patchInput["givenName"] = this.givenName;
        }
        if(this.familyName !== "") {
          patchInput["familyName"] = this.familyName;
        }
        if (this.newPassword !== "") {
          if(this.oldPassword == localStorage.getItem('password')){
            patchInput["password"] = this.newPassword;
          } else {
            this.passwordSame = true;
          }
        }

        if (this.passwordSame == false){
          this.$http.patch('http://localhost:4941/api/v1/users/' + localStorage.getItem('user_id'), patchInput, {
            headers: {
              'X-Authorization': localStorage.getItem('token')
            }
          })
            .then(function (res) {
              localStorage.setItem("password", this.newPassword);
              location.reload();
            }, function (error) {
              this.error = error.statusText;
              this.errorFlag = true;
            });
        } else {
          alert("Wrong original password!");
          this.passwordSame = false;
        }
      },

      deletePhoto: function () {
        this.$http.delete("http://localhost:4941/api/v1/users/" + this.$route.params.userId + "/photo" , {
          headers: {
            'X-Authorization': localStorage.getItem('token')
          }
          })
          .then(function (response) {
            console.log("success");
            location.reload();

          }, function(error) {
            alert("There is no photo to delete!");
        });

      },
      previewFiles() {

        this.files = this.$refs.myFiles.files[0];


        if (this.files.size < 20000000) {
          this.$http.put("http://localhost:4941/api/v1/users/" + this.$route.params.userId + "/photo" , this.files, {
            headers: {
              'X-Authorization': localStorage.getItem('token'),
              'Content-Type': this.files.type

            }
          })
            .then(function (response) {
               location.reload();

            }, function(error) {
              alert("There is no photo to delete!");
            });
        } else {
          alert("The image is too big");
        }
      }
    }
  }
</script>

<style scoped>
  .modal-footer {
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    display: inline-block;
  }
</style>
