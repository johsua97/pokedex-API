const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Fuse = require('fuse.js');

const { pokemon } = require('./pokemons');

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta de prueba
app.get('/pokemon/:identifier', (req, res) => {
  const identifier = req.params.identifier;

  // opciones de búsqueda para fuse.js
  const options = {
    keys: ['id','name'], // campos del objeto a buscar
    threshold: 0.2, // umbral de relevancia
    includeScore: true // incluir la puntuación en el resultado
  };

  const fuse = new Fuse(pokemon, options);
  const result = fuse.search(identifier);

  if (result.length > 0) {
    // si se encontró un resultado, se envía el objeto pokemon correspondiente
    const pokemonInfo = result[0].item;
    res.json(pokemonInfo);
  } else {
    // si no se encontró un resultado, se envía un mensaje de error
    res.status(404).send('No se encontró ningún Pokémon con ese ID o nombre');
  }
});

// iniciar el servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});