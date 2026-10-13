import React from "react";
import axios from "axios";

/* const welcome = {
  greeting: "Hey",
  title: "React",
}; */

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
// const initialStories = [
//   {
//     title: "React",
//     url: "https://react.dev/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: "Redux",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

const App = () => {
  /*   const [isVisible, setVisible] = React.useState(true);
  const [count, setCount] = React.useState(0);

  const hobbies = ["programming", "reading", "football"];
*/

  // const [toggle, setToggle] = React.useState(false);
  // const handleToggle = () => setToggle(!toggle);

  //   const [searchTerm, setSearchTerm] = React.useState(
  //     () => localStorage.getItem("search") ?? "react",
  //   );
  //
  //   React.useEffect(() => {
  //     localStorage.setItem("search", searchTerm);
  //     if (searchTerm == "anish") {
  //       console.log("it's my name");
  //       localStorage.removeItem("search");
  //     }
  //     console.log("use effect: ");
  //   }, [searchTerm]);

  // replace above code block with custom hook
  //

  // const [stories, setStories] = React.useState([]);

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [searchUrl, setSearchUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`,
  );

  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isError, setIsError] = React.useState(false);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  //   const getAsyncStories = () =>
  //     new Promise((resolve, reject) => {
  //       setTimeout(() => resolve({ data: { stories: initialStories } }), 2000);
  //       // setTimeout(reject,2000)
  //     });

  const handleFetchStories = React.useCallback(async () => {
    // setIsLoading(true);
    // if (!searchTerm) return;
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    // getAsyncStories()
    //   .then((result) => {
    //     dispatchStories({
    //       type: "STORIES_FETCH_SUCCESS",
    //       payload: result.data.stories,
    //     });
    //     // setIsLoading(false);
    //     // throw new Error("error getting stories.")
    //   })
    //   .catch((err) => {
    //     dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    //     // setIsError(true);
    //     console.error(err);
    //   });
    try {
      const result = await axios.get(searchUrl);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
    console.log("from fetch stories functions.");
  }, [searchUrl]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((story) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: story,
    });
  }, []);

  const handleSearchInput = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    console.log("Searching:" + newSearchTerm);
  };

  // replaced it with searchAction for action attribute for more control over form and formdata
  // const handleSearchSubmit = (event) => {
  //   setSearchUrl(`${API_ENDPOINT}${searchTerm}`);
  //   event.preventDefault();
  // };

  const searchAction = () => {
    setSearchUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  // //can we filter the stories inside StoryList component?
  // const searchedStories = stories.data.filter((s) =>
  //   s.title.toLowerCase().includes(searchTerm.toLowerCase()),
  // );

  const handleVote = React.useCallback((id, delta) => {
    dispatchStories({
      type: "VOTE_STORY",
      payload: { id, delta },
    });

    // setStories((prev) => {
    //   return prev.map((story) =>
    //     story.objectID === id
    //       ? { ...story, points: story.points + delta }
    //       : story,
    //   );
    // });
  }, []);

  // const handleRemoveStory = (id) => {
  //   setStories((prev) => prev.filter((story) => story.objectID !== id));
  // };
  // console.log("searching Storeies: " + searchedStories.length);
  console.log("searching:" + searchTerm);

  // console.log("App REnders!");
  console.log("B:App");
  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>
      {/* <Toggler1 />
      <Toggler2 toggle={toggle} onToggle={handleToggle} /> */}
      {/* <Timer /> */}
      {stories.isError && <p>Something went wrong.</p>}

      {stories.isLoading ? (
        <p> Loading...</p>
      ) : (
        <>
          <SearchForm
            searchTerm={searchTerm}
            onSearchInput={handleSearchInput}
            // onSearchSubmit={handleSearchSubmit}
            searchAction={searchAction}
          />

          <StoryList
            storyItems={stories.data}
            onVote={handleVote}
            onRemove={handleRemoveStory}
          />
        </>
      )}
    </div>
  );
};

const SearchForm = ({ searchTerm, onSearchInput, searchAction }) => {
  return (
    <form action={searchAction} className="search-form">
      <InputWithLabel
        id="searchByTitle"
        isAutoFocus
        value={searchTerm}
        onInputChange={onSearchInput}
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <button
        type="submit"
        disabled={!searchTerm}
        className="button button-large"
      >
        Submit
      </button>
    </form>
  );
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };

    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID,
        ),
      };

    case "VOTE_STORY":
      return {
        ...state,
        data: state.data.map((story) =>
          story.objectID === action.payload.id
            ? { ...story, points: story.points + action.payload.delta }
            : story,
        ),
      };

    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    default:
      throw new Error("Unsupported action.");
  }
};

// writing custom hook
const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState,
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue] as const;
};

const InputWithLabel = ({
  id,
  isAutoFocus,
  value,
  type = "text",
  onInputChange,
  children,
}) => {
  // const handleChange = (event) => {
  //   console.log("Handling change on Search Function");
  //   onSearch(event.target.value);
  // };
  return (
    <div>
      {children}
      <label htmlFor={id}></label>
      <input
        id={id}
        autoFocus={isAutoFocus}
        value={value}
        type={type}
        onChange={(event) => onInputChange(event.target.value)}
        className="input"
      />

      <p>
        You are searching: <b>{value}</b>
      </p>
    </div>
  );
};

const StoryList = React.memo(
  ({ storyItems, onVote, onRemove }) =>
    console.log("B:List") || (
      <table
        style={{
          borderCollapse: "collapse",
          margin: "16px 0",
          fontFamily: "sans-serif",
        }}
      >
        <tbody>
          {storyItems.map((item) => (
            <Item
              key={item.objectID}
              item={item}
              onVote={onVote}
              onRemove={onRemove}
              className="button button_small"
            />
          ))}
        </tbody>
      </table>
    ),
);

const Item = React.memo(({ item, onVote, onRemove }) => {
  console.log("B:Item", item.objectID);
  const handlePlusPointClick = () => {
    onVote(item.objectID, +1);
  };
  const handleMinusPointClick = () => {
    onVote(item.objectID, -1);
  };
  return (
    <tr style={{ borderBottom: "1px solid #ddd" }}>
      <td style={{ padding: "10px 24px 10px 8px" }}>
        {/*     <div>
      <a href={props.item.url}>
        <span>{props.item.title}</span>
      </a>
      <br></br>
      {props.item.author}
      <br></br>
      {props.item.num_comments}
      <br></br>
      {props.item.points}
    </div> */}

        <a href={item.url}>
          <span>{item.title}</span>
        </a>
        <br></br>
        {item.points}
        <Button btnLabel={"+"} onClick={handlePlusPointClick} />

        <Button btnLabel={"-"} onClick={handleMinusPointClick} />
      </td>
      <td style={{ padding: "10px 8px", verticalAlign: "top" }}>
        <button
          type="button"
          style={{ color: "#c00", cursor: "pointer" }}
          onClick={() => onRemove(item)}
        >
          X
        </button>
      </td>

      {/* <button onClick={() => props.onAdd(props.item.objectID)}>+</button>{" "}
    <br></br>
    <button onClick={() => props.onSubtract(props.item.objectID)}>-</button>*/}
    </tr>
  );
});

const Button = ({ btnLabel, onClick }) => (
  <button type="button" onClick={onClick}>
    {btnLabel}
  </button>
);

export default App;

// return (
//   <div>
//     <h1>
//       {welcome.greeting} {welcome.title}
//     </h1>
//     <hr />
//     <Search />
//     {/* using React.createElement instead of JSX for learning (not recommended) */}
//     {/* {React.createElement("div", {}, [
//       React.createElement("label", { htmlFor: "search" }, "Search"),
//       React.createElement("input", { id: "search", type: "text" }),
//     ])} */}
//     <PrintHobbies items={hobbies} />
//     <PrintObjLists items={list} />

//     <div>
//       <button onClick={() => setVisible(!isVisible)}>Toggle</button>

//       {isVisible ? <Counter count={count} setCount={setCount} /> : null}
//     </div>
//   </div>
// );

/* this function uses destructuring for receiving arguments from the component
const Counter = ({ count, setCount }) => (
  <div>
    <button onClick={() => setCount(count + 1)}> + </button>
    <button onClick={() => setCount(count - 1)}> - </button>
    <div>{count}</div>
  </div>
);

// const PrintHobby = (hobby) => <li>{hobby}</li>;
const PrintHobbies = (props) => (
  <ul>
    {props.items.map((hobby, idx) => (
      <li key={idx}>{hobby}</li>
    ))}
  </ul>
);
 */

/* const PrintHobby = ({items}) => (
  <ul>
    {
    items.map((hobby) =>
      <li>{hobby}</li>
    )
  }
  </ul>);
 */

// const Toggler1 = () => {
//   const [toggle, setToggle] = React.useState(false);
//   const handleToggle = () => setToggle(!toggle);
//   console.log("Toggler 1 renders");
//   React.useEffect(() => {
//     console.log("running useeffect on toggler1");
//   }, [toggle]);
//   return (
//     <div>
//       <button type="button" onClick={handleToggle}>
//         Toggler1
//       </button>
//       {toggle && <div>Hello React</div>}
//     </div>
//   );
// };

// const Toggler2 = ({ toggle, onToggle }) => {
//   React.useEffect(() => {
//     console.log("useEffect running");
//   }, [toggle]);
//   return (
//     <div>
//       <button type="button" onClick={onToggle}>
//         Toggler2
//       </button>

//       {toggle && <div>Hello React</div>}
//     </div>
//   );
// };

/* const Timer = () => {
  const [timer, setTimer] = React.useState(0);
  React.useEffect(() => {
    console.log("running setup");
    console.log("timer: " + timer);
    const interval = setInterval(
      () => setTimer((currentTimer) => currentTimer + 1),
      5000,
    );
    console.log("interval;" + interval);
    console.log("running cleanup");
    return () => clearInterval(interval);
  });

  return <div>{timer}</div>;
}; */
