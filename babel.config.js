const env = process.env.BABEL_ENV;

if (typeof env === 'undefined') {
  // test runner
  module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
      '@babel/plugin-transform-runtime',
    ],
    sourceMaps: true,
  };
  return;
}

const runtimeOptions =
  env === 'esm' ? { useEsModules: true } : { useEsModules: false };

const presets = env === 'cjs' ? [
    ['@babel/preset-env',
    {
      "useBuiltIns": false,
      "targets": { "esmodules": false }
    }]
  ] : [
    ['@babel/preset-env',
    {
      "useBuiltIns": false,
      "targets": { "esmodules": true }
    }]
  ];
const plugins = [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-transform-react-jsx',
  '@babel/plugin-proposal-object-rest-spread',
  ['@babel/plugin-transform-runtime', runtimeOptions],
];

module.exports = {
  plugins,
  presets,
};