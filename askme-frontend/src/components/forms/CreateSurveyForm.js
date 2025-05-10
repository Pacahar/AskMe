import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getToken, isAuthenticated } from '../../utils/auth'
import { API_URL } from '../../config';

import './CreateSurveyForm.css';

const CreateSurveyForm = () => {
  const navigate = useNavigate();
  if (!isAuthenticated()) {
    navigate('/');
  }
  
  const [survey, setSurvey] = useState({ title: '', description: '' });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'single',
    options: ['']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const validateForm = () => {
    const newErrors = {};
    if (!survey.title.trim()) newErrors.title = 'Введите название опроса';
    if (!survey.description.trim()) newErrors.description = 'Введите описание';
    if (questions.length === 0) newErrors.questions = 'Добавьте хотя бы один вопрос';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSurveyChange = (e) => {
    setSurvey({ ...survey, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addOption = () => {
    setCurrentQuestion({ ...currentQuestion, options: [...currentQuestion.options, ''] });
  };

  const removeOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setErrors({ ...errors, currentQuestion: 'Введите текст вопроса' });
      return;
    }
    if (currentQuestion.type !== 'text' && currentQuestion.options.some(opt => !opt.trim())) {
      setErrors({ ...errors, currentQuestion: 'Заполните все варианты ответов' });
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({ text: '', type: 'single', options: [''] });
    setErrors({ ...errors, currentQuestion: '' });
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const submitSurvey = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      const surveyResponse = await fetch(API_URL + '/api/v1/surveys/', {
        method: 'POST',
        headers,
        body: JSON.stringify(survey)
      });

      if (!surveyResponse.ok) throw new Error('Ошибка создания опроса');
      const surveyData = await surveyResponse.json();

      for (const question of questions) {
        const questionResponse = await fetch(API_URL + '/api/v1/questions/', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            text: question.text,
            type: question.type,
            survey: surveyData.id
          })
        });

        if (!questionResponse.ok) throw new Error('Ошибка создания вопроса');
        const questionData = await questionResponse.json();

        if (question.type !== 'text') {
          for (const optionText of question.options) {
            if (optionText.trim()) {
              await fetch(API_URL + '/api/v1/options/', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  text: optionText,
                  question: questionData.id
                })
              });
            }
          }
        }
      }

      navigate(`/${surveyData.id}`);
    } catch (error) {
      console.error('Error:', error);
      setFormError(error.message || 'Произошла ошибка при создании опроса');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-survey-container">
      <h1>Создать новый опрос</h1>
      
      {formError && <div className="error-message">{formError}</div>}

      <div className="survey-form-section">
        <h2>Основная информация</h2>
        <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
          <label>Название опроса *</label>
          <input type="text" name="title" value={survey.title} onChange={handleSurveyChange} placeholder="Введите название опроса"/>
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
          <label>Описание *</label>
          <textarea name="description" value={survey.description} onChange={handleSurveyChange} placeholder="Опишите цель опроса" rows="4"/>
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>
      </div>

      <div className="questions-section">
        <h2>Вопросы опроса</h2>
        {errors.questions && <div className="error-message">{errors.questions}</div>}

        <div className="questions-list">
          {questions.map((q, index) => (
            <div key={index} className="question-preview">
              <div className="question-header">
                <h3>{q.text}</h3>
                <button 
                  type="button" 
                  onClick={() => removeQuestion(index)}
                  className="delete-button"
                >
                  ×
                </button>
              </div>
              <p>Тип: {{
                single: 'Одиночный выбор',
                multiple: 'Множественный выбор',
                text: 'Текстовый ответ'
              }[q.type]}</p>
              {q.type !== 'text' && (
                <ul className="options-preview">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="add-question-form">
          <h3>Добавить новый вопрос</h3>
          <div className={`form-group ${errors.currentQuestion ? 'has-error' : ''}`}>
            <label>Текст вопроса *</label>
            <input
              type="text"
              name="text"
              value={currentQuestion.text}
              onChange={handleQuestionChange}
              placeholder="Введите текст вопроса"
            />
          </div>

          <div className="form-group">
            <label>Тип вопроса *</label>
            <select
              name="type"
              value={currentQuestion.type}
              onChange={handleQuestionChange}
            >
              <option value="single">Одиночный выбор</option>
              <option value="multiple">Множественный выбор</option>
              <option value="text">Текстовый ответ</option>
            </select>
          </div>

          {currentQuestion.type !== 'text' && (
            <div className="options-form">
              <label>Варианты ответов *</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Вариант ${index + 1}`}
                  />
                  {currentQuestion.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="delete-option-button"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="add-option-button"
              >
                + Добавить вариант
              </button>
            </div>
          )}

          {errors.currentQuestion && (
            <div className="error-message">{errors.currentQuestion}</div>
          )}

          <button
            type="button"
            onClick={addQuestion}
            className="add-question-button"
          >
            Добавить вопрос
          </button>
        </div>
      </div>

      <div className="submit-section">
        <button
          type="button"
          onClick={submitSurvey}
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Сохранение...' : 'Создать опрос'}
        </button>
      </div>
    </div>
  );
};

export default CreateSurveyForm;