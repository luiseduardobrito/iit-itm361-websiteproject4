(() => {
  "use strict";

  function initializeSlider() {
    const slider = document.querySelector("[data-slider]");

    if (!slider) {
      return;
    }

    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    const previousButton = slider.querySelector("[data-slider-previous]");
    const nextButton = slider.querySelector("[data-slider-next]");
    const currentSlide = slider.querySelector("[data-current-slide]");

    if (
      slides.length === 0 ||
      !previousButton ||
      !nextButton ||
      !currentSlide
    ) {
      return;
    }

    let currentIndex = 0;

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isCurrent = slideIndex === currentIndex;

        slide.hidden = !isCurrent;
        slide.setAttribute("aria-hidden", String(!isCurrent));
      });

      currentSlide.textContent = String(currentIndex + 1);
    }

    previousButton.addEventListener("click", () => {
      showSlide(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
      showSlide(currentIndex + 1);
    });

    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(currentIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(currentIndex + 1);
      }
    });

    slider.classList.add("is-enhanced");
    showSlide(currentIndex);
  }

  function createInfoWindowContent(location) {
    const content = document.createElement("div");
    const heading = document.createElement("h3");
    const description = document.createElement("p");

    heading.textContent = location.name;
    description.textContent = location.description;
    content.append(heading, description);

    return content;
  }

  function renderCampusMap(mapElement, status) {
    const maps = window.google.maps;
    const locations = [
      {
        name: "Wishnick Hall",
        description: "Science classrooms, laboratories, and academic departments.",
        position: { lat: 41.8361, lng: -87.6272 }
      },
      {
        name: "McCormick Tribune Campus Center",
        description: "A student gathering place designed by architect Rem Koolhaas.",
        position: { lat: 41.8351, lng: -87.6266 }
      },
      {
        name: "S. R. Crown Hall",
        description: "Mies van der Rohe's landmark home for the College of Architecture.",
        position: { lat: 41.8338, lng: -87.6273 }
      }
    ];
    const campusMap = new maps.Map(mapElement, {
      center: { lat: 41.835, lng: -87.627 },
      mapTypeControl: true,
      streetViewControl: false,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#b9d8dc" }]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f6f4ef" }]
        }
      ],
      zoom: 16
    });
    const bounds = new maps.LatLngBounds();
    const infoWindow = new maps.InfoWindow();

    locations.forEach((location, index) => {
      const marker = new maps.Marker({
        label: String(index + 1),
        map: campusMap,
        position: location.position,
        title: location.name
      });

      marker.addListener("click", () => {
        infoWindow.setContent(createInfoWindowContent(location));
        infoWindow.open({
          anchor: marker,
          map: campusMap
        });
      });

      bounds.extend(location.position);
    });

    campusMap.fitBounds(bounds, 48);
    mapElement.classList.add("is-loaded");
    status.classList.add("is-success");
    status.textContent = "Interactive campus map loaded. Select a numbered marker for details.";
  }

  function initializeCampusMap() {
    const mapElement = document.querySelector("#campus-map");

    if (!mapElement) {
      return;
    }

    const status = document.querySelector("#map-status");
    const apiKey = mapElement.dataset.apiKey;

    if (!status) {
      return;
    }

    window.initializeIitCampusMap = () => {
      renderCampusMap(mapElement, status);
    };

    window.gm_authFailure = () => {
      mapElement.classList.add("map-error");
      status.textContent = "Google Maps could not authenticate. Check the API key and its website restrictions.";
    };

    const script = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=initializeIitCampusMap&loading=async`;
    script.async = true;
    script.addEventListener("error", () => {
      mapElement.classList.add("map-error");
      status.textContent = "Google Maps could not load. Check the network connection and try again.";
    });
    document.head.append(script);
  }

  function initializePageTools() {
    initializeSlider();
    initializeCampusMap();
  }

  document.addEventListener("DOMContentLoaded", initializePageTools);
})();
