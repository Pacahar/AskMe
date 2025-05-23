import { Link } from 'react-router-dom';
import './Survey.css';

const Survey = ({ id, title, description, onDelete }) => {

  return (
    <div className="survey-card">
      <h2>{title}</h2>
      <p>{description}</p>

      <div className="survey-actions">
        <Link to={`/${id}`} className="btn btn-primary">
          Пройти опрос
        </Link>

        <button className="btn btn-danger" onClick={onDelete}>
          Удалить
        </button>

        <Link to={`/${id}/info`} className="btn btn-secondary">
          Посмотреть результаты
        </Link>

      </div>
    </div>
  );
};

export default Survey;