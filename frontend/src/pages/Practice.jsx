import { useMemo, useState } from 'react';
import { practiceQuestions } from '../data/practiceQuestions';
import { showToast } from '../utils/toast';

const FILTERS = ['all', 'html', 'css', 'js', 'python'];

export default function Practice() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [answered, setAnswered] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('answered_questions') || '{}');
    } catch {
      return {};
    }
  });

  const filtered = useMemo(() => {
    return practiceQuestions.filter((q) => {
      const matchesFilter = filter === 'all' || q.subject === filter;
      const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const selectAnswer = (questionId, optionIndex, correct) => {
    if (answered[questionId] !== undefined) return;
    const isCorrect = optionIndex === correct;
    const next = { ...answered, [questionId]: isCorrect };
    setAnswered(next);
    localStorage.setItem('answered_questions', JSON.stringify(next));
    showToast(isCorrect ? 'Correct! 🎉' : 'Incorrect. Try reviewing the notes.', isCorrect ? 'success' : 'error');
  };

  return (
    <>
      <div className="dashboard-header">
        <h1 className="welcome-text">Practice Questions 🧠</h1>
        <p className="welcome-subtitle">Test your knowledge with MCQs and coding challenges</p>
      </div>

      <div className="practice-filters">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            className={`filter-btn${filter === item ? ' active' : ''}`}
            onClick={() => setFilter(item)}
          >
            {item === 'all' ? 'All' : item.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="search-container">
        <i className="fas fa-search search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div id="questionsContainer">
        {filtered.map((q, index) => (
          <div key={q.id} className="question-card" data-id={q.id} data-subject={q.subject}>
            <div className="question-header">
              <span className="question-number">Question {index + 1}</span>
              <span className={`difficulty-tag ${q.difficulty}`}>{q.difficulty}</span>
            </div>
            <p className="question-text">{q.question}</p>
            <div className="options-list">
              {q.options.map((option, optionIndex) => {
                const selected = answered[q.id];
                let className = 'option-btn';
                if (selected !== undefined) {
                  if (optionIndex === q.correct) className += ' correct';
                  else if (optionIndex === selected && selected !== q.correct) className += ' incorrect';
                }
                return (
                  <button
                    key={option}
                    type="button"
                    className={className}
                    onClick={() => selectAnswer(q.id, optionIndex, q.correct)}
                    disabled={selected !== undefined}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
