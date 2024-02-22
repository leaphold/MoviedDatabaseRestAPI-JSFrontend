//API URLS
const BASE_URL = "https://localhost:7002";
const REVIEW_URL = BASE_URL + "/api/review";
const MOVIE_URL = BASE_URL + "/api/movie";
const ADD_REVIEW_URL = BASE_URL + "/api/review";
const ADD_MOVIE_URL = BASE_URL + "/api/movie";
const DELETE_MOVIE_URL = BASE_URL + "/api/movie";
const DELETE_REVIEW_URL = BASE_URL + "/api/review";
const UPDATE_MOVIE_URL = BASE_URL + "/api/movie";
const UPDATE_REVIEW_URL = BASE_URL + "/api/review";
const GET_MY_REVIEWS_URL = BASE_URL + "/api/Review/MyReviews";
const GET_MY_MOVIES_URL = BASE_URL + "/api/Movie/MyMovies";

//TOKEN
const token = localStorage.getItem('token');

//ALL FETCH FUNCTIONS
async function fetchAllMovies() {
  try {
    const response = await fetch(MOVIE_URL);
    if (!response.ok) {
      throw new Error("Fetch failed for movies");
    }
    const movies = await response.json();
    displayMovies(movies.$values);
  } catch (error) {
    console.log(error);
    document.getElementById("output").textContent = error.message;
  }
}

async function fetchMyMovies() {
  try {
    const response = await fetch(GET_MY_MOVIES_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error("Failed to load your movies. Ensure you're logged in and try again.");
    }
    const movies = await response.json();
    displayMyMovies(movies);
  } catch (error) {
    console.error(error);
    document.getElementById("error-message").textContent = "Error: " + error.message + ". Please try refreshing the page or contact support if the issue continues.";
  }
}

async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`${MOVIE_URL}/${movieId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Fetch failed for movie details");
    }

    const movieDetails = await response.json(); // Return the review details
    return movieDetails;
  } catch (error) {
    console.error("Error fetching review details:", error);
  }
}


async function fetchAllReviews() {
  try {
    const response = await fetch(REVIEW_URL);
    if (!response.ok) {
      throw new Error("We encountered a problem while loading reviews. Please check your connection and try again.");
    }
    const reviews = await response.json();
    displayReviews(reviews.$values);
  } catch (error) {
    console.error(error);
    document.getElementById("output2").textContent = "Error: " + error.message + ". If this problem persists, please contact our support team.";
  }
}


async function fetchMyReviews() {
  try {
    const response = await fetch(GET_MY_REVIEWS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Fetch failed for my reviews");
    }
    const reviews = await response.json();
    displayMyReviews(reviews.$values);
  } catch (error) {
    console.log(error);
    document.getElementById("error-message").textContent = error.message;
  }
}

async function fetchReviewDetails(reviewId) {
  try {
    const response = await fetch(`${REVIEW_URL}/${reviewId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Fetch failed for review details");
    }

    const reviewDetails = await response.json();
    return reviewDetails;
  } catch (error) {
    console.error("Error fetching review details:", error);
  }
}


//POST FUNCTIONS

async function postMovie(movie, token) {
  const response = await fetch(ADD_MOVIE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  });
  console.log("Sending movie data:", JSON.stringify(movie));
  console.log("Response postmovie", response);
  if (!response.ok) {
    const errorData = await response.json(); // Assuming the server responds with JSON
    throw new Error(errorData.message || "Failed to add movie");
  }
  const data = await response.json(); // Assuming server responds with added movie details or confirmation
  return data;
}

async function postReview(review, token) {
  const response = await fetch(ADD_REVIEW_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });
  console.log("Sending review data:", JSON.stringify(review));
  if (!response.ok) {
    console.log(response);
    console.log("Response postreview not OK");
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add review");
  }

  const data = await response.json();
  return data;
}


