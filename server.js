const express = require('express');
const LaunchDarkly = require('launchdarkly-node-server-sdk');

const app = express();
const port = 80;

// Configuración LaunchDarkly
// Pega tu clave 'sdk-...' aquí abajo si no usas variables de entorno
const ldClient = LaunchDarkly.init('sdk-76dd5a3c-f9b2-4936-ba25-2d1ea362b9c3');

app.get('/', async (req, res) => {
  // Usuario anónimo para test
  const user = { key: 'user-key-123' };
  
  // Verificar la Feature Flag 'show-new-message'
  // El segundo parámetro (false) es el valor por defecto si falla LD
  const showNewFeature = await ldClient.variation('show-new-message', user, false);

  if (showNewFeature) {
    res.send('<h1 style="color:green">¡FEATURE FLAG ACTIVADA! Versión 2.0 - Despliegue con ArgoCD</h1>');
  } else {
    res.send('<h1 style="color:blue">Versión Estable 1.0</h1>');
  }
});

ldClient.waitForInitialization().then(() => {
  app.listen(port, () => {
    console.log(`App escuchando en puerto ${port}`);
  });
}).catch(err => {
    console.error("Error inicializando LD", err);
});
