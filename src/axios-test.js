import axios from "axios";

var instance = axios.create({
  baseURL: "https://react-test-cc0ba.firebaseio.com/"
});

export default instance;
