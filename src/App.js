import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "./axios-test";
import { error } from "util";
import _ from "lodash";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentValue: "",
      todos: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.addData = this.addData.bind(this);
    this.getData = this.getData.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  componentDidMount() {
    this.getData();
  }
  render() {
    let myButton = <button onClick={this.addData}>Add me</button>;
    if (this.state.loading) {
      myButton = <p>Loading</p>;
    }

    let tasks = <p>Loading</p>;
    if (this.state.todos) {
      tasks = [];
      let todos = this.state.todos;
      tasks = _.map(todos, (todo, i) => (
        <li
          key={i}
          style={
            todo.isCompleted
              ? { textDecoration: "line-through" }
              : { textDecoration: "none" }
          }
        >
          {todo.caption}
          <button onClick={() => this.deleteTask(i)}>delete</button>
          <input
            type="checkbox"
            onClick={() => this.toggle(i)}
            checked={todo.isCompleted ? true : false}
          />
        </li>
      ));
    }

    return (
      <div className="App">
        <header className="App-header">
          <label>
            Enter Task:
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.currentValue}
            />
          </label>
          {myButton}
          <ul>{tasks}</ul>
        </header>
      </div>
    );
  }

  handleChange(event) {
    this.setState({ currentValue: event.target.value });
  }
  getData() {
    axios
      .get("https://react-test-cc0ba.firebaseio.com/todo.json")
      .then(response => {
        this.setState({ todos: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  addData() {
    this.setState({ loading: true });
    const testOrder = {
      caption: this.state.currentValue,
      isCompleted: false
    };
    axios
      .post("/todo.json", testOrder)
      .then(response => {
        this.setState({ loading: false, currentValue: "" });
        this.getData();
      })
      .catch(error => console.log(error));
  }
  deleteTask(key) {
    axios
      .delete("/todo/" + key + ".json")
      .then(res => {
        this.getData();
      })
      .catch(e => console.log(e));
  }

  toggle(key) {
    axios
      .get("todo/" + key + ".json")
      .then(response => {
        const newData = {
          caption: response.data.caption,
          isCompleted: !response.data.isCompleted
        };
        axios
          .put("todo/" + key + "/.json", newData)
          .then(putResponse => {
            this.getData();
          })
          .catch(putError => {
            console.log(putError);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default App;
