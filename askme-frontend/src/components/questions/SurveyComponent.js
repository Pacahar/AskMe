import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { API_URL } from '../../config';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TextQuestion from './TextQuestion';
import { getToken } from '../../utils/auth';

import './SurveyComponent.css'

const SurveyComponent = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(API_URL + `/api/v1/surveys/${id}`);
        console.log(response);
        if (!response.ok) throw new Error('Ошибка загрузки опроса');
        const data = await response.json();
        setSurvey(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurvey();
  }, [id]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formattedAnswers = survey.questions.map((question) => {
    const userAnswer = answers[question.id];

    if (question.type === 'text') {
      return {
        question: question.id,
        text_answer: userAnswer || ''
      };
    }

    const selected = Array.isArray(userAnswer)
      ? userAnswer.map(Number)
      : [Number(userAnswer)];

    return {
      question: question.id,
      selected_options: selected
    };
  });

  try {
    const response = await fetch(API_URL + `/api/v1/responses/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        survey: Number(id),
        answers: formattedAnswers
      })
    });

    if (!response.ok) throw new Error('Ошибка при отправке ответов');

    alert('Ответы успешно отправлены!');
  } catch (err) {
    console.error(err);
    alert('Ошибка при отправке: ' + err.message);
  }
};


  if (loading) return <div>Загрузка опроса...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!survey) return <div>Опрос не найден</div>;

  const renderQuestion = (question) => {
    switch(question.type) {
      case 'single':
        return <SingleChoiceQuestion key={question.id} question={question} answer={answers[question.id]} onChange={handleAnswerChange} />;
      case 'multiple':
        return <MultipleChoiceQuestion key={question.id} question={question} answer={answers[question.id]} onChange={handleAnswerChange} />;
      case 'text':
        return <TextQuestion key={question.id} question={question} answer={answers[question.id]} onChange={handleAnswerChange}/>;
      default:
        return null;
    }
  };

  return (
    <div className="survey-container">
      <h1>{survey.title}</h1>
      <p>{survey.description}</p>
      
      <form className="survey-form" onSubmit={handleSubmit}>
        {survey.questions.map(renderQuestion)}
        <button type="submit">Отправить ответы</button>
      </form>
    </div>
  );
};

export default SurveyComponent;