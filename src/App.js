import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "./axios-test";
import { error } from "util";
import _ from "lodash";
import firebase from "./Firebase";

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
            <input type="text" onChange={this.handleChange} />
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
    firebase
      .database()
      .ref("todo/")
      .on("value", snapshot => {
        this.setState({ todos: snapshot.val() });
      });
  }

  addData() {
    firebase
      .database()
      .ref("todo")
      .push()
      .set({
        caption: this.state.currentValue,
        isCompleted: false
      })
      .then(response => {
        this.setState({ currentValue: null });
        console.log("successfully added");
      });
  }
  deleteTask(key) {
    firebase
      .database()
      .ref("todo/" + key)
      .remove();
  }

  toggle(key) {
    firebase
      .database()
      .ref("todo/" + key)
      .once("value", snapshot => {
        console.log("toggle called");
        console.log(snapshot.val());

        var updates = {};
        updates["/todo/" + key + "/isCompleted"] = !snapshot.val().isCompleted;

        firebase
          .database()
          .ref()
          .update(updates);
      });
  }
}

export default App;
