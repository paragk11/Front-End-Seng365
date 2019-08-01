
<template>
  <div id="search">

    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>



    <button type="button" class="btn btn-edit" @click="$router.push({name: 'home'})">Home</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'login'})">Login</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'logout'})">Logout</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'search'})">Search Venues</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'user', params: { userId: id}})">Your Account</button>
    <button type="button" class="btn btn-edit" @click="$router.push({name: 'users'})">Search Users</button>



    <h1>Search Venues</h1>
    <br><br>

    <div>
      <form>
        <div>
          <div>
            <div class="form-group"><strong>Search by City:</strong></div>
            <b-form-select v-model="selectedCity" :options="cities"></b-form-select>

          </div>
          <br>
          <div class="input-group">
          </div>
          <input name="searchField" type="text" placeholder="Search.." maxlength="30" v-model="search">
          <br>
          <br>
          <div>
            <div class="form-group"><strong>Sort by Category:</strong></div>
            <b-form-select v-model="selectedCategory" :options="categoryOptions"></b-form-select>
          </div>
          <br>
          <div>
            <div class="form-group"><strong>Sort by rating:</strong></div>
            <b-form-select v-model="selectedSortRatings" :options="sortRatingsOptions"></b-form-select>
          </div>
          <br>
          <div>
            <div class="form-group"><strong>Filter Minimum Star Ratings:</strong></div>
            <b-form-select v-model="selectedFilterStarRatings" :options="filterStarRatingsOptions"></b-form-select>
          </div>
          <br>
          <div>
            <div class="form-group"><strong>Filter Maximum Cost Ratings:</strong></div>
            <b-form-select v-model="selectedFilterCostRatings" :options="filterCostRatingsOptions"></b-form-select>
          </div>
        </div>
        <br>


        <div class="form-group">
          <button type="button" class="btn btn-primary" v-on:click="getVenuesFiltered()">Search</button>
        </div>
      </form>



      <div>
        <table>
          <tr cellpadding="100">
            <th>Venue Name</th>
            <th>Category</th>
            <th>Mean Star Rating</th>
            <th>Mode Cost Rating</th>
            <th>Link</th>
            <th>Photo</th>
          </tr>
          <tr v-for="venue in venues">
              <td> {{ venue.venueName }} </td>
              <td> {{ categoryOptions[venue.categoryId].text }} </td>
              <td> {{ venue.meanStarRating }} </td>
              <td> {{ venue.modeCostRating }} </td>

              <td> <router-link :to="{ name: 'venue', params: { venueId: venue.venueId}}">View</router-link> </td>


              <template v-if="venue.primaryPhoto == null">
                <td><img src = './assets/logo.png' width = 100> </td>
              </template>
              <template v-else>
                <td><img :src = getPhoto(venue.venueId,venue.primaryPhoto) width = 100> </td>
              </template>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
  export default{
    data(){
      return {

        venues: [],
        category: "",
        cities: ["--None--"],

        id: localStorage.getItem('user_id'),


        meanStarRatingMan: null,
        modeCostRatingMan: null,

        selectedCategory: null,
        selectedSortRatings: '1',
        selectedFilterStarRatings: null,
        selectedFilterCostRatings: null,
        search: null,
        selectedCity: null,

        categoryOptions: [
          { value: null, text: '--None--'},
          { value: '1', text: 'Accommodation' },
          { value: '2', text: 'Cafes & Restaurants' },
          { value: '3', text: 'Attractions' },
          { value: '4', text: 'Events' },
          { value: '5', text: 'Nature Spots' },
        ],

        sortRatingsOptions: [
          { value: '1', text: 'Highest to lowest average (mean) star rating --Default--' },
          { value: '2', text: 'Lowest to highest average (mean) star rating' },
          { value: '3', text: 'Highest to lowest average (mode) cost rating' },
          { value: '4', text: 'Lowest to highest average (mode) cost rating' },
        ],

        filterStarRatingsOptions: [
          { value: null, text: '--None--' },
          { value: '1', text: '1' },
          { value: '2', text: '2' },
          { value: '3', text: '3' },
          { value: '4', text: '4' },
          { value: '5', text: '5' },
        ],

        filterCostRatingsOptions: [
          { value: null, text: '--None--'},
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
      this.getVenues();

    },
    methods: {
      getPhoto: function (id, photoName) {
        return "http://localhost:4941/api/v1/venues/" + id + "/photos/" + photoName;
      },

      getVenues: function () {

        this.$http.get('http://localhost:4941/api/v1/venues/')
          .then(function (response) {
            this.venues = response.data;
            console.log(this.venues);

            for(let i=0; i < this.venues.length; i++){
              if (this.venues[i].meanStarRating == null){
                this.venues[i].meanStarRating = 3;
                console.log(this.venues);
              }
              if (this.venues[i].modeCostRating == null || this.venues[i].modeCostRating == ""){
                this.venues[i].modeCostRating = "free";
              } else {
                this.venues[i].modeCostRating = "$".repeat(this.venues[i].modeCostRating);
              }

              if (!this.cities.includes(this.venues[i].city)){
                this.cities.push(this.venues[i].city);
              }
            }
            console.log(this.cities);
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      checkLoggedIn: function(){
        if(localStorage.getItem('token') !== null){
          this.loggedIn = true;
        }
      },

      getVenuesFiltered: function(){

        let url = "http://localhost:4941/api/v1/venues/";

        let query = this.selectedCategory;

        if(query !== null){
          url += ("?categoryId=" + this.selectedCategory);
        }
        if(this.search !== null){
          if (this.search !== ""){
            if(query == null){
              url += ("?q=" + this.search);
            } else {
              url += ("&q=" + this.search);
            }
            query += this.search;
          }
        }
        if (this.selectedCity == null || this.selectedCity == "--None--"){
        }else {
          if(query == null){
            url += ("?city=" + this.selectedCity);
          } else {
            url += ("&city=" + this.selectedCity);
          }
          query += this.selectedCity;
        }
        if(this.selectedSortRatings !== null){
          if(query == null){
            if (this.selectedSortRatings == 1){
              url += ("?sortBy=STAR_RATING")
            }else if(this.selectedSortRatings == 2){
              url += ("?sortBy=STAR_RATING" + "&reverseSort=true");
            } else if (this.selectedSortRatings == 3){
              url += ("?sortBy=COST_RATING" + "&reverseSort=true");
            } else if(this.selectedSortRatings == 4){
              url += ("?sortBy=COST_RATING");
            }
          } else {
            if (this.selectedSortRatings == 1){
              url += ("&sortBy=STAR_RATING")
            }else if(this.selectedSortRatings == 2){
              url += ("&sortBy=STAR_RATING" + "&reverseSort=true");
            } else if (this.selectedSortRatings == 3){
              url += ("&sortBy=COST_RATING" + "&reverseSort=true");
            } else if(this.selectedSortRatings == 4){
              url += ("&sortBy=COST_RATING");
            }
          }
          query += this.search;
        }
        if(this.selectedFilterStarRatings !== null){
          if(query == null){
            url += ("?minStarRating=" + this.selectedFilterStarRatings);
          } else {
            url += ("&minStarRating=" + this.selectedFilterStarRatings);
          }
          query += this.search;
        }
        if(this.selectedFilterCostRatings !== null){
          if(query == null){
            url += ("?maxCostRating=" + this.selectedFilterCostRatings);
          } else {
            url += ("&maxCostRating=" + this.selectedFilterCostRatings);
          }
          query += this.search;
        }

        console.log(url);
        console.log(this.cities);

        this.$http.get(url

        ).then(function(response){
            this.venues = response.data;

          for(let i=0; i < this.venues.length; i++){
            if (this.venues[i].meanStarRating == null){
              this.venues[i].meanStarRating = 3;
            }
            if (this.venues[i].modeCostRating == null){
              this.venues[i].modeCostRating = 0;
            }
            if (this.venues[i].modeCostRating == null || this.venues[i].modeCostRating == ""){
              this.venues[i].modeCostRating = "free";
            } else {
              this.venues[i].modeCostRating = "$".repeat(this.venues[i].modeCostRating);
            }

          }

        }, function (error) {
          alert(error.statusText);
        });
      }
    }
  }
</script>


<style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 4px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }
</style>