//EDIT FUNCTIONS
async function editMovie(movieId, movie) {
  const url = `${UPDATE_MOVIE_URL}/${movieId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movie),
    });

    console.log("UPDATE DATA:", JSON.stringify(movie));

    // Check for a successful response without content
    if (response.status === 204) {
      console.log("Review edited successfully");
      // Since it's a 204 No Content, there's nothing to parse, consider the operation successful
      // Redirect or perform other actions as needed here
      window.location.href = "loggedIn.html"; // Or any other success handling
      return; // Exit the function early as the operation was successful
    }

    // If the response status is not 204, check if it's not OK to handle errors
    if (!response.ok) {
      // Attempt to read response as text since there might not be a JSON body
      const errorText = await response.text();
      throw new Error(errorText || "Error editing review");
    }

    // If there's content (which is unexpected for this operation), parse it
    const data = await response.json();
    console.log("Edit review successfully", data);
    return data; // Return data if needed, though for 204 this part shouldn't be reached
  } catch (error) {
    console.error("Error editing review:", error);
    // Handle any errors that occurred during the fetch request
    throw error; // Rethrow or handle as needed (e.g., display error message to the user)
  }
}

async function editReview(reviewId, review) {
  const url = `${UPDATE_REVIEW_URL}/${reviewId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    console.log("UPDATE DATA:", JSON.stringify(review));

    // Check for a successful response without content
    if (response.status === 204) {
      console.log("Review edited successfully");
      // Since it's a 204 No Content, there's nothing to parse, consider the operation successful
      // Redirect or perform other actions as needed here
      window.location.href = "loggedIn.html"; // Or any other success handling
      return; // Exit the function early as the operation was successful
    }

    // If the response status is not 204, check if it's not OK to handle errors
    if (!response.ok) {
      // Attempt to read response as text since there might not be a JSON body
      const errorText = await response.text();
      throw new Error(errorText || "Error editing review");
    }
    const data = await response.json();
    console.log("Edit review successfully", data);
    return data;} 
    catch (error) {
    console.error("Error editing review:", error);
    throw error; 
  }
}

//DELETE FUNCTIONS
async function deleteMovie(movieId) {
  try {
    const response = await fetch(`${DELETE_MOVIE_URL}/${movieId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Unable to delete movie. Please verify your permissions and try again.");
    }
    console.log(`Movie with ID: ${movieId} deleted successfully.`);
    window.location.reload(); // Refreshing the page to show the update. Consider dynamically updating the UI instead.
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message + ". We're sorry for the inconvenience. Please try again later or contact our support team for assistance.");
  }
}


async function deleteReview(reviewId) {
  const response = await fetch(`${DELETE_REVIEW_URL}/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    // Attempt to read and throw the error message only if the response is not ok
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete review");
    } catch (error) {
      // Handle cases where the error response is not JSON or another error occurs
      throw new Error("Failed to delete review due to an unexpected error");
    }
  }
  // Assuming no content is returned for a successful delete, so no need to parse JSON
  console.log(`Review deleted successfully. Deleting review with ID: ${reviewId}`);
  
  window.location.reload(); // Consider more efficient ways to update the UI without reloading
}

//DISPALY FUNCTIONS

function displayMovies(movies) {
  const outputElement = document.getElementById("output");
  outputElement.innerHTML = ""; // Clear previous content
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");
    movieDiv.innerHTML = `<h5>Title: ${movie.title}</h5><p>Year: ${movie.year}</p>`;
    outputElement.appendChild(movieDiv);
  });
}


function displayMyMovies(responseData) {
  // Directly access the $values property from the responseData object
  const moviesData = responseData.$values;
  const outputElement = document.getElementById("my-movies");

  if (!outputElement) {
    console.error("Element with ID 'my-movies' not found.");
    return;
  }

  outputElement.innerHTML = ""; // Clear any existing content

  if (Array.isArray(moviesData) && moviesData.length > 0) {
    moviesData.forEach((movie) => {
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("moviesData");

      // Create an edit button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("btn", "btn-primary", "mr-2"); 
      editButton.onclick = function() {
        const movieId = movie.id;
        localStorage.removeItem("currentMovieId");
        localStorage.setItem('currentMovieId', movieId);
        window.location.href = `editMovie.html?movieId=${movie.id}`;
      };

      // Create a delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn", "btn-danger"); 
      deleteButton.onclick = function() {
        const isConfirmed = confirm("Are you sure you want to delete this movie?");
        if (isConfirmed) {
          deleteMovie(movie.id);
        }
      };

      movieDiv.innerHTML = `<h3>Movie: ${movie.title}</h3><p>Year: ${movie.year}</p>`;
      movieDiv.appendChild(editButton);
      movieDiv.appendChild(deleteButton);
      outputElement.appendChild(movieDiv);
    });
  } else {
    // Handle case when no movies are found
    outputElement.innerHTML = "No movies found.";
  }
}

