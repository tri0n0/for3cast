import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [background, setBackground] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [textColor, setTextColor] = useState('#ffffff');
  const [visitedCities, setVisitedCities] = useState([]);
  const [loadingCityImages, setLoadingCityImages] = useState(true);

  const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c';

  const cityImages = {
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', 
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'
  };

  // Preload city images
  useEffect(() => {
    const preloadImages = async () => {
      setLoadingCityImages(true);
      const imagePromises = Object.values(cityImages).map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
      } catch (error) {
        console.error('Error preloading images:', error);
      } finally {
        setLoadingCityImages(false);
      }
    };

    preloadImages();
  }, []);

  const getBackgroundImage = (weatherCondition) => {
    const conditions = {
      Clear: {
        url: 'url("https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920")',
        color: '#ffffff'
      },
      Clouds: {
        url: 'url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920")',
        color: '#000000'
      },
      Rain: {
        url: 'url("https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920")',
        color: '#ffffff'
      },
      Snow: {
        url: 'url("https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920")',
        color: '#000000'
      },
      Thunderstorm: {
        url: 'url("https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1920")',
        color: '#ffffff'
      },
      Drizzle: {
        url: 'url("https://images.unsplash.com/photo-1556485689-33e55ab56127?auto=format&fit=crop&w=1920")',
        color: '#000000'
      },
      Mist: {
        url: 'url("https://images.unsplash.com/photo-1543968996-ee822b8176ba?auto=format&fit=crop&w=1920")',
        color: '#000000'
      }
    };
    const condition = conditions[weatherCondition] || conditions.Clear;
    setTextColor(condition.color);
    return condition.url;
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    setIsLoading(true);
    setFadeIn(false);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
        setBackground(getBackgroundImage(data.weather[0].main));
        setError('');
        setTimeout(() => setFadeIn(true), 300);
        
        // Add to visited cities if not already present
        if (!visitedCities.some(c => c.name === city)) {
          // Preload city image before adding to visited cities
          const img = new Image();
          img.src = `https://source.unsplash.com/800x600/?${city},city`;
          img.onload = () => {
            setVisitedCities(prev => [...prev, {
              name: city,
              image: img.src,
              lastVisited: new Date().toLocaleString()
            }]);
          };
        }
      } else {
        setError('City not found');
        setWeatherData(null);
        setBackground('');
        setTextColor('#000000');
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      setWeatherData(null);
      setBackground('');
      setTextColor('#000000');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  const cardHoverStyle = {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
    }
  };

  const buttonHoverStyle = {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#f0f0f0'
    }
  };

  const renderHome = () => (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card" style={{ 
        ...cardHoverStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '15px',
        padding: '30px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        color: '#000000',
        cursor: 'default'
      }}>
        <h1 className="title-animate" style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          animation: 'weatherFloat 3s ease-in-out infinite',
          background: 'linear-gradient(45deg, #2196F3, #4CAF50)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5em',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          for3cast
          <span style={{ 
            display: 'inline-block',
            marginLeft: '10px',
            animation: 'spin 2s linear infinite'
          }}>
            ☀
          </span>
        </h1>
        
        <div className="search-card" style={{
          ...cardHoverStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
          }
        }}>
          <div className="search-box" style={{
            display: 'flex',
            gap: '10px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '25px',
                border: '2px solid rgba(0, 0, 0, 0.1)',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: '#000000',
                outline: 'none',
                cursor: 'text',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 0 0 2px rgba(33,150,243,0.2), 0 8px 25px rgba(33,150,243,0.4)',
                  borderColor: '#2196F3',
                  backgroundColor: 'rgba(33,150,243,0.05)'
                },
                '&:focus': {
                  transform: 'translateY(-5px) scale(1.03)',
                  boxShadow: '0 0 0 3px rgba(33,150,243,0.3), 0 12px 30px rgba(33,150,243,0.6)',
                  borderColor: '#2196F3',
                  backgroundColor: 'rgba(33,150,243,0.1)'
                }
              }}
            />
            <button 
              onClick={fetchWeather}
              disabled={isLoading}
              style={{
                padding: '12px 25px',
                borderRadius: '25px',
                border: '2px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: '#000000',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.1) rotate(2deg)',
                  backgroundColor: '#2196F3',
                  color: '#ffffff',
                  borderColor: '#2196F3',
                  boxShadow: '0 0 0 2px rgba(33,150,243,0.2), 0 8px 25px rgba(33,150,243,0.4)'
                },
                '&:active': {
                  transform: 'translateY(2px) scale(0.95)',
                  boxShadow: '0 0 0 1px rgba(33,150,243,0.2), 0 4px 15px rgba(33,150,243,0.2)'
                }
              }}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {error && (
            <div className="error-card" style={{
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              padding: '10px',
              borderRadius: '8px',
              marginTop: '15px',
              textAlign: 'center',
              color: '#000000',
              border: '2px solid #ff0000'
            }}>
              <p>{error}</p>
            </div>
          )}
        </div>

        {weatherData && (
          <div className="weather-card" style={{
            ...cardHoverStyle,
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '30px',
            color: '#000000',
            border: '2px solid #000000',
            cursor: 'default'
          }}>
            <div className="location-card" style={{
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div className="temperature-card" style={{
                ...cardHoverStyle,
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px solid #000000'
              }}>
                <h3 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{Math.round(weatherData.main.temp)}°C</h3>
                <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
              </div>

              <div className="condition-card" style={{
                ...cardHoverStyle,
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px solid #000000'
              }}>
                <img 
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  style={{ width: '80px', height: '80px' }}
                />
                <p>{weatherData.weather[0].description}</p>
              </div>

              <div className="details-card" style={{
                ...cardHoverStyle,
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '10px',
                border: '2px solid #000000'
              }}>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <p><i className="fas fa-tint"></i> Humidity: {weatherData.main.humidity}%</p>
                  <p><i className="fas fa-wind"></i> Wind Speed: {weatherData.wind.speed} m/s</p>
                  <p><i className="fas fa-compress-arrows-alt"></i> Pressure: {weatherData.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCities = () => (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card" style={{
        ...cardHoverStyle,
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        padding: '30px',
        backdropFilter: 'blur(10px)',
        border: '2px solid #000000',
        color: '#000000',
        cursor: 'default'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Popular Cities</h2>
        {loadingCityImages ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading city images...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai'].map(cityName => (
              <div 
                key={cityName}
                onClick={() => {
                  setCity(cityName);
                  setActiveTab('home');
                  fetchWeather();
                }}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid #000000',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '200px',
                  backgroundImage: `url(${cityImages[cityName]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'scale(1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '15px',
                  background: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(100%)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(0)'
                  }
                }}>
                  <h3>{cityName}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {visitedCities.length > 0 && (
          <>
            <h2 style={{ textAlign: 'center', margin: '40px 0 30px' }}>Recently Visited Cities</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {visitedCities.map(city => (
                <div 
                  key={city.name}
                  onClick={() => {
                    setCity(city.name);
                    setActiveTab('home');
                    fetchWeather();
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid #000000',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '200px',
                    backgroundImage: `url(${city.image})` ,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'scale(1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '15px',
                    background: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(100%)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(0)'
                    }
                  }}>
                    <h3>{city.name}</h3>
                    <p style={{ fontSize: '0.8rem' }}>Last visited: {city.lastVisited}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card" style={{
        ...cardHoverStyle,
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        padding: '30px',
        backdropFilter: 'blur(10px)',
        border: '2px solid #000000',
        color: '#000000',
        cursor: 'default',
        transition: 'all 0.5s ease',
        '&:hover': {
          transform: 'translateY(-15px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
        }
      }}>
        <h2 style={{ 
          marginBottom: '20px',
          transition: 'all 0.4s ease',
          transform: 'scale(1)',
          '&:hover': {
            transform: 'scale(1.1)',
            color: '#2196F3',
            textShadow: '2px 2px 4px rgba(33,150,243,0.3)'
          }
        }}>About Weather Forecast</h2>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #000000',
          transition: 'all 0.4s ease',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
            borderColor: '#2196F3'
          }
        }}>
          <p style={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              color: '#2196F3'
            }
          }}>This weather application provides real-time weather information for cities worldwide. 
             Using the OpenWeatherMap API, it displays current temperature, weather conditions, 
             humidity, wind speed, and atmospheric pressure.</p>
        </div>
        
        <h3 style={{ 
          marginBottom: '15px',
          transition: 'all 0.4s ease',
          transform: 'scale(1)',
          '&:hover': {
            transform: 'scale(1.08)',
            color: '#4CAF50',
            textShadow: '2px 2px 4px rgba(76,175,80,0.3)'
          }
        }}>How to Use</h3>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #000000',
          transition: 'all 0.4s ease',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
            borderColor: '#4CAF50'
          }
        }}>
          <ul style={{ 
            listStylePosition: 'inside',
            '& li': {
              transition: 'all 0.3s ease',
              padding: '5px',
              '&:hover': {
                transform: 'translateX(15px)',
                color: '#4CAF50',
                backgroundColor: 'rgba(76,175,80,0.1)',
                borderRadius: '5px'
              }
            }
          }}>
            <li>Enter a city name in the search box</li>
            <li>Press Enter or click Search</li>
            <li>View detailed weather information</li>
          </ul>
        </div>

        <h3 style={{ 
          marginBottom: '15px',
          transition: 'all 0.4s ease',
          transform: 'scale(1)',
          '&:hover': {
            transform: 'scale(1.08)',
            color: '#2196F3',
            textShadow: '2px 2px 4px rgba(33,150,243,0.3)'
          }
        }}>Meet the Developers</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '20px',
            border: '2px solid #000000',
            textAlign: 'center',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-15px) scale(1.08)',
              boxShadow: '0 20px 40px rgba(33,150,243,0.4)',
              borderColor: '#2196F3',
              background: 'linear-gradient(135deg, #6edcc4, #1aab8b)',
              color: '#ffffff'
            }
          }}>
            <h4 style={{ 
              marginBottom: '10px',
              transition: 'all 0.4s ease',
              transform: 'scale(1)',
              '&:hover': {
                transform: 'scale(1.2) rotate(5deg)',
                textShadow: '2px 2px 4px rgba(33,150,243,0.4)'
              }
            }}>Abhishek Dutta</h4>
            <p style={{ 
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}>Lead Developer</p>
            <p style={{ 
              fontSize: '0.8rem', 
              fontStyle: 'italic', 
              marginTop: '5px',
              transition: 'all 0.4s ease',
              opacity: '0.8',
              '&:hover': {
                transform: 'scale(1.1) translateY(-5px)',
                opacity: '1'
              }
            }}>
              "Turning weather data into beautiful experiences"
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '20px',
            border: '2px solid #000000',
            textAlign: 'center',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-15px) scale(1.08)',
              boxShadow: '0 20px 40px rgba(76,175,80,0.4)',
              borderColor: '#4CAF50',
              background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
              color: '#ffffff'
            }
          }}>
            <h4 style={{ 
              marginBottom: '10px',
              transition: 'all 0.4s ease',
              transform: 'scale(1)',
              '&:hover': {
                transform: 'scale(1.2) rotate(-5deg)',
                textShadow: '2px 2px 4px rgba(76,175,80,0.4)'
              }
            }}>Chinmoy Das</h4>
            <p style={{ 
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}>UI/UX Designer</p>
            <p style={{ 
              fontSize: '0.8rem', 
              fontStyle: 'italic', 
              marginTop: '5px',
              transition: 'all 0.4s ease',
              opacity: '0.8',
              '&:hover': {
                transform: 'scale(1.1) translateY(-5px)',
                opacity: '1'
              }
            }}>
              "Creating seamless user experiences"
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App" style={{ 
      backgroundImage: background || 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      width: '100%',
      transition: 'all 0.8s ease-in-out'
    }}>
      <nav className="navbar" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        padding: '20px'
      }}>
        {['home', 'cities', 'about'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
              padding: '10px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              color: '#000000',
              backdropFilter: 'blur(5px)',
              border: '2px solid #000000',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: '#ffffff'
              }
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </nav>
      
      {activeTab === 'home' && renderHome()}
      {activeTab === 'cities' && renderCities()}
      {activeTab === 'about' && renderAbout()}
    </div>
  );
}

export default App;