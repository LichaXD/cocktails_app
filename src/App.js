import React, { Component } from "react";
import CocktailsList from "./CocktailsList";
import "./main.css";
import Grid from "@material-ui/core/Grid";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktails_list: [],
      offset: 0
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=Cocktail_glass"
    )
      .then(response => response.json())
      .then(cocktails_list =>
        this.setState({ cocktails_list: cocktails_list.drinks })
      );
  }

  handleClick(offset) {
    this.setState({ offset });
  }

  render() {
    const listCocktails = this.state.cocktails_list;
    return (
      <div>
        <header>
          <h1 className="title">Cocktails List </h1>
        </header>

        <div>
          <Grid container spacing={40} justify="center">
            {listCocktails.map(listCocktails => (
              <div key={listCocktails.idDrink}>
                <CocktailsList
                  name={listCocktails.strDrink}
                  img={listCocktails.strDrinkThumb}
                  id={listCocktails.idDrink}
                />
              </div>
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}
