import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const styles = theme => ({
  card: {
    width: "350px",
    margin: "1em",
    boxSizing: "border-box",
    minHeight: "500px"
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
    minWidth: "200px"
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
});

class CocktailsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      img: this.props.img,
      id: this.props.id,
      cocktails_details: [],
      expanded: false,
      cocktails_details_measures: [],
      cocktails_details_ingredients: [],
      isLoading: true
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  componentWillMount() {
    this.setState({
      isLoading: true
    });
    fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" +
        this.state.id
    )
      .then(response => response.json())
      .then(cocktails_details_json => {
        const removeEmpty = cocktails_details_json => {
          let newObj = {};
          Object.keys(cocktails_details_json).forEach(prop => {
            if (
              cocktails_details_json[prop] &&
              cocktails_details_json[prop] !== " "
            ) {
              newObj[prop] = cocktails_details_json[prop];
            }
          });
          return newObj;
        };

        let cocktails_details = removeEmpty(cocktails_details_json.drinks[0]);
        cocktails_details.ingredients_list = [];
        cocktails_details.measures_list = [];
        for (var key in cocktails_details) {
          if (cocktails_details.hasOwnProperty(key)) {
            if (key.includes("strIngredient")) {
              cocktails_details.ingredients_list.push(cocktails_details[key]);
            }
            if (key.includes("strMeasure")) {
              cocktails_details.measures_list.push(cocktails_details[key]);
            }
          }
        }
        this.setState({
          cocktails_details: cocktails_details,
          cocktails_details_ingredients: cocktails_details.ingredients_list,
          cocktails_details_measures: cocktails_details.measures_list
        });
        this.setState({
          isLoading: false
        });
      });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    } else {
      const { classes } = this.props;
      const ingredients = this.state.cocktails_details_ingredients;
      const measures = this.state.cocktails_details_measures;
      const preparation = this.state.cocktails_details.strInstructions;
      let extraIngredients;
      let labelExtraIngredients;
      let ingredientsCount = ingredients.length;

      if (ingredients.length > 2) {
        extraIngredients = ingredientsCount - 2;
        labelExtraIngredients = (
          <Typography component="p" variant="subtitle1">
            and {extraIngredients} ingredients more
          </Typography>
        );
      } else {
        labelExtraIngredients = "";
      }
      const options = [];
      for (let i = 0; i < ingredientsCount; i++) {
        options.push(
          <li key={ingredients[i]}>
            {measures[i]}
            {ingredients[i]}
          </li>
        );
      }
      return (
        <Card className={classes.card}>
          <CardHeader action={<IconButton />} title={this.state.name} />
          <CardMedia
            className={classes.media}
            image={this.state.img}
            title={this.state.name}
          />
          <CardContent>
            <Typography component="p" variant="h6">
              {ingredients[0]}
            </Typography>
            <Typography component="p" variant="h6">
              {ingredients[1]}
            </Typography>
            <br />
            {labelExtraIngredients}
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography component="p" variant="subtitle1">
                Full list of ingredients and their measures
              </Typography>
              {options}
              <br />
              <Typography component="p" variant="subtitle1">
                How to prepare
              </Typography>
              <Typography component="p" variant="subtitle1">
                {preparation}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      );
    }
  }
}
CocktailsList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CocktailsList);
