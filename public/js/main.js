const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
addToCartButtons.forEach(button => {
    let isClicked = false; // Add a flag to track whether the button has been clicked

    button.addEventListener("click", () => {
        if (!isClicked) { // Check if the button has not been clicked yet
            isClicked = true; // Set the flag to true
            const itemId = button.getAttribute("data-id");
            const itemTitle = button.parentElement.querySelector("h3").textContent;
            const itemPrice = parseFloat(button.parentElement.querySelector("p").textContent.match(/\d+\.\d+/)[0]);
            const itemImage = button.parentElement.querySelector("img").getAttribute("src");

            // Create an object to represent the item
            const item = {
                id: itemId,
                title: itemTitle,
                price: itemPrice,
                image: itemImage, // Include the image URL
            };

            // Update the cart count
            const currentCartCount = parseInt(localStorage.getItem('cartCount')) || 0;
            const newCartCount = currentCartCount;
            localStorage.setItem('cartCount', newCartCount);
            updateCartCount(newCartCount);

            // Add the item to the cartItems array in localStorage
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push(item);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            console.log("Added item with ID:", itemId);
        }
    });
});




      // JavaScript for the item slider
      const sliderContainer = document.querySelector('.slider-container');
      const slider = document.querySelector('.slider');
      const itemWidth = 300; // Adjust this value to control the width of each item in the slider
      const slideSpeed = 2; // Adjust this value for slide speed (lower value for slower, higher for faster)
      const slideDelay = 3000; // Adjust this value to control the delay between slides (milliseconds)
      const numItems = slider.children.length;
      const cloneCount = 3; // Adjust this value based on the number of clones you want
  
      let currentTranslate = 0;
      let autoSlideInterval; // Variable to store the interval ID
  
      slider.style.transition = `transform ${slideSpeed}s ease-in-out`;
  
      function updateSliderPosition() {
          slider.style.transform = `translateX(${currentTranslate}px)`;
      }
  
      // Function to move to the next slide
      function moveToNextSlide() {
          currentTranslate -= itemWidth;
          slider.style.transition = `transform ${slideSpeed}s ease-in-out`;
          updateSliderPosition();
  
          // Check if we need to loop seamlessly
          if (currentTranslate < -numItems * itemWidth) {
              currentTranslate = 0;
              slider.style.transition = 'none';
              updateSliderPosition();
              setTimeout(() => {
                  slider.style.transition = `transform ${slideSpeed}s ease-in-out`;
                  moveToNextSlide();
              }, 0);
          }
      }
  
      // Clone items for seamless looping
      for (let i = 0; i < cloneCount; i++) {
          const clone = slider.children[i].cloneNode(true);
          slider.appendChild(clone);
      }
  
      // Start the auto sliding
      function startAutoSlide() {
          autoSlideInterval = setInterval(moveToNextSlide, slideDelay);
      }
  
      // Stop the auto sliding
      function stopAutoSlide() {
          clearInterval(autoSlideInterval);
      }
  
      // Initial start of auto sliding
      startAutoSlide();
  
      slider.addEventListener('mouseenter', () => {
          stopAutoSlide(); // Stop auto sliding on hover
      });
  
      slider.addEventListener('mouseleave', () => {
          startAutoSlide(); // Resume auto sliding after hover
      });
  
   

   // Function to update the cart count
   function updateCartCount(count) {
       const cartCountElement = document.getElementById('cart-count');
       cartCountElement.textContent = count;
   }

   // Initialize the cart count from localStorage if available
   const storedCartCount = localStorage.getItem('cartCount') || 0;
   updateCartCount(storedCartCount);

   // JavaScript for adding items to the cart
   const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

   addToCartButtons.forEach(button => {
       button.addEventListener("click", () => {
           const itemId = button.getAttribute("data-id");
           
           // Update the cart count
           const currentCartCount = parseInt(localStorage.getItem('cartCount')) || 0;
           const newCartCount = currentCartCount + 1;
           localStorage.setItem('cartCount', newCartCount);
           updateCartCount(newCartCount);

           console.log("Added item with ID:", itemId);
       });
   });



         function performSearch(query) {
             $.ajax({
                 type: "GET",
                 url: "/search", // Replace with the actual route for searching
                 data: { query: query },
                 success: function (data) {
                     displaySearchResults(data);
                 },
                 error: function (error) {
                     console.error("Error:", error);
                 }
             });
         }
     
      
         function displaySearchResults(results) {
             const resultsContainer = $(".search-results");
             resultsContainer.empty();
     
             if (results.length === 0) {
                 resultsContainer.append("<p>No items found.</p>");
             } else {
                 resultsContainer.append("<ul>");
                 results.forEach(function (item) {
                     resultsContainer.find("ul").append(
                         `<li class="search-result">${item.title}</li>`
                     );
                 });
                 resultsContainer.append("</ul>");
             }
     
             // Show the results container
             resultsContainer.show();
         }
     
         // Handle input changes for live search
         $("#search-input").on("input", function () {
             const query = $(this).val().trim();
             if (query.length >= 3) { // Minimum characters to trigger a search
                 performSearch(query);
             } else {
                 $(".search-results").empty().hide();
             }
         });
     
         // Handle item selection when a search result is clicked
         $(".search-results").on("click", ".search-result", function () {
             const selectedItemName = $(this).text();
             $("#search-input").val(selectedItemName);
             $(".search-results").empty().hide();
         });