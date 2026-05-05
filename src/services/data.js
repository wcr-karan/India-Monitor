// Data fetching services for India Monitor

const RSS_PROXY = '/api/rss-proxy?url=';

// ============================================
// NEWS — Fetch from multiple Indian RSS feeds
// ============================================
export async function fetchIndiaNews() {
  const feeds = [
    { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', source: 'NDTV' },
    { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', source: 'Times of India' },
    { url: 'https://www.thehindu.com/news/national/feeder/default.rss', source: 'The Hindu' },
  ];

  try {
    const results = await Promise.allSettled(
      feeds.map(feed => fetchRSS(feed.url, feed.source))
    );

    const allItems = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value)
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 25);

    return allItems;
  } catch {
    return [];
  }
}

// ============================================
// CRICKET — Fetch from Cricket RSS feeds
// ============================================
export async function fetchCricketNews() {
  const feeds = [
    { url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml', source: 'Cricinfo' },
    { url: 'https://www.news18.com/rss/cricket.xml', source: 'News18' },
    { url: 'https://sports.ndtv.com/rss/cricket', source: 'NDTV Sports' },
  ];

  try {
    const results = await Promise.allSettled(
      feeds.map(feed => fetchRSS(feed.url, feed.source))
    );

    const allItems = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value)
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 15);

    return allItems;
  } catch {
    return [];
  }
}

// ============================================
// CRICKET LIVE SCORES
// ============================================
export async function fetchLiveScores() {
  try {
    const res = await fetchRSS('http://static.cricinfo.com/rss/livescores.xml', 'Live Score');
    
    // Prioritize India and IPL matches
    const priorityKeywords = [
      'India', 'Chennai', 'Mumbai', 'Royal Challengers', 'Bangalore', 'Bengaluru', 
      'Delhi', 'Kolkata', 'Punjab', 'Rajasthan', 'Sunrisers', 'Hyderabad', 
      'Gujarat', 'Lucknow', 'Titans', 'Super Giants', 'Capitals', 'Super Kings'
    ];
    
    res.sort((a, b) => {
      const aPriority = priorityKeywords.some(kw => a.title.includes(kw));
      const bPriority = priorityKeywords.some(kw => b.title.includes(kw));
      if (aPriority && !bPriority) return -1;
      if (!aPriority && bPriority) return 1;
      return 0;
    });
    
    return res;
  } catch {
    return [];
  }
}

async function fetchRSS(url, sourceName) {
  try {
    const res = await fetch(RSS_PROXY + encodeURIComponent(url), {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseRSS(text, sourceName);
  } catch {
    return [];
  }
}

function parseRSS(xml, sourceName) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const items = doc.querySelectorAll('item');
    const results = [];

    items.forEach(item => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const date = pubDate ? new Date(pubDate) : new Date();

      results.push({
        title,
        link,
        source: sourceName,
        pubDate: date.toISOString(),
        time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }),
      });
    });

    return results;
  } catch {
    return [];
  }
}

// ============================================
// WEATHER — Fetch from Open-Meteo (no API key needed)
// ============================================
export async function fetchWeather(cities) {
  try {
    const results = await Promise.allSettled(
      cities.map(city => fetchCityWeather(city))
    );

    return results.map((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      return getFallbackWeather(cities[i].name);
    });
  } catch {
    return cities.map(c => getFallbackWeather(c.name));
  }
}

async function fetchCityWeather(city) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia/Kolkata`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return getFallbackWeather(city.name);
    const data = await res.json();
    const current = data.current;
    return {
      name: city.name,
      temp: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      desc: getWeatherDescription(current.weather_code),
      icon: getWeatherIcon(current.weather_code),
    };
  } catch {
    return getFallbackWeather(city.name);
  }
}

function getWeatherDescription(code) {
  const map = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
    95: 'Thunderstorm', 96: 'Thunderstorm + hail', 99: 'Heavy thunderstorm',
  };
  return map[code] || 'Unknown';
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '❄️';
  if (code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

function getFallbackWeather(name) {
  const fallbacks = {
    'Delhi': { temp: 42, humidity: 28, desc: 'Clear sky', icon: '☀️' },
    'Mumbai': { temp: 33, humidity: 72, desc: 'Partly cloudy', icon: '⛅' },
    'Bangalore': { temp: 28, humidity: 55, desc: 'Partly cloudy', icon: '⛅' },
    'Chennai': { temp: 36, humidity: 65, desc: 'Mainly clear', icon: '☀️' },
    'Kolkata': { temp: 35, humidity: 70, desc: 'Overcast', icon: '☁️' },
    'Hyderabad': { temp: 38, humidity: 40, desc: 'Clear sky', icon: '☀️' },
    'Jaipur': { temp: 41, humidity: 22, desc: 'Clear sky', icon: '☀️' },
    'Lucknow': { temp: 40, humidity: 35, desc: 'Mainly clear', icon: '☀️' },
  };
  const fb = fallbacks[name] || { temp: 35, humidity: 50, desc: 'Clear', icon: '☀️' };
  return { name, ...fb };
}
