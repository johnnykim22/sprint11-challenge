import React, { useEffect, useState } from "react";
import PT from "prop-types";


const initialFormValues = { title: "", text: "", topic: "" };

export default function ArticleForm({
  postArticle,
  updateArticle,
  setCurrentArticleId,
  currentArticle,
  currentArticleId,
  articles,
}) {
  const [values, setValues] = useState(initialFormValues);

  useEffect(() => {
   

    if (currentArticleId) {
      console.log(articles);
      console.log(currentArticleId);
      const { title, text, topic } = articles.find(
        (item) => item.article_id == currentArticleId
      );
      setValues({ title, text, topic });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticleId]);

  const onChange = (evt) => {
    const { id, value } = evt.target;

    setValues({ ...values, [id]: value });
  }

  const onSubmit = (evt) => {
    evt.preventDefault();
    if (currentArticleId) {
      updateArticle({ article_id: currentArticleId, article: values });
      console.log("update");
      console.log(currentArticle);
      console.log(currentArticleId);
    } else {
     
      postArticle(values);
    }
  };

  const onCancel = () => {
    setValues(initialFormValues);
    setCurrentArticleId(null);
  };

  const isDisabled = () => {
    return !(values.title && values.text && values.topic);
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit" : "Create"} Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">
          Submit
        </button>
        <button type="button" onClick={onCancel}>
          Cancel edit
        </button>
      </div>
    </form>
  );
}

ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    article_id: PT.number,
    title: PT.string,
    text: PT.string,
    topic: PT.string,
  }),
};
