import React from 'react';
import Grid from '@mui/material/Grid';
import Tile from '../Tilecomponent/TileComponent';
import './TileGrid.css';

const TilesGrid = ({ tiles, onTileClick }) => {
  return (
    <Grid container spacing={2}>
      {tiles.map((tile) => (
        <Grid
          item
          xs={12}  // Full width on extra-small screens
          sm={6}   // 2 tiles per row on small screens
          md={4}   // 3 tiles per row on medium screens
          lg={3}   // 4 tiles per row on large screens
          key={tile.name}
        >
          <Tile name={tile.name} image={tile.image} onClick={onTileClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TilesGrid;
