interface FetchApiOptions {
    url: string;
    method: string;
    data?: any;
    headers?: Record<string, string>;
  }
  
  export async function fetchApi({ url, method = 'GET', data = null, headers = {} }: FetchApiOptions) {
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ url, method, data, headers }),
      });
  
      const result = await response.json();
  
      // Lưu các cookie vào localStorage nếu cần
      if (result.cookies) {
        Object.keys(result.cookies).forEach(cookieName => {
          localStorage.setItem(cookieName, result.cookies[cookieName]);
        });
      }
  
      return result.data;
    } catch (error) {
      console.error('Error fetching API:', error);
      throw error;
    }
  }