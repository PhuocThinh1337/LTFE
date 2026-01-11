import { useEffect, useState, useCallback } from 'react';

// Google Client ID - Lấy từ file .env
// Xem hướng dẫn trong file ENV_SETUP.md
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          prompt: (callback?: (notification: { isNotDisplayed: boolean; isSkippedMoment: boolean; isDismissedMoment: boolean }) => void) => void;
          renderButton: (element: HTMLElement, config: {
            type: string;
            text: string;
            size: string;
            theme?: string;
            width?: string;
            logo_alignment?: string;
          }) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export const useGoogleAuth = (onSuccess: (userInfo: GoogleUserInfo) => void, onError?: (error: string) => void) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load Google Identity Services
  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google?.accounts?.id) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  // Initialize Google Identity Services
  useEffect(() => {
    if (!isLoaded || isInitialized || !GOOGLE_CLIENT_ID) return;

    try {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing Google Identity Services:', error);
      if (onError) {
        onError('Không thể khởi tạo Google Sign-In. Vui lòng kiểm tra Client ID.');
      }
    }
  }, [isLoaded, isInitialized]);

  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    try {
      // Decode JWT token to get user info
      // JWT token structure: header.payload.signature
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      
      const userInfo: GoogleUserInfo = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub,
      };

      onSuccess(userInfo);
    } catch (error) {
      console.error('Error decoding Google credential:', error);
      if (onError) {
        onError('Không thể xử lý thông tin từ Google. Vui lòng thử lại.');
      }
    }
  }, [onSuccess, onError]);

  const renderButton = useCallback((element: HTMLElement | null) => {
    if (!element || !isInitialized || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.renderButton(element, {
        type: 'standard',
        text: 'signin_with',
        size: 'large',
        theme: 'outline',
        // width: không set hoặc dùng số (pixels), không dùng %
        logo_alignment: 'left',
      });
    } catch (error) {
      console.error('Error rendering Google button:', error);
    }
  }, [isInitialized]);

  const prompt = useCallback(() => {
    if (!isInitialized || !window.google?.accounts?.id) {
      if (onError) {
        onError('Google Sign-In chưa sẵn sàng. Vui lòng thử lại sau.');
      }
      return;
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed || notification.isSkippedMoment || notification.isDismissedMoment) {
          // User dismissed or skipped the prompt
          // You can show a manual button here
        }
      });
    } catch (error) {
      console.error('Error prompting Google Sign-In:', error);
    }
  }, [isInitialized, onError]);

  // Debug: Log để kiểm tra biến môi trường (chỉ trong development)
  useEffect(() => {
    // Only log if critically needed or remove if strictly cleaning
  }, []);

  return {
    isLoaded,
    isInitialized,
    renderButton,
    prompt,
    hasClientId: !!GOOGLE_CLIENT_ID,
    clientId: GOOGLE_CLIENT_ID, // Expose để debug
  };
};

