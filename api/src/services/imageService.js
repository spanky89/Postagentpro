/**
 * Fetch relevant stock photos from Pexels
 */
export async function getStockImage(businessType, searchQuery = null) {
  try {
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    
    if (!PEXELS_API_KEY) {
      console.warn('Pexels API key not configured, skipping image');
      return null;
    }

    // Build search query based on business type
    const query = searchQuery || getSearchQueryForBusinessType(businessType);
    
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error('Pexels API request failed');
    }

    const data = await response.json();
    
    if (!data.photos || data.photos.length === 0) {
      return null;
    }

    // Pick a random photo from results
    const randomPhoto = data.photos[Math.floor(Math.random() * Math.min(data.photos.length, 10))];
    
    return {
      url: randomPhoto.src.large,
      urlMedium: randomPhoto.src.medium,
      urlSmall: randomPhoto.src.small,
      photographer: randomPhoto.photographer,
      photographerUrl: randomPhoto.photographer_url,
      pexelsId: randomPhoto.id
    };
  } catch (error) {
    console.error('Image fetch error:', error);
    return null; // Don't fail post generation if images fail
  }
}

/**
 * Get relevant search query based on business type
 */
function getSearchQueryForBusinessType(businessType) {
  const queries = {
    'Plumber': ['plumbing tools', 'home plumbing', 'bathroom fixtures', 'water pipes'],
    'Electrician': ['electrical work', 'light fixtures', 'home electrical', 'circuit breaker'],
    'Roofer': ['roof construction', 'roofing work', 'home roof', 'shingles'],
    'HVAC': ['hvac system', 'air conditioning', 'heating system', 'thermostat'],
    'General Contractor': ['home renovation', 'construction site', 'home improvement', 'building construction'],
    'Landscaper': ['landscaping work', 'garden design', 'lawn care', 'outdoor landscaping'],
    'Painter': ['house painting', 'paint brushes', 'interior painting', 'home painting'],
    'Carpenter': ['woodworking', 'carpentry tools', 'wood construction', 'home carpentry'],
    'Concrete': ['concrete work', 'cement pouring', 'driveway construction', 'foundation work'],
    'Fencing': ['fence installation', 'backyard fence', 'wooden fence', 'fence construction'],
    'Handyman': ['home repair', 'handyman tools', 'home maintenance', 'house fixing'],
    'Other': ['home improvement', 'construction work', 'home repair', 'professional service']
  };

  const typeQueries = queries[businessType] || queries['Other'];
  return typeQueries[Math.floor(Math.random() * typeQueries.length)];
}

/**
 * Get multiple image options for user to choose from (Pro/Premium tier)
 */
export async function getImageOptions(businessType, count = 5) {
  try {
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    
    if (!PEXELS_API_KEY) {
      return [];
    }

    const query = getSearchQueryForBusinessType(businessType);
    
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count * 2}&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error('Pexels API request failed');
    }

    const data = await response.json();
    
    if (!data.photos || data.photos.length === 0) {
      return [];
    }

    // Return multiple options
    return data.photos.slice(0, count).map(photo => ({
      url: photo.src.large,
      urlMedium: photo.src.medium,
      urlSmall: photo.src.small,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      pexelsId: photo.id
    }));
  } catch (error) {
    console.error('Image options fetch error:', error);
    return [];
  }
}
