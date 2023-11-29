import React, { useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axios
      .post(loginUrl, { username, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
      })
      .catch((err) => {
        setMessage(err.response ? err.response.data.message : "Error");
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!

  

    let token = localStorage.getItem("token");

    if (!token) {
      redirectToLogin();
    }
    try {
      const { data } = await axios.get(articlesUrl, {
        headers: {
          "Content-type": "application/json",
          "Authorization": token,
        },
      }); //I did not send the token
      const {articles,message} = data
    setArticles(articles);
    setMessage(message)
    } catch (err) {
      console.log(`Error : ${err.message}`);
      
      if (err.response && err.response.status === 401) {
        redirectToLogin();
      }
     
    }
  };

  const postArticle = async(article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    
    let token = localStorage.getItem("token");

    if (!token) {
      redirectToLogin();
      return; 
    }
  
    try {
      const { data } = await axios.post(articlesUrl, article, {
        headers: {
          "Content-type": "application/json",
          "Authorization": token,
        },
      });
      setCurrentArticleId(null);
      
      setMessage(data.message);
      setArticles([...articles, data.article]);
   
  
    } catch (err) {
      console.log(`Error : ${err.message}`);
      
      if (err.response && err.response.status === 401) {
        redirectToLogin();
      }
      
    }
  };

  const updateArticle = async({ article_id, article }) => {
    let token = localStorage.getItem("token");
    
    if (!token) {
      redirectToLogin();
      return;
    }
  
    try {
      const { data } = await axios.put(`${articlesUrl}/${article_id}`, article, {
        headers: {
          "Content-type": "application/json",
          "Authorization": token,
        },
      });
  
      
      setArticles(articles.map(a => a.article_id === article_id ? data.article : a));
      setCurrentArticleId(null); // Reset the current article ID
      setMessage(data.message); // Set success message
    } catch (err) {
      console.log(`Error: ${err.message}`);
      
      if (err.response && err.response.status === 401) {
        redirectToLogin();
      }
    }
  };

  const deleteArticle = async (article_id) => {
    let token = localStorage.getItem("token");
    
    if (!token) {
      redirectToLogin();
      return;
    }
    
    try {
      const { data } = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": token,
        },
      });
  
      
      setArticles(articles.filter(a => a.article_id !== article_id));
      setMessage(data.message); 
    } catch (err) {
      console.log(`Error: ${err.message}`);
      
      if (err.response && err.response.status === 401) {
        redirectToLogin();
      }
    }
  };
  

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <RequireAuth>
                <>
                  <ArticleForm
                    postArticle={postArticle}
                    updateArticle={updateArticle}
                    currentArticle={{title:"",text:"",topic:""}}
                    articles={articles}
                    
                    currentArticleId={currentArticleId}
                    // ... any other props ArticleForm needs
                  />
                  <Articles
                    articles={articles}
                    deleteArticle={deleteArticle}
                    setCurrentArticleId={setCurrentArticleId}
                    // ... any other props Articles needs
                    getArticles={getArticles}
                  />
                </>
              </RequireAuth>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
