"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  isPushNotificationSupported,
  initializePushNotifications,
  requestNotificationPermission,
} from "@/services/pushNotificationService";

/**
 * Hook to initialize push notifications in the app
 * Automatically sets up Service Worker and requests permissions
 */
export function usePushNotifications() {
  const { isSignedIn } = useUser();
  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  useEffect(() => {
    // Check if push notifications are supported
    const supported = isPushNotificationSupported();
    // setIsSupported(supported);

    // Only initialize if user is signed in and notifications are supported
    if (isSignedIn && supported && !isInitialized) {
      initializePushNotifications().then(() => {
        setIsInitialized(true);
        if (typeof Notification !== "undefined") {
          setPermissionStatus(Notification.permission);
        }
      });
    }
  }, [isSignedIn, isInitialized]);

  const requestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (typeof Notification !== "undefined") {
      setPermissionStatus(Notification.permission);
    }
    return granted;
  };

  return {
    isSupported,
    isInitialized,
    permissionStatus,
    requestPermission,
  };
}
