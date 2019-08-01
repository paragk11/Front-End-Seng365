<template>
  <div id="venues">
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'login'})">Login</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'signup'})">Sign up</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'user', params: { userId: id}})">Your Account</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'users'})">Search Users</button>


    <div v-if="$route.params.venueId">
      <br>
      <template v-if="authed">
        <button type="button" class="btn btn-edit" data-toggle="modal" data-target="#editVenueModal">Edit
        </button>
      </template>
      <h2>Name: {{ venue.venueName }}</h2>

      <template v-if="this.photos.length == 0">
        <td><img src = './assets/logo.png' width = 200> </td>
      </template>
      <template v-else>
        <template v-for="photo in photos">
          <td><img :src = getPhoto($route.params.venueId,photo) width = 200> </td>
        </template>

      </template>

      <br/><br/>
      <div class="container">
        <h3>Category:</h3><p>{{ venue.category.categoryName }}</p>
      </div>
      <div class="container">
        <h3>Administrator username:</h3><p>{{ venue.admin.username }}</p>
      </div>

      <div class="container">
        <h3>City:</h3><p>{{ venue.city }}</p>
      </div>

      <div class="container">
        <h3>Address:</h3><p>{{ venue.address }}</p>
      </div>
      <div class="container">
        <h3>Date Added:</h3><p>{{ this.date  }}</p>
      </div>
      <div class="container">
        <h3>Short Description:</h3><p>{{ venue.shortDescription }}</p>
      </div>
      <div>
        <b-button v-b-toggle.collapse-1 variant="primary">Long Description</b-button>
        <b-collapse id="collapse-1" class="mt-2">
          <b-card>
            <div class="container">
              <h3></h3><p>{{ venue.shortDescription }}</p>
              <h3></h3><p>{{ venue.longDescription }}</p>
            </div>
          </b-card>
        </b-collapse>
      </div>
      <div class="container">
        <h3>Mean Star Rating:</h3><p>{{ this.meanStar }}</p>
      </div>
      <div class="container">
        <h3>Mode Costing Rating: </h3><p>{{ this.modeCost }}</p>
      </div>
      <button type="button" class="btn btn-edit" @click="$router.push({name: 'review'})">Post a review</button>
      <button type="button" class="btn btn-edit" @click="$router.push({name: 'review'})">Read reviews</button>
    </div>


    <div v-else-if="!$route.params.venueId && loggedIn">
      <h1>Create a venue:</h1>
      <form>
        <div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Venue Name:</span>
            </div>
            <input class="form-control" v-model="inputVenueName" aria-label="Venue Name">
          </div>

          <div>
            <div class="mt-2"><strong>Category:</strong></div>
            <b-form-select v-model="selectedCategory" :options="categoryOptions"></b-form-select>
          </div>
          <br>

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Short Description:</span>
            </div>
            <input class="form-control" v-model="inputShortDescription" aria-label="Short Description">
          </div>
          <br>

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Long Description</span>
            </div>
            <textarea class="form-control" v-model="inputLongDescription" aria-label="With textarea"></textarea>
          </div>
          <br>

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">City:</span>
            </div>
            <input class="form-control" v-model="inputCity" aria-label="City">
          </div>
          <br>

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Address:</span>
            </div>
            <input class="form-control" v-model="inputAddress" aria-label="Address">
          </div>
          <br>

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Latitude:</span>
            </div>
            <input class="form-control" v-model="inputLatitude" aria-label="Latitude">
          </div>
          <br>

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Longitude:</span>
            </div>
            <input class="form-control" v-model="inputLongitude" aria-label="Longitude">
          </div>
          <br>
        </div>

        <div class="form-group">
          <button type="button" class="btn btn-primary" v-on:click="createVenue()">Create Venue</button>
        </div>
      </form>
    </div>



    <div class="modal" id="editVenueModal" tabindex="-1" role="dialog" aria-labelledby="editUserModalLabel"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editUserModalLabel">Edit Venue</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="inputVenueName">Venue Name</label>
                <input type="text" class="form-control" id="inputVenueName" v-model="inputVenueName" placeholder="Enter new Venue name">
              </div>

              <div>
                <div class="form-group"><strong>Category:</strong></div>
                <b-form-select v-model="selectedCategory" :options="categoryOptions"></b-form-select>
              </div>

              <div class="form-group">
                <label for="inputCity">City</label>
                <input type="text" class="form-control" id="inputCity" v-model="inputCity" placeholder="Enter new city">
              </div>

              <div class="form-group">
                <label for="inputAddress">Address</label>
                <input type="text" class="form-control" id="inputAddress" v-model="inputAddress" placeholder="Enter new address">
              </div>

              <div class="form-group">
                <label for="inputShortDescription">Short Description</label>
                <input type="text" class="form-control" id="inputShortDescription" v-model="inputShortDescription" placeholder="Enter new Short description">
              </div>

              <div class="form-group">
                <label for="inputLongDescription">Long Description</label>
                <textarea class="form-control" id="inputLongDescription" v-model="inputLongDescription" aria-label="With textarea" placeholder="Enter Long description"></textarea>
              </div>

              <div class="form-group">
                <label for="inputLatitude">Latitude</label>
                <input type="text" class="form-control" id="inputLatitude" v-model="inputLatitude" placeholder="Enter new latitude">
              </div>

              <div class="form-group">
                <label for="inputLongitude">Longitude</label>
                <input type="text" class="form-control" id="inputLongitude" v-model="inputLongitude" placeholder="Enter new longitude">
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <input type="button" class="btn btn-edit" data-dismiss="modal" v-on:click="editVenue()" value="Confirm"/>
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
        loggedIn: false,
        authed: false,

        venueName: "",
        category: "",
        newPassword: "",
        oldPassword: "",
        passwordSame: false,
        date: "",
        modeCost: null,
        meanStar: null,

        inputVenueName: "",
        selectedCategory: "",
        inputShortDescription: "",
        inputLongDescription: "",
        inputCity: "",
        inputAddress: "",
        inputLatitude: "",
        inputLongitude: "",

        photos: [],

        id: localStorage.getItem('user_id'),



        categoryOptions: [
          { value: null, text: 'Please select an option', disabled: true },
          { value: '1', text: 'Accommodation' },
          { value: '2', text: 'Cafes & Restaurants' },
          { value: '3', text: 'Attractions' },
          { value: '4', text: 'Events' },
          { value: '5', text: 'Nature Spots' },
        ],


        venue: [],
        venues:[],
        venuesFinal: []
      }
    },
    mounted: function() {
      this.getVenue();
      this.checkLoggedIn();

    },
    methods: {
      getPhoto: function (id, photo) {
        return "http://localhost:4941/api/v1/venues/" + id + "/photos/" + photo;
      },

      checkLoggedIn: function(){
        if(localStorage.getItem('token') !== null){
          this.loggedIn = true;
        }
      },

      editVenue: function(){

        let patchInput = {};

        if (this.inputVenueName !== "") {
          patchInput["venueName"] = this.inputVenueName;
        }
        if(this.selectedCategory !== "") {
          patchInput["categoryId"] = parseInt(this.selectedCategory);
        }
        if (this.inputCity !== "") {
          patchInput["city"] = this.inputCity;
        }
        if (this.inputShortDescription !== "") {
          patchInput["shortDescription"] = this.inputShortDescription;
        }
        if (this.inputLongDescription !== "") {
          patchInput["longDescription"] = this.inputLongDescription;
        }
        if (this.inputAddress !== "") {
          patchInput["address"] = this.inputAddress;
        }
        if (this.inputLatitude !== "") {
          patchInput["latitude"] = parseFloat(this.inputLatitude);
        }
        if (this.inputLongitude !== "") {
          patchInput["longitude"] = parseFloat(this.inputLongitude);
        }


         if(Object.keys(patchInput).length == 0 || patchInput == null || patchInput == undefined){
           alert("Fill in fields to edit venue!")
         } else {
           this.$http.patch('http://localhost:4941/api/v1/venues/' + this.$route.params.venueId, patchInput, {
             headers: {
               'X-Authorization': localStorage.getItem('token')
             }
           })
             .then(function (res) {
               location.reload();
             }, function (error) {
               alert(error.statusText);
               // this.error = error.statusText;
               // this.errorFlag = true;
             });

         }



      },

      createVenue: function(){

        if (this.inputVenueName == "" || this.selectedCategory == "" || this.inputShortDescription == "" || this.inputLongDescription == "" ||
          this.inputCity == "" || this.inputAddress == "" || this.inputLatitude == "" || this.inputLongitude == "") {
          alert("Please fill in all fields");
        } else {

          let venueInput = {
            "venueName": this.inputVenueName,
            "categoryId": parseInt(this.selectedCategory),
            "city": this.inputCity,
            "shortDescription": this.inputShortDescription,
            "longDescription": this.inputLongDescription,
            "address": this.inputAddress,
            "latitude": parseFloat(this.inputLatitude),
            "longitude": parseFloat(this.inputLongitude)
          };

          this.$http.post('http://localhost:4941/api/v1/venues/', venueInput,
            {
              headers: {
                'X-Authorization': localStorage.getItem('token')
              }
            }

          ).then(function(response){
            location.reload();
            alert("Review Posted");


          }, function (error) {
            alert(error.statusText);
          });

        }
      },

      getVenue: function () {
        console.log(this.photos);
        if(this.$route.params.venueId) {
          this.$http.get("http://localhost:4941/api/v1/venues/" + this.$route.params.venueId
          ).then(function (response) {
            this.venue = response.data;
            this.date = (response.data.dateAdded).slice(0,10);

            console.log(this.venue);

            if(this.venue.admin.userId == localStorage.getItem('user_id')){
              this.authed = true;
            }

            this.$http.get("http://localhost:4941/api/v1/venues/"
            ).then(function (response) {
              this.venues = response.data;

              for(let i=0; i < this.venues.length; i++){

                if (this.venues[i].venueId == this.$route.params.venueId){
                  this.venuesFinal = this.venues[i];
                  this.meanStar = this.venuesFinal.meanStarRating;
                  this.modeCost = "$".repeat(this.venuesFinal.modeCostRating);
                  if(this.modeCost == ""){
                    this.modeCost = "Free";
                  }
                }
              }

              for (let i=0; i < this.venue.photos.length; i++){
                this.photos.push(this.venue.photos[i].photoFilename);
              }

            }, function (error) {
              this.error = error;
              this.errorFlag = true;
            })

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
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
