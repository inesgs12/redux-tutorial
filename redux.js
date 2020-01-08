console.clear();
// ACTION CREATOR -> ACTION -> DISPATCH -> REDUCERS -> STATE

// ACTION CREATORS & ACTIONS -------------------------------------------------------------------------------------------------

// types by convention go in all caps with underscores between words.
// Payloads have context of the type of action. Try not to hardcode the payload arguments.

// People dropping off a form (ACTION CREATORS)
// THIS IS ACTION CREATOR #1
const createPolicy = (name, amount) => {
  return {
    // Action (a form in the analogy)
    type: "CREATE_POLICY",
    payload: {
      name: name,
      amount: amount
      // you can just do name, amount
    }
  };
};

//ACTION CREATOR #2 DELETING A POLICY

const deletePolicy = name => {
  return {
    type: "DELETE_POLICY",
    payload: {
      name: name
    }
  };
};

// THIS IS ACTION CREATOR #3
const createClaim = (name, amountOfMoneyToCollect) => {
  return {
    type: "CREATE_CLAIM",
    payload: {
      name,
      amountOfMoneyToCollect
    }
  };
};

// REDUCERS (claims departments) ---------------------------------------------------------------------------------------------------------------------------------------------------
// the GOAL of the REDUCER is to take some existing data and some action and modify and return that existing data based on that action

// Each one of each reducer is going to be called with an Action created with the Action Creator. 2 arguments are always passed in the same order. The first argument is the ... and the second argument is the action.
// Every time we want to chagne something inside the reducers, we want to create a new array. Inside reducers we avoid modifying existing data structures. Never 'push()'!!!!
// The reducer is a function so it doesn't know what its data is until it gets called. i.e. The very first time that our reducer gets called there will be no claims. We then have to default the value of that first argument. We replace it with an empty array.

const claimsHistory = (oldListOfClaims = [], action) => {
  if (action.type === "CREATE_CLAIM") {
    // we care about this action (form!)
    return [...oldListOfClaims, action.payload];
    // this will create a brand new array with the contents of the old list of claims and add to it the action.payload
  }
  // we don't care about the action (form! )
  return oldListOfClaims;
};

//remember to add default value for the first time that the reducer is called

const accounting = (bagOfMoney = 100, action) => {
  if (action.type === "CREATE_CLAIM") {
    return bagOfMoney - action.payload.amountOfMoneyToCollect;
  } else if (action.type === "CREATE_POLICY") {
    return bagOfMoney + action.payload.amount;
  } else {
    return bagOfMoney;
  }
};

const policies = (listOfPolicies = [], action) => {
  if (action.type === "CREATE_POLICY") {
    return [...listOfPolicies, action.payload.name];
  } else if (action.type === "DELETE_POLICY") {
    // console.log("Action payload.name: "+ action.payload.name)
    return listOfPolicies.filter(policy => policy !== action.payload.name);

    // console.log("Returned Policies: " + returnedPolicies)
    // return returnedPolicies
  } else {
    return listOfPolicies;
  }
};

// now we are going to wire all our reducers together into something called a STORE

// STORE -------------------------------------------------------------------------------------------------

const { createStore, combineReducers } = Redux;

const ourDepartments = combineReducers({
  accounting: accounting,
  claimsHistory: claimsHistory,
  policies: policies
});

const store = createStore(ourDepartments);

// the store object represents our entire redux application. it contains references to all of our different reducers and all the state or data produced by those reducers as well.
// the dispatch function from the store is what we pass an action to. We sent the dispatch function an action and the dispatch function sends it to each of the reducer of our application.
store.dispatch(createPolicy("Ines", 20));
store.dispatch(createPolicy("Ronan", 50));
store.dispatch(createPolicy("Mary", 30));

store.dispatch(createClaim("Ronan", 20));
store.dispatch(createClaim("Mary", 10));

store.dispatch(deletePolicy("Mary"));

// store.dispatch(deletePolicy('Ines'))

console.log(store.getState());


// every time we want to change the state we are going to call an action object. This will produce an action object that describes exactly how we wnat to create data in our application. That action object gets fed to the dispatch function. the dispatch function will create copies of the action object and feed these copies to the reducers. In turn, the reducers will eventually return some new data. the new data will get formed into some new state object. Wail until we have to update our state to start the cycle again. 

// Each dispatch runs an entire cycle 

// We do not get access to our state property and modify it directly. We can only modify state by dispatching an Action that has been created by an Action Creator. 