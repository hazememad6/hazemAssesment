module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@api": "./src/api",
            "@components": "./src/components",
            "@features": "./src/features",
            "@hooks": "./src/hooks",
            "@providers": "./src/providers",
            "@query": "./src/query",
            "@storage": "./src/storage",
            "@store": "./src/store",
            "@utils": "./src/utils",
          },
        },
      ],
    ],
  };
};
