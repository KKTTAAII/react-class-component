import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = { numJokesToGet: 10 };
  state = { jokes: [] };

  async componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  async componentDidUpdate() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  getJokes = async () => {
    const { numJokesToGet } = this.props;
    const { jokes } = this.state;
    const allJokes = [...jokes];
    const seenJokes = new Set();
    try {
      while (allJokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        const { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          allJokes.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: allJokes });
    } catch (e) {
      console.log(e);
      return <div>Oops, somthing's wrong. Please contact your admin</div>;
    }
  };

  generateNewJokes = () => {
    this.setState({ jokes: [] });
  };

  vote = (id, delta) => {
    this.setState({
      jokes: this.state.jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    });
  };

  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
      const jokes = sortedJokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={this.vote}
        />
      ));

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
          {jokes}
        </div>
      );
    }

    return <div className="loading">Loading...</div>;
  }
}

export default JokeList;
