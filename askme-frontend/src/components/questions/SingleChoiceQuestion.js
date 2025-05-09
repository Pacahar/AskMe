const SingleChoiceQuestion = ({ question, answer, onChange }) => {
  return (
    <div className="question-block">
      <h3>{question.text}</h3>
      <div className="options">
        {question.options.map(option => (
          <label key={option.id}>
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              onChange={() => onChange(question.id, option.id)}
              checked={answer === option.id}
            />
            {option.text}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SingleChoiceQuestion;