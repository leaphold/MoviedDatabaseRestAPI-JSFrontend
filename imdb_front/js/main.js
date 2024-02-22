// Import the necessary functions from your modules
import { login,registerUser, logout} from './auth.js';
import { handleSearchReview, handleSearchMovie, fetchMovieDetails,editMovie, fetchMyMovies, fetchReviewDetails, editReview, fetchAllReviews, fetchAllMovies, fetchMyReviews, postReview, postMovie} from './crudFunctions.js';

const token = localStorage.getItem('token');
const currentReviewId= localStorage.getItem('currentReviewId');
const currentMovieId= localStorage.getItem('currentMovieId');

document.addEventListener("DOMContentLoaded", function () {

  const path=window.location.pathname;
  const movieSearchForm = document.getElementById('movie-search-form');
  if (movieSearchForm) {
    movieSearchForm.addEventListener('submit', handleSearchMovie);
  }

  const reviewSearchForm = document.getElementById('review-search-form');
  if (reviewSearchForm) {
    reviewSearchForm.addEventListener('submit', handleSearchReview);
  }

  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default action if it's a link
      logout(); // Call the logout function
    });
  }

//Runs functions based on the page
  if (path.endsWith("index.html"))
{
    setupLoginForm();
  }

  if (path.endsWith("CreateAccount.html"))
  setupRegistrationForm();

  if (path.endsWith("index.html"))
{fetchAllReviews();
    fetchAllMovies();
  }

  if (path.endsWith("loggedIn.html"))
{
    fetchMyReviews();
    setupAddMovieForm();
    fetchMyMovies();
  }


  if (path.endsWith("manageReviews.html"))
{
    fetchAllMovies();
    setupAddReviewForm();
  }

  if (path.endsWith("editReview.html"))
{  
    fetchReviewDetails(currentReviewId);
    setupEditForm();
  }


  if (path.endsWith("editMovie.html"))
{  
    fetchMovieDetails(currentMovieId);
    setupEditMovieForm();
  }

  if (path.endsWith("manageMovies.html"))
{
    setupAddMovieForm();
  }
});

// Function to setup the login form
function setupLoginForm() {
  const loginForm = document.getElementById("login-form");
  const errorMessageElement = document.getElementById("error-message"); // Make sure this ID matches your error message element

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      try {
        const token = await login(email, password);
        console.log("Login successful, token:", token);
        window.location.assign("loggedIn.html"); // Redirect or update UI as needed
      } catch (error) {
        console.error("Login failed:", error.message);
        if (errorMessageElement) {
          errorMessageElement.textContent = error.message; // Display the error message
          errorMessageElement.style.display = 'block'; 
        }
      }
    });
  }
}

// Function to setup the registration form
function setupRegistrationForm() {
  const registrationForm = document.getElementById("createAccountForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent the default form submission
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        await registerUser(email, password);
        window.location.assign("./index.html"); // Redirect on successful registration
      } catch (error) {
        const errorMessageDiv = document.getElementById("error-message");
        errorMessageDiv.innerHTML = "Adding review failed: " + error.message;
        errorMessageDiv.style.display = 'block'; 
      }
    });
  }
}

// Function to setup the add review form
function setupAddReviewForm(){
  const addReviewForm = document.getElementById("add-review");
  if (addReviewForm){
    addReviewForm.addEventListener("submit", async (e)=>
    {e.preventDefault();

        const rate = document.getElementById("rating").value;
        const comment = document.getElementById("comment").value;
        const movieId = document.getElementById("movie").value;

        if(!token){
          console.log("User is not logged in")
          document.getElementById('error-message').innerHTML = "User is not logged in.";
          document.getElementById('error-message').style.display = 'block'; // Make sure to display the error
          return;
        }

        try{
          await postReview({rate, comment, movieId}, token);
          console.log("review posted")
          window.location.href = "loggedIn.html";
        }
        catch(error)
      {
          console.log("Adding review Falied"); 
          const errorMessageDiv = document.getElementById("error-message");
          errorMessageDiv.innerHTML = "Adding review failed: " + error.message;
          errorMessageDiv.style.display = 'block'; 
        }
      });
  }
}