function displayMovieDetails(movie) {
  const detailsElement = document.getElementById('movie-details');
  detailsElement.innerHTML = `
    <h2>${movie.title} (${movie.year})</h2>
    <p>Movie ID: ${movie.id}</p>`;
}


function displayReviews(reviews) {
  const outputElement = document.getElementById("output2");
  reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");
    reviewDiv.innerHTML = `<h5>Movie: ${review.movieTitle}</h5><p>User: ${review.email}</p><p>Rating: ${
review.rate !== undefined ? review.rate : "N/A"
}</p><p>Comment: ${review.comment ? review.comment : "N/A"}</p>`;
    outputElement.appendChild(reviewDiv);
  });
}


function displayMyReviews(reviews) {
  const outputElement = document.getElementById("my-reviews");
  reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");

    // Create an edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-primary", "mr-2");
    editButton.onclick = function() {
      // Extract the review ID from the review object
      const reviewId = review.id;
      localStorage.removeItem("currentReviewId");
      localStorage.setItem('currentReviewId', reviewId); // Save the reviewId in local storage
      // Redirect to the edit page with the review ID in the query parameter
      window.location.href = `editReview.html?reviewId=${reviewId}`;
    };

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.onclick = function() {
      // Confirm before delete action
      const isConfirmed = confirm("Are you sure you want to delete this review?");
      if (isConfirmed) {
        deleteReview(review.id); // Call deleteReview function with the review ID
      }
    };

    reviewDiv.innerHTML = `<h3>Movie: ${review.movieTitle}</h3><p>Rating(1-5):${review.rate}<br>Comment: ${review.comment}</p>`;
    reviewDiv.appendChild(editButton);
    reviewDiv.appendChild(deleteButton); // Append the delete button to the review div
    outputElement.appendChild(reviewDiv);
  });
}

function displayReviewDetails(review) {
  const detailsElement = document.getElementById('movie-details');
  detailsElement.innerHTML = `
     <h2>${review.movie.title}</h2><br> 
    <h2>${review.rate} (${review.comment})</h2>
    <p>Movie ID: ${review.id}</p>`;
}


//SEARCH FUNCTIONS
async function handleSearchMovie(event) {
    event.preventDefault();
    const movieIdInput = document.getElementById('movie-id-input');
    const movieId = movieIdInput.value.trim();
    if (!movieId) {
        return;
    }
    try {
        const movieDetails = await fetchMovieDetails(movieId);
        if (movieDetails) {
            displayMovieDetails(movieDetails);
        } else {
            document.getElementById('movie-details').innerHTML = 'Movie not found.';
        }
    } catch (error) {
        document.getElementById('movie-details').innerHTML = 'Error fetching movie details.';
        console.error('Error fetching movie details:', error);
    }
}

async function handleSearchReview(event) {
    event.preventDefault(); 
    const reviewIdInput = document.getElementById('review-id-input');
    const reviewId = reviewIdInput.value.trim();
    if (!reviewId) {
        return;
    }

    try {
        const reviewDetails = await fetchReviewDetails(reviewId);
        if (reviewDetails) {
            displayReviewDetails(reviewDetails);
        } else {
            document.getElementById('review-details').innerHTML = 'Review not found.';
        }
    } catch (error) {
        document.getElementById('review-details').innerHTML = 'Error fetching movie details.';
        console.error('Error fetching review details:', error);
    }
}

//EXPORT FUNCTIONS
  export {handleSearchMovie, handleSearchReview, fetchMovieDetails, fetchMyMovies, fetchReviewDetails, editMovie, editReview, fetchAllMovies, fetchAllReviews, fetchMyReviews, postReview, postMovie, deleteReview, deleteMovie};
