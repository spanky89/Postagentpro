/**
 * Google My Business Publisher
 * Posts content to Google Business Profile
 */

/**
 * Publish a post to Google My Business
 */
export async function publishToGoogle(post, accessToken) {
  try {
    // Get the account and location
    const accountsResponse = await fetch(
      'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!accountsResponse.ok) {
      throw new Error('Failed to fetch Google accounts');
    }

    const accountsData = await accountsResponse.json();
    const accountName = accountsData.accounts?.[0]?.name;

    if (!accountName) {
      throw new Error('No Google Business account found');
    }

    // Get locations for this account
    const locationsResponse = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!locationsResponse.ok) {
      throw new Error('Failed to fetch locations');
    }

    const locationsData = await locationsResponse.json();
    const locationName = locationsData.locations?.[0]?.name;

    if (!locationName) {
      throw new Error('No Google Business location found');
    }

    // Prepare the post payload
    const postPayload = {
      languageCode: 'en-US',
      summary: post.content,
      topicType: 'STANDARD'
    };

    // Add media if image URL provided
    if (post.mediaUrl) {
      postPayload.media = [{
        mediaFormat: 'PHOTO',
        sourceUrl: post.mediaUrl
      }];
    }

    // Add call-to-action (optional - if business has website)
    if (post.user?.business?.website) {
      postPayload.callToAction = {
        actionType: 'LEARN_MORE',
        url: post.user.business.website
      };
    }

    // Create the post
    const postResponse = await fetch(
      `https://mybusiness.googleapis.com/v4/${locationName}/localPosts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postPayload)
      }
    );

    if (!postResponse.ok) {
      const errorData = await postResponse.json();
      throw new Error(errorData.error?.message || 'Failed to publish to Google');
    }

    const result = await postResponse.json();

    return {
      success: true,
      platformPostId: result.name,
      publishedAt: new Date()
    };
  } catch (error) {
    console.error('Google publish error:', error);
    throw error;
  }
}

/**
 * Refresh Google access token using refresh token
 */
export async function refreshGoogleToken(refreshToken) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Google token');
    }

    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

/**
 * Check if token needs refresh (expires in < 5 minutes)
 */
export function needsTokenRefresh(tokenExpiry) {
  if (!tokenExpiry) return true;
  
  const expiryTime = new Date(tokenExpiry).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  return (expiryTime - now) < fiveMinutes;
}