// Function to setup the edit review form
function setupEditForm() {
  const reviewId = localStorage.getItem("currentReviewId");
  if (!reviewId) {
    console.error("Review ID is missing.");
    document.getElementById('error-message').innerHTML = 'Review not found.';
    return;
  }

  fetchReviewDetails(reviewId)
    .then(reviewData => {
      if (!reviewData) {
        console.error("Failed to fetch review details.");
        const errorMessageDiv = document.getElementById("error-message");
        errorMessageDiv.innerHTML = "Adding review failed: " + error.message;
        errorMessageDiv.style.display = 'block';

        return;
      }
      console.log("Review details:", reviewData);

      // Populate the form fields with review data
      document.getElementById('movie-title').textContent = reviewData.movie.title || '';
      document.getElementById('rating').value = reviewData.rate || '';
      document.getElementById('comment').value = reviewData.comment || '';
      // Add more fields as necessary
    })
    .catch(error => {
      console.error("Error fetching review details:", error);
      document.getElementById('error-message').innerHTML = "Error fetching review details: " + error.message;
    });

  const editReviewForm = document.getElementById("edit-review");
  if (!editReviewForm) {
    console.error("Edit review form element not found.");
    return;
  }

  editReviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the updated review data from the form
    const updatedReview = {
      id: parseInt(reviewId), 
      rate: parseInt(document.getElementById('rating').value), // Parse to integer if necessary
      comment: document.getElementById('comment').value,
    };
    try {
      await editReview(reviewId, updatedReview); // Call editReview function to update the review
      console.log("Review edited successfully.");
      window.location.href = "loggedIn.html"; // Redirect to logged in page after successful update
    } catch (error) {
      alert("Error editing review:", error);
      console.error("Error editing review:", error);
      const errorMessageDiv = document.getElementById("error-message");
      errorMessageDiv.innerHTML = "Adding review failed: " + error.message;
      errorMessageDiv.style.display = 'block';
    }
  });
}

// Function to setup the edit movie form
function setupEditMovieForm() {
  const movieId = localStorage.getItem("currentMovieId");

  // Check if reviewId is null or undefined
  if (!movieId) {
    console.error("Movie ID is missing.");
    const errorMessageDiv = document.getElementById("error-message");
    errorMessageDiv.innerHTML = 'Movie not found.';
    errorMessageDiv.style.display = 'block';
    return;
  }

  fetchMovieDetails(movieId)
    .then(movieData => {
      if (!movieData) {
        return;
      }
      console.log("Movie details:", movieData);

      document.getElementById('title').value = movieData.title || '';
      document.getElementById('year').value = movieData.year || '';
      console.log("title:", movieData.title);
      console.log("year:", movieData.year);

    })
    .catch(error => {
      console.error("Error fetching movie details:", error);
    });

  const editMovieForm = document.getElementById("edit-movie");
  if (!editMovieForm) {
    console.error("Edit movie form element not found.");
    return;
  }

  editMovieForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the updated review data from the form
    const updatedMovie = {
      id: parseInt(movieId), 
      title: document.getElementById('title').value,
      year: document.getElementById('year').value,
    };


    try {
      await editMovie(movieId, updatedMovie);
      console.log("Review edited successfully.");
      window.location.href = "loggedIn.html";
    } catch (error) {
      console.error("Error editing review:", error);
      const errorMessageDiv = document.getElementById("error-message");
      errorMessageDiv.innerHTML = "Adding review failed: " + error.message;
      errorMessageDiv.style.display = 'block';
    }
  });
}

function setupAddMovieForm() {
  const addMovieForm = document.getElementById("add-movie"); 
  if (addMovieForm) {
    addMovieForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Extract movie details from form inputs
      const title = document.getElementById("title").value;
      const year = document.getElementById("year").value;

      if (!token) {
        document.getElementById('error-message').innerHTML = "User is not logged in.";
        console.error("User is not logged in.");
        return; // Stop execution if there is no token (user not logged in)
      }
      try {
        await postMovie({ title, year}, token);
        console.log("Movie added successfully.");
        alert("movie added")
        fetchMyMovies();
        window.location.href = "loggedIn.html";
      } catch (error) {
        console.error("Adding movie failed:", error.message);
        const errorMessageDiv = document.getElementById("error-message");  
        errorMessageDiv.innerHTML = "Adding movie failed: " + error.message;
        errorMessageDiv.style.display = 'block';
      }
    });
  }
}

