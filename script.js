/*
=================================================================
  SCRIPT.JS (Main jQuery Script)
  For Elektrik Eel Festival Website (DIG103 Assessment 3)

  Sections:
  1. Document Ready Wrapper
  2. Hamburger Menu Toggle (Mandatory Requirement)
  3. Scroll-to-Top Button (Optional Feature)
  4. Animate on Scroll (Optional Feature)
  5. Footer Contact Form Dropdown (Interactive Component)
  6. Artist Search Functionality (User Input & Interaction)
  7. Custom Alert Box (for Form Submissions)
  8. Form Submission Handlers (User Input)
=================================================================
*/

// 1. Document Ready Wrapper
// Ensures all jQuery code runs only after the DOM is fully loaded.
$(document).ready(function () {

    // 2. Hamburger Menu Toggle (Mandatory Requirement)
    // Toggles the 'active' class on the hamburger icon and the 'mobile-menu-active'
    // class on the header navigation container.
    $('.hamburger-menu').on('click', function () {
        $(this).toggleClass('active');
        $('.header-right').toggleClass('mobile-menu-active');
    });

    // 3. Scroll-to-Top Button (Optional Feature)
    var $scrollTopBtn = $('#scrollTopBtn');

    // Show or hide the button based on scroll position
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 200) {
            // Show button if scrolled more than 200px
            $scrollTopBtn.addClass('show');
        } else {
            // Hide button if near the top
            $scrollTopBtn.removeClass('show');
        }
    });

    // Animate scrolling to the top when the button is clicked
    $scrollTopBtn.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 'smooth');
    });

    // 4. Animate on Scroll (Optional Feature)
    var $window = $(window);

    // Function to check if elements are in the viewport
    function checkAnimations() {
        var windowHeight = $window.height();
        var windowTopPosition = $window.scrollTop();
        var windowBottomPosition = (windowTopPosition + windowHeight);

        // Iterate over each element with the 'animate-init' class
        $('.animate-init').each(function () {
            var $element = $(this);
            var elementHeight = $element.outerHeight();
            var elementTopPosition = $element.offset().top;
            var elementBottomPosition = (elementTopPosition + elementHeight);

            // Check if element is in view
            if ((elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)) {
                // Remove the class to trigger the CSS transition (fade in)
                $element.removeClass('animate-init');
            }
        });
    }

    // Run the check on initial load and on scroll/resize
    checkAnimations();
    $window.on('scroll resize', checkAnimations);

    // 5. Footer Contact Form Dropdown (Interactive Component)
    var $dropdown = $('.footer-contact-dropdown');
    var $toggleBtn = $('#contactToggleBtn');
    var $contactForm = $('#contactForm');
    var animationSpeed = 500; // Animation speed in ms

    // Show form on mouse enter
    $dropdown.on('mouseenter', function () {
        if (!$contactForm.is(':visible')) {
            $contactForm.slideDown(animationSpeed);
        }
        $toggleBtn.addClass('hover-active'); // Rotate arrow
    });

    // Hide form on mouse leave, if not pinned open by a click
    $dropdown.on('mouseleave', function () {
        if (!$toggleBtn.hasClass('active')) {
            $contactForm.slideUp(animationSpeed);
            $toggleBtn.removeClass('hover-active'); // Rotate arrow back
        }
    });

    // Toggle form visibility on button click
    $toggleBtn.on('click', function () {
        $(this).toggleClass('active'); // 'active' class pins the form open
        if ($(this).hasClass('active')) {
            $contactForm.slideDown(animationSpeed);
            $(this).addClass('hover-active');
        } else {
            $contactForm.slideUp(animationSpeed);
            $(this).removeClass('hover-active');
        }
    });

    // Keep form open if user tabs into or clicks into a form field
    $contactForm.on('focusin', 'input, textarea', function () {
        if (!$toggleBtn.hasClass('active')) {
            $toggleBtn.addClass('active');
            $toggleBtn.addClass('hover-active');
        }
    });

    // 6. Artist Search Functionality (User Input & Interaction)
    // Checks if the search input exists on the current page (artists.html)
    if ($('#artistSearchInput').length > 0) {

        var $allArtists = $('.artist-card');
        var $noResultsMsg = $('#noResultsMessage');
        var $searchInput = $('#artistSearchInput');

        // Function to filter artists based on search input
        function filterArtists() {
            var searchTerm = $searchInput.val().toLowerCase().trim();
            var artistsFound = 0;

            // Loop over each artist card
            $allArtists.each(function () {
                var $card = $(this);
                // Get artist name from 'data-artist-name' attribute
                var artistName = $card.data('artist-name').toLowerCase();

                // Check if the artist name includes the search term
                if (artistName.includes(searchTerm)) {
                    $card.removeClass('no-match').addClass('highlight');
                    artistsFound++;
                } else {
                    $card.addClass('no-match').removeClass('highlight');
                }
            });

            // If search bar is empty, show all artists
            if (searchTerm === "") {
                $allArtists.removeClass('no-match highlight');
                artistsFound = $allArtists.length;
            }

            // Show or hide the "No results" message
            if (artistsFound > 0) {
                $noResultsMsg.slideUp(200);
            } else {
                $noResultsMsg.slideDown(200);
            }

            return artistsFound;
        }

        // Run the filter function on keyup or input events
        $searchInput.on('keyup input', filterArtists);

        // Handle form submission (e.g., pressing Enter)
        $('.artist-search-form').on('submit', function (e) {
            e.preventDefault(); // Prevent page reload
            var artistsFound = filterArtists();

            // If artists are found and search isn't empty, scroll to the first match
            if (artistsFound > 0 && $searchInput.val().trim() !== "") {
                var $firstMatch = $('.artist-card.highlight').first();

                if ($firstMatch.length > 0) {
                    var headerHeight = $('.main-header').outerHeight() || 100;
                    var scrollToPosition = $firstMatch.offset().top - headerHeight - 20;

                    // Animate scroll to the first matched artist
                    $('html, body').animate({
                        scrollTop: scrollToPosition
                    }, 500);
                }
            }
        });

        // Clear search results if user clicks outside the search form or results
        $(document).on('click', function (e) {
            if ($searchInput.val().trim() === "") {
                return; // Do nothing if search is already empty
            }
            // Don't clear if clicking inside the search form
            if ($(e.target).closest('.artist-search-form').length > 0) {
                return;
            }
            // Don't clear if clicking on a highlighted artist card
            if ($(e.target).closest('.artist-card.highlight').length > 0) {
                return;
            }

            // Clear search input and reset the filter
            $searchInput.val('');
            filterArtists();
        });
    }

    // 7. Custom Alert Box (for Form Submissions)
    // Dynamically create the alert box HTML and append it to the body
    $('body').append(
        '<div id="custom-alert-overlay"></div>' +
        '<div id="custom-alert-box">' +
        '  <p id="custom-alert-message"></p>' +
        '  <button id="custom-alert-close" class="btn btn-primary">OK</button>' +
        '</div>'
    );

    // Dynamically create and inject the CSS for the alert box
    var alertStyles = `
        #custom-alert-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 2000;
        }
        #custom-alert-box {
            display: none;
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-light, #0a0a0a);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 30px 40px;
            z-index: 2001;
            text-align: center;
            box-shadow: 0 0 30px rgba(255, 0, 60, 0.5); 
        }
        #custom-alert-message {
            font-size: 1.2rem;
            color: var(--text-primary, #fff);
            margin-bottom: 25px;
            line-height: 1.6;
        }
        #custom-alert-close {
            background-image: var(--gradient-neon);
            padding: 10px 30px;
        }
    `;
    $('head').append('<style>' + alertStyles + '</style>');

    // Cache the alert elements
    var $alertOverlay = $('#custom-alert-overlay');
    var $alertBox = $('#custom-alert-box');

    // Function to show the custom alert
    function showCustomAlert(message) {
        $('#custom-alert-message').text(message);
        $alertOverlay.fadeIn(300);
        $alertBox.fadeIn(300);
    }

    // Function to close the custom alert
    function closeCustomAlert() {
        $alertOverlay.fadeOut(300);
        $alertBox.fadeOut(300);
    }

    // Close alert events
    $('#custom-alert-close').on('click', closeCustomAlert);
    $alertOverlay.on('click', closeCustomAlert);

    // 8. Form Submission Handlers (User Input)
    // Handles the signup form submission
    $('.signup-form').on('submit', function (e) {
        e.preventDefault(); // Prevent actual form submission
        showCustomAlert('Your request has been submitted!');
        $(this).trigger('reset'); // Clear the form fields
    });

    // Handles the footer contact form submission
    $('#contactForm').on('submit', function (e) {
        e.preventDefault(); // Prevent actual form submission
        showCustomAlert('Your request has been submitted!');
        $(this).trigger('reset'); // Clear the form fields
    });

});