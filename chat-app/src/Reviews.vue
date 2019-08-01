<template>
  <div id="review">

    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>


    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'login'})">Login</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'signup'})">Sign up</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'user', params: { userId: id}})">Your Account</button>
    <br><br>

    <h1>Review</h1>

    <div v-if="loggedIn">
      <h1>Create a review</h1>
      <form>
        <div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">Review Body:</span>
            </div>
            <textarea class="form-control" v-model="reviewBody" aria-label="With textarea"></textarea>
          </div>

          <div class="mt-2"><strong>Star Rating:</strong></div>
          <b-form-select v-model="selectedStarRating" :options="starRatingOptions"></b-form-select>

          <div class="mt-2"><strong>Cost Rating:</strong></div>
          <b-form-select v-model="selectedCostRating" :options="costRatingOptions"></b-form-select>
        </div>


        <div class="form-group">
          <button type="button" class="btn btn-primary" v-on:click="postReview()">Post Review</button>
        </div>
      </form>
    </div>

    <div v-else-if="!loggedIn">
      Please log in
    </div>





  </div>
</template>


<script>
  export default{
    data(){
      return {
        reviewBody: '',

        selectedStarRating: null,
        starRatingOptions: [
          { value: null, text: 'Please select an option', disabled: true },
          { value: '1', text: '1' },
          { value: '2', text: '2' },
          { value: '3', text: '3' },
          { value: '4', text: '4' },
          { value: '5', text: '5' },
        ],
        selectedCostRating: null,
        costRatingOptions: [
          { value: null, text: 'Please select an option', disabled: true },
          { value: '0', text: 'Free' },
          { value: '1', text: '$' },
          { value: '2', text: '$$' },
          { value: '3', text: '$$$' },
          { value: '4', text: '$$$$' },
        ],

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

      postReview: function(){

        if(this.selectedCostRating == null || this.selectedStarRating == null || this.reviewBody == null) {
          alert("Please fill in all the fields");
        } else {
          let reviewInput = {
            "reviewBody": this.reviewBody,
            "starRating": parseInt(this.selectedStarRating),
            "costRating": parseInt(this.selectedCostRating)
          };

          this.$http.post('http://localhost:4941/api/v1/venues/' + this.$route.params.venueId + '/reviews', reviewInput,
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
      }
    }
  }
</script>

