const MultipleChoiceQuestion = ({ question, answer, onChange }) => {
  const handleCheckboxChange = (optionId, isChecked) => {
    const newValue = isChecked
      ? [...(answer || []), optionId]
      : (answer || []).filter(id => id !== optionId);
    onChange(question.id, newValue);
  };

  return (
    <div className="question-block">
      <h3>{question.text}</h3>
      <div className="options">
        {question.options.map(option => (
          <label key={option.id}>
            <input
              type="checkbox"
              value={option.id}
              onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
              checked={(answer || []).includes(option.id)}
            />
            {option.text}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;