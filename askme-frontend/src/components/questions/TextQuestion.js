const TextQuestion = ({ question, answer, onChange }) => {
  return (
    <div className="question-block">
      <h3>{question.text}</h3>
      <textarea
        value={answer || ''}
        onChange={(e) => onChange(question.id, e.target.value)}
        placeholder="Введите ваш ответ..."
      />
    </div>
  );
};

export default TextQuestion;