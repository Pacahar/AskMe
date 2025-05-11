import { useEffect, useState } from 'react';
import { getToken } from '../../utils/auth.js';

import { API_URL } from '../../config.js';

import './SurveyResponses.css';

const SurveyResponses = ({survey_id}) => {
  const [responses, setResponses] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const responsesRes = await fetch(`${API_URL}/api/v1/surveys/${survey_id}/responses/`, { headers });
        if (!responsesRes.ok) throw new Error('Ошибка загрузки ответов');
        const responsesData = await responsesRes.json();
        setResponses(responsesData);

        const surveyRes = await fetch(`${API_URL}/api/v1/surveys/${survey_id}`, { headers });
        if (!surveyRes.ok) throw new Error('Ошибка загрузки опроса');
        const surveyData = await surveyRes.json();
        setSurvey(surveyData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [survey_id]);

  const getQuestionStats = () => {
  if (!survey) return [];
  
  return survey.questions
    .filter(q => q.type !== 'text')
    .map(question => {
      const optionsStats = {};
      
      question.options.forEach(opt => {
        optionsStats[opt.id] = {
          text: opt.text,
          count: 0,
          percentage: 0
        };
      });

      let totalRespondents = 0;
      responses.forEach(response => {
        const answer = response.answers.find(a => a.question === question.id);
        if (answer) {
          if (question.type === 'multiple') {
            if (answer.selected_options.length > 0) {
              totalRespondents++;
              answer.selected_options.forEach(optId => {
                if (optionsStats[optId]) {
                  optionsStats[optId].count++;
                }
              });
            }
          } else {
            totalRespondents++;
            answer.selected_options.forEach(optId => {
              if (optionsStats[optId]) {
                optionsStats[optId].count++;
              }
            });
          }
        }
      });

      if (totalRespondents > 0) {
        Object.keys(optionsStats).forEach(optId => {
          optionsStats[optId].percentage = Math.round(
            (optionsStats[optId].count / totalRespondents) * 100
          );
        });
      }

      return {
        questionId: question.id,
        questionText: question.text,
        questionType: question.type,
        options: Object.values(optionsStats),
        totalAnswers: totalRespondents
      };
    });
};

  if (loading) return <div className="loading">Загрузка данных...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!survey) return <div>Опрос не найден</div>;

  const questionStats = getQuestionStats();

  return (
    <div className="survey-responses-container">
      <h1>Результаты опроса: {survey.title}</h1>
      <p className="survey-description">{survey.description}</p>
      <p className="total-responses">Всего ответов: {responses.length}</p>

      <section className="stats-section">
        <h2>Статистика ответов</h2>
        
        {questionStats.length > 0 ? (
          questionStats.map(stat => (
            <div key={stat.questionId} className="question-stats">
              <h3>{stat.questionText}</h3>
              <p className="stats-summary">
                {stat.totalAnswers} ответов • {stat.questionType === 'single' ? 'Одиночный выбор' : 'Множественный выбор'}
              </p>
              
              <div className="options-stats">
                {stat.options.map(option => (
                  <div key={option.text} className="option-stat">
                    <div className="option-text">{option.text}</div>
                    <div className="stat-bar-container">
                      <div 
                        className="stat-bar" 
                        style={{ width: `${option.percentage}%` }}
                      ></div>
                      <span className="stat-count">
                        {option.count} ({option.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Нет вопросов с вариантами ответов для отображения статистики</p>
        )}
      </section>

      <section className="answers-section">
        <h2>Все ответы пользователей</h2>
        
        {responses.length > 0 ? (
          <div className="responses-list">
            {responses.map(response => (
              <div key={response.id} className="response-card">
                <div className="response-header">
                  <span className="response-id">Ответ #{response.id}</span>
                  <span className="response-date">
                    {new Date(response.submitted_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="response-answers">
                  {survey.questions.map(question => {
                    const answer = response.answers.find(a => a.question === question.id);
                    if (!answer) return null;

                    return (
                      <div key={question.id} className="answer-item">
                        <p className="question-text">{question.text}</p>
                        
                        {question.type === 'text' ? (
                          <div className="text-answer">{answer.text_answer}</div>
                        ) : (
                          <ul className="selected-options">
                            {answer.selected_options.map(optId => {
                              const option = question.options.find(o => o.id === optId);
                              return option ? (
                                <li key={optId}>{option.text}</li>
                              ) : null;
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Пока нет ответов на этот опрос</p>
        )}
      </section>
    </div>
  );
};

export default SurveyResponses;