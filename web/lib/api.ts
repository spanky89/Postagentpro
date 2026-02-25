// API Client for PostAgentPro

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface SignupData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    planTier: string;
    status: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const result = await response.json();
    
    // Store token
    localStorage.setItem('token', result.token);
    
    return result;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const result = await response.json();
    
    // Store token
    localStorage.setItem('token', result.token);
    
    return result;
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async getBusinessProfile() {
    const response = await fetch(`${this.baseUrl}/api/business`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch business profile');
    }

    return response.json();
  }

  async saveBusinessProfile(data: {
    name: string;
    type: string;
    locationCity: string;
    locationState: string;
    description?: string;
    website?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save business profile');
    }

    return response.json();
  }

  async getConnections() {
    const response = await fetch(`${this.baseUrl}/api/connections`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch connections');
    }

    return response.json();
  }

  async initiateGoogleAuth() {
    const response = await fetch(`${this.baseUrl}/api/connections/google/initiate`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate Google auth');
    }

    return response.json();
  }

  async completeFacebookAuth(code: string) {
    const response = await fetch(`${this.baseUrl}/api/connections/facebook/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete Facebook auth');
    }

    return response.json();
  }

  async completeGoogleAuth(code: string) {
    const response = await fetch(`${this.baseUrl}/api/connections/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete Google auth');
    }

    return response.json();
  }

  async initiateFacebookAuth() {
    const response = await fetch(`${this.baseUrl}/api/connections/facebook/initiate`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate Facebook auth');
    }

    return response.json();
  }

  async disconnectAccount(id: string) {
    const response = await fetch(`${this.baseUrl}/api/connections/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to disconnect account');
    }

    return response.json();
  }

  async getPosts(status?: string) {
    const url = new URL(`${this.baseUrl}/api/posts`);
    if (status) {
      url.searchParams.append('status', status);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch posts');
    }

    return response.json();
  }

  async generatePost(postType: string = 'general', includeImage: boolean = true) {
    const response = await fetch(`${this.baseUrl}/api/posts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ postType, includeImage }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate post');
    }

    return response.json();
  }

  async bulkGeneratePosts(count: number = 7, postTypes: string[] = ['general']) {
    const response = await fetch(`${this.baseUrl}/api/posts/bulk-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ count, postTypes }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate posts');
    }

    return response.json();
  }

  async updatePost(id: string, data: any) {
    const response = await fetch(`${this.baseUrl}/api/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update post');
    }

    return response.json();
  }

  async deletePost(id: string) {
    const response = await fetch(`${this.baseUrl}/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }

    return response.json();
  }

  async publishPostNow(id: string) {
    const response = await fetch(`${this.baseUrl}/api/posts/${id}/publish-now`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to publish post');
    }

    return response.json();
  }
}

export const api = new ApiClient();
