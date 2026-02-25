/**
 * Facebook Publisher
 * Posts content to Facebook Pages
 */

/**
 * Publish a post to Facebook Page
 */
export async function publishToFacebook(post, accessToken) {
  try {
    // Get user's pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );

    if (!pagesResponse.ok) {
      throw new Error('Failed to fetch Facebook pages');
    }

    const pagesData = await pagesResponse.json();
    const page = pagesData.data?.[0];

    if (!page) {
      throw new Error('No Facebook page found');
    }

    const pageId = page.id;
    const pageAccessToken = page.access_token;

    // Prepare the post payload
    const postPayload = {
      message: post.content,
      access_token: pageAccessToken
    };

    // Add photo if image URL provided
    if (post.mediaUrl) {
      // For photos, use the photo endpoint
      const photoResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/photos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: post.mediaUrl,
            caption: post.content,
            access_token: pageAccessToken,
            published: true
          })
        }
      );

      if (!photoResponse.ok) {
        const errorData = await photoResponse.json();
        throw new Error(errorData.error?.message || 'Failed to publish photo to Facebook');
      }

      const photoResult = await photoResponse.json();

      return {
        success: true,
        platformPostId: photoResult.id,
        publishedAt: new Date()
      };
    } else {
      // Text-only post
      const postResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postPayload)
        }
      );

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        throw new Error(errorData.error?.message || 'Failed to publish to Facebook');
      }

      const result = await postResponse.json();

      return {
        success: true,
        platformPostId: result.id,
        publishedAt: new Date()
      };
    }
  } catch (error) {
    console.error('Facebook publish error:', error);
    throw error;
  }
}

/**
 * Get post insights/analytics from Facebook
 */
export async function getFacebookPostInsights(postId, accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${postId}/insights?metric=post_impressions,post_engaged_users&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch post insights');
    }

    const data = await response.json();
    
    return {
      impressions: data.data?.find(m => m.name === 'post_impressions')?.values?.[0]?.value || 0,
      engagement: data.data?.find(m => m.name === 'post_engaged_users')?.values?.[0]?.value || 0
    };
  } catch (error) {
    console.error('Facebook insights error:', error);
    return null;
  }
}

/**
 * Delete a post from Facebook
 */
export async function deleteFacebookPost(postId, accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${postId}?access_token=${accessToken}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete Facebook post');
    }

    return { success: true };
  } catch (error) {
    console.error('Facebook delete error:', error);
    throw error;
  }
}
