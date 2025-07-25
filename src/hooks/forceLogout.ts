import Routes from "@app/routes";
import { queryClient } from "@providers/reactQueryProvider";
import { router } from "expo-router";
import { useAuthStore } from "@store/authStore";

// force logout helper - for when things go wrong
export const forceLogout = () => {
  useAuthStore.getState().logout();
  queryClient.clear();
  if (router.canDismiss()) router.dismissAll();
  router.replace(Routes.Auth.Login);
};
