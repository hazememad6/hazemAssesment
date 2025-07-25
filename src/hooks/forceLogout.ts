import { router } from "expo-router";
import Routes from "@app/routes";
import { queryClient } from "@providers/reactQueryProvider";
import { useAuthStore } from "@store/authStore";

export const forceLogout = () => {
  useAuthStore.getState().logout();
  queryClient.clear();
  if (router.canDismiss()) router.dismissAll();
  router.replace(Routes.Auth.Login);
};
