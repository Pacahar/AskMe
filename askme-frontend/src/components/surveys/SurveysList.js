import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { API_URL } from '../../config';
import { getToken, refreshAccessToken } from '../../utils/auth';
import Survey from './Survey';

import './SurveysList.css';

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/v1/surveys/${id}/`, {
      method: 'DELETE',
    });
    fetchSurveys(currentPage); 
  };

  const fetchSurveys = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      let response = await fetch(`${API_URL}/api/v1/surveys/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.status === 401) {
        await refreshAccessToken();
        response = await fetch(`${API_URL}/api/v1/surveys/?page=${page}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSurveys(data.results);
      setTotalPages(Math.ceil(data.count / 15));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurveys(currentPage);
  }, [currentPage, fetchSurveys]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (loading) return <div>Загрузка опросов...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

  return (
    <div className="survey-list">
      <h1>Ваши опросы</h1>
      <Link to="/create" className="create">
        <div className="plus-icon">+</div>
        <h3>Создать новый опрос</h3>
      </Link>
      <div className="surveys-container">
        {surveys.map(survey => (
          <Survey 
            key={survey.id} 
            id={survey.id} 
            title={survey.title} 
            description={survey.description}
            onDelete={() => handleDelete(survey.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (<div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Назад</button>
        
        <span>Страница {currentPage} из {totalPages}</span>
        
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Вперед</button>
      </div>)}
    </div>
  );
};

export default SurveyList;