function showPopup(event, popupId) {
    event.preventDefault();
    // Hide any currently open popups
    var popups = document.querySelectorAll('.popup');
    popups.forEach(function(popup) {
        popup.style.display = "none";
    });
    // Display the new popup
    var popup = document.getElementById(popupId);
    popup.style.display = "block";

    // Adjust page height to fit popup content
    document.body.style.height = "auto";
    var popupHeight = popup.offsetHeight;
    var bodyHeight = document.body.scrollHeight;
    if (popupHeight > bodyHeight) {
        document.body.style.height = popupHeight + "px";
    }
}

function hidePopup(popupId) {
    var popup = document.getElementById(popupId);
    popup.style.display = "none";
}

/*search bar study section*/

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');
    const chapterLinks = document.querySelectorAll('.nav .nav-left button, .menu a, main a, main h4');
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.classList.add('search-results');
    searchInput.parentNode.insertBefore(searchResultsContainer, searchInput.nextSibling);

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchResultsContainer.innerHTML = '';

        if (searchTerm === '') {
            searchResultsContainer.style.display = 'none';
            return;
        }

        let resultsFound = false;
        const addedLinks = new Set();

        chapterLinks.forEach(function (link) {
            const chapterName = link.textContent.toLowerCase();
            if (chapterName.includes(searchTerm)) {
                const linkText = link.textContent.trim();
                if (addedLinks.has(linkText)) return;
                addedLinks.add(linkText);
                
                resultsFound = true;
                const resultLink = document.createElement('a');
                resultLink.textContent = link.textContent;

                // Handle both buttons and links
                if (link.closest('button')) {
                    resultLink.href = link.closest('button').getAttribute('onclick').match(/window.location.href='([^']+)'/)[1];
                } else if (link.closest('a')) {
                    resultLink.href = link.closest('a').href;
                } else if (link.closest('h4')) {
                    const popupId = link.closest('h4').getAttribute('onclick').match(/'([^']+)'/)[1];
                    resultLink.href = `#${popupId}`;
                }

                resultLink.classList.add('search-result-item');
                resultLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    if (link.closest('a')) {
                        link.closest('a').click();
                    } else if (link.closest('h4')) {
                        const popupId = link.closest('h4').getAttribute('onclick').match(/'([^']+)'/)[1];
                        showPopup(event, popupId);
                    }
                });
                searchResultsContainer.appendChild(resultLink);
            }
        });

        if (resultsFound) {
            searchResultsContainer.style.display = 'block';
        } else {
            searchResultsContainer.style.display = 'none';
        }

        const searchInputRect = searchInput.getBoundingClientRect();
        searchResultsContainer.style.position = 'absolute';
        searchResultsContainer.style.top = searchInputRect.bottom + window.scrollY + 'px';
        searchResultsContainer.style.left = searchInputRect.left + window.scrollX + 'px';
        searchResultsContainer.style.width = searchInputRect.width + 'px';
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch();
        }
    });

    document.addEventListener('click', function (event) {
        if (!searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', performSearch);
});

function showPopup(event, popupId) {
    event.preventDefault();
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'block';
    }
}

function hidePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    }
}
function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        { 
            pageLanguage: 'en', // Default language is English
            includedLanguages: 'en,hi,te,ta,or,bho,pa,mr,kn,gu,ml,as,bn,ur,sd,ne,ks,doi,kok,mni,sa,my,lo,zh-CN', // Included Indian languages
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE, // Set layout to simple (no toolbar)
        },
        'google_translate_element'
    );
}