export const environment = {
  production: true,
  api: 'http://agave.jehl.internal/ml/api/',
  oidc: {
    issuer: 'http://agave.jehl.internal',
    redirectUri: 'http://aloe.jehl.internal/ml/#/dashboard/home?',
    clientId: 'jeMachineLearning',
    scope: 'openid profile',
    requireHttps: false
  }
};
