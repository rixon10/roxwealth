// App.js
import React, { useEffect, useState } from 'react';
import videoBg from './assets/videoBg.mp4';
import './App.css';
import facebookLogo from './facebook.svg'
import instLogo from './instagram.svg'
import twitLogo from './twitter.svg'
import webLogo from './gmail.svg'
import Gmap from './Gmap.svg'

const App = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [foodImages, setFoodImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        setRestaurantData(data.restaurant);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  useEffect(() => {
    const fetchFoodImages = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=food&count=5&client_id=PQQ-kFgTeArluGU21Ya6L3F-vfTGo39iXWFcQD76_3A`
        );

        if (response.ok) {
          const data = await response.json();
          setFoodImages(data.map(image => image.urls.thumb));
        } else {
          console.error('Failed to fetch food images');
        }
      } catch (error) {
        console.error('Error fetching food images:', error);
      }
    };

    fetchFoodImages();
  }, []); // Fetch food images only once when the component mounts

  const opengooglemap = () => {
    window.open(`https://www.google.com/maps?q=${restaurantData.location.latitude},${restaurantData.location.longitude}`, '_blank');
  };

  const openInstagramPage = () => {
    window.open('https://www.instagram.com/epicureansymphony', '_blank');
  };

  const openTwitterPage = () => {
    window.open('https://www.twitter.com/epicureansymph', '_blank');
  };

  const openWebsite = () => {
    window.open('https://www.epicureansymphony.com', '_blank');
  };

  const openFacebookPage = () => {
    window.open('https://www.facebook.com/epicureansymphony', '_blank');
  };

  const getTrendingDishes = () => {
    if (!restaurantData || !restaurantData.menu) {
      return [];
    }

    // Flatten the array of items from all categories
    const allItems = restaurantData.menu.categories.flatMap(category => category.items);

    // Sort the items based on ratings in descending order
    const sortedDishes = allItems.sort((a, b) => b.rating - a.rating);

    // Take the top 5 items as trending dishes
    return sortedDishes.slice(0, 5);
  };

  return (
    <div className="container">
      <div className="video-container">
        <video autoPlay muted loop className="video-bg">
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      <div className="video-overlay"></div>
    </div>

      {restaurantData ? (
        <>
          <header className="restaurant-header">
            <h1>{restaurantData.name}</h1>
            <p> A sophisticated dining experience</p>
          </header>
  
          <div className="restaurant-info">
  
            {/* Trending Dishes */}
            <section className="trending-dishes">
              <h2>Trending Dishes</h2>
              <div className="menu-categories">
                {getTrendingDishes().map((trendingDish, index) => (
                  <div key={index} className="menu-item">
                    <img src={foodImages[index]} alt={`Trending Dish ${index + 1}`} />
                    <div className="dish-details">
                      <span className="dish-name">{trendingDish.name}</span>
                      <span className="dish-description">{trendingDish.description}</span>
                      <span className="dish-price">${trendingDish.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Events Section */}
            <section className="events">
              <h2>Events</h2>
              <ul>
                {restaurantData.events.upcoming_events.map((event, index) => (
                  <li key={index}>
                    {event.name} - Date: {event.date}, Description: {event.description}
                  </li>
                ))}
              </ul>
            </section>
  
            {/* Chef Section */}
            <section className="chef">
              <h2>Chef</h2>
              <p>Name: {restaurantData.chef.name}</p>
              <p>Bio: {restaurantData.chef.bio}</p>
              <p>Signature Dish: {restaurantData.chef.signature_dish}</p>
            </section>
  
            {/* Awards Section */}
            <section className="awards">
              <h2>Awards</h2>
              <ul>
                {restaurantData.awards.map((award, index) => (
                  <li key={index}>
                    {award.year} - {award.organization}: {award.award}
                  </li>
                ))}
              </ul>
            </section>
  
            {/* Ambiance Section */}
            <section className="ambiance">
              <h2>Ambiance</h2>
              <p>{restaurantData.ambiance.description}</p>
            </section>
  
            {/* Sustainability Section */}
            <section className="sustainability">
              <h2>Sustainability</h2>
              <ul>
                {restaurantData.sustainability.initiatives.map((initiative, index) => (
                  <li key={index}>
                    {initiative.name}: {initiative.description}
                  </li>
                ))}
              </ul>
            </section>
  
              <div className="social-media-icons">
                <div className="icon" onClick={openWebsite} style={{cursor: 'pointer'}}>
                  <img src={webLogo} alt="Website" />
                </div>
                <div className="icon" onClick={openFacebookPage} style={{ cursor: 'pointer' }}>
                  <img src={facebookLogo} alt="Facebook" />
                </div>
                <div className="icon" onClick={opengooglemap} style={{ cursor: 'pointer' }}>
                  <img src={Gmap} alt="Google Maps" />
                </div>
                <div className="icon" onClick={openInstagramPage} style={{cursor: 'pointer'}}>
                  <img src={instLogo} alt="Instagram" />
                </div>
                <div className="icon" onClick={openTwitterPage} style={{cursor: 'pointer'}}>
                  <img src={twitLogo} alt="Twitter" />
                </div>
             </div>

            {/* Reviews Section */}
            <section className="reviews">
              <h2>Reviews</h2>
              <div className="customer-reviews">
                {restaurantData.reviews.map((review, index) => (
                  <div key={index} className="customer-review">
                    <span>{review.customer_name}</span>
                    <span>Rating: {review.rating}</span>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default App;
