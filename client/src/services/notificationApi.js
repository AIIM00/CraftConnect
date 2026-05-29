import axios from "axios";

export const getUnreadNotificationCount = async (backendUrl) => {
  const { data } = await axios.get(
    `${backendUrl}/api/notifications/unread-count`,
    { withCredentials: true },
  );

  return data.count || 0;
};

export const getMyNotifications = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}/api/notifications`, {
    withCredentials: true,
  });

  return data.notifications || [];
};

export const markAllNotificationsAsRead = async (backendUrl) => {
  const { data } = await axios.patch(
    `${backendUrl}/api/notifications/mark-all-read`,
    {},
    { withCredentials: true },
  );

  return data;
};
