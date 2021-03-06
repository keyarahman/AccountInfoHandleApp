import * as types from "../actionType";
import axios from "axios";

const USER_API = "https://eazm.co.uk/api/users";

const USER_NEW_API = "https://eazm.co.uk/api/user_new";

const SINGLE_USER_API = "https://eazm.co.uk/api/user";

const EDIT_USER_API = "https://eazm.co.uk/api/user_edit";

const USER_DELETE_API = "https://eazm.co.uk/api/user_delete";

const LOGIN_API = "https://eazm.co.uk/api/login";

const SIGN_UP_API = "https://eazm.co.uk/api/signup";

const getUsers = (users) => ({
  type: types.GET_USERS,
  payload: users,
});

let userToken = null;

const userDeletd = () => ({
  type: types.DELETE_USER,
});
const userAdded = () => ({
  type: types.ADD_USER,
});
const editSingleUser = (user) => ({
  type: types.EDIT_SINGLE_USER,
  payload: user,
});
const userUpdated = () => ({
  type: types.UPDATE_USER,
});
const loginUser = (res) => ({
  type: types.LOGIN,
  payload: res,
});
const loginerror = (res) => ({
  type: types.LOGIN_ERROR,
  payload: res,
});

export const Login = (email, password, onComplete, onError) => {
  return function (dispatch) {
    var data = {
      email: email,
      password: password,
    };
    try {
      axios
        .post(LOGIN_API, data, {
          headers: {
            Accept: "application/json",
          },
        })
        .then(function (response) {
          console.log(response.data);
          if (response && response.data) {
            localStorage.setItem("userToken", response.data.accessToken);
            localStorage.setItem(
              "profile",
              JSON.stringify(response.data.dashboard.profile)
            );
            dispatch(loginerror(""));
            dispatch(loginUser(response.data.dashboard.profile));

            onComplete && onComplete();
          }
        })
        .catch(function (error) {
          onError();
          // dispatch(loginerror("Invalid email or password"));
        });
    } catch (error) {
      onError();
      //dispatch(loginerror("Invalid email or password"));
    }
  };
};

export const logout = () => {
  localStorage.setItem("profile", null);
};

export const signUp = (
  title,
  fName,
  lName,
  email,
  password,
  phone,
  onComplete
) => {
  return function (dispatch) {
    var data = {
      title: title,
      first_name: fName,
      last_name: lName,
      email: email,
      password: password,
      phone: phone,
    };
    try {
      axios
        .post(SIGN_UP_API, data, {
          headers: {
            Accept: "application/json",
          },
        })
        .then(function (response) {
          console.log(response);
          onComplete && onComplete();
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log("error in getting order data : ", error);
    }
  };
};

export const loadUsers = () => {
  let token = localStorage.getItem("userToken");
  console.log(token);
  return function (dispatch) {
    try {
      axios
        .get(USER_API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("responseData", res);
          dispatch(getUsers(res.data));
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      console.log("error in getting order data : ", error);
    }
  };
};

export const deleteUser = (id) => {
  let token = localStorage.getItem("userToken");
  console.log(id);
  return function (dispatch) {
    try {
      axios
        .delete(
          `${USER_DELETE_API}/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("responseData", res);
          dispatch(userDeletd());
          dispatch(loadUsers());
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      console.log("error in getting order data : ", error);
    }
  };
};

export const addUser = (
  title,
  first_name,
  last_name,
  email,
  password,
  phone
) => {
  return function (dispatch) {
    let token = localStorage.getItem("userToken");
    var data = {
      title: title,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      phone: phone,
    };
    try {
      axios
        .post(USER_NEW_API, data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("responseData", res);
          dispatch(userAdded());
          dispatch(loadUsers());
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      console.log("error in getting data : ", error);
    }
  };
};
export const getSingleUser = (id) => {
  return function (dispatch) {
    let token = localStorage.getItem("userToken");
    axios
      .get(`${SINGLE_USER_API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("responseData", res);
        dispatch(editSingleUser(res.data));
      })
      .catch((error) => console.log("error", error));
  };
};

export const updateUser = (title, first_name, last_name, phone, id) => {
  let token = localStorage.getItem("userToken");
  return function (dispatch) {
    var data = {
      title: title,
      first_name: first_name,
      last_name: last_name,
      phone: phone,
    };
    try {
      axios
        .post(`${EDIT_USER_API}/${id}`, data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("responseData", res);
          dispatch(userUpdated());
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      console.log("error in getting data : ", error);
    }
  };
};
