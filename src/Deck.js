import React, { Component } from "react";
import Card from "./Card";
import "./Deck.css";
import axios from "axios";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

class Deck extends Component {
	constructor(props) {
		super(props);
		this.state = { deck: null, drawn: [] };
		//Bind From Constructor With Async Funcs
		this.getCard = this.getCard.bind(this);
	}

	//Send Async Request to API_URL
	async componentDidMount() {
		let deck = await axios.get(`${API_BASE_URL}/new/shuffle/?deck_count=1`);
		//Check Deck Response
		console.log(deck.data);
		this.setState({ deck: deck.data });
	}

	//Make Request Using Deck ID
	//setState Using New Card Info From API
	async getCard() {
		let deckID = this.state.deck.deck_id;

		//Make sure deck isn't exhausted of cards causing app collapse
		//Using data.success so last cardis draw
		try {
			let card_URL = `${API_BASE_URL}/${deckID}/draw/`;
			let newCard = await axios.get(card_URL);
			if (newCard.data.success === false) {
				throw new Error("NO CARDS LEFT");
			}
			console.log(newCard.data);
			let card = newCard.data.cards[0];
			this.setState(st => ({
				drawn: [
					...st.drawn,
					{
						id: card.code,
						image: card.image,
						name: `${card.value} OF ${card.suit}`
					}
				]
			}));
		} catch (err) {
			alert(err);
		}
	}

	render() {
		const cards = this.state.drawn.map(card => (
			<Card name={card.name} image={card.image} key={card.id} />
		));
		return (
			<div>
				<h1 className="Deck-title"> ~ DEALERS PICK ~</h1>
				<h2 className="Deck-title subtitle">React Card Dealer & Animation Demo</h2>
				<button className="Deck-btn" onClick={this.getCard}>
					HIT ME!!!
				</button>
				<div className="Deck-card">{cards}</div>
			</div>
		);
	}
}

export default Deck;
