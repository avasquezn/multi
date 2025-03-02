export const getTokenFromUrl = () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const state = searchParams.get('state');
      
      if (!state) {
        console.warn('No state parameter found in URL');
        return null;
      }

      const decodedToken = atob(state);
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:');
      return null;
    }
  };