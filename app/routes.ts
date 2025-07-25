const Routes = {
  Auth: {
    Login: "/(auth)/login",
  },
  App: {
    Home: `/(logged-in)/home`,
  },
  NetworkLogger: "/network-logger",
} as const;

export default Routes;
