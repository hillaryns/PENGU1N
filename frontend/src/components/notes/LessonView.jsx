import { motion } from 'framer-motion';
import CodePlayground from './CodePlayground';

export default function LessonView({ lesson, onQuizAnswer }) {
  if (!lesson) return <p>Select a lesson</p>;

  return (
    <motion.article className="lesson-view" key={lesson.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="note-title">{lesson.title}</h2>
      <span className="lesson-category-badge">{lesson.category}</span>

      {lesson.sections?.map((sec) => (
        <div key={sec.heading} className="note-section">
          <h3>{sec.heading}</h3>
          <p>{sec.body}</p>
          {sec.tip && (
            <div className="note-tip">
              <i className="fas fa-lightbulb" /> <strong>Tip:</strong> {sec.tip}
            </div>
          )}
          {sec.code && (
            <pre className="code-block syntax"><code className={sec.language || ''}>{sec.code}</code></pre>
          )}
        </div>
      ))}

      {lesson.mistake && (
        <div className="note-mistake">
          <i className="fas fa-exclamation-triangle" /> <strong>Common mistake:</strong> {lesson.mistake}
        </div>
      )}

      {lesson.exercise && (
        <div className="note-exercise">
          <strong>Mini exercise:</strong> {lesson.exercise}
        </div>
      )}

      {lesson.playground && <CodePlayground initial={lesson.playground} />}

      {lesson.quiz && (
        <div className="note-mini-quiz">
          <h4>Quick check</h4>
          <p>{lesson.quiz.question}</p>
          <motion.div className="quiz-options compact">
            {lesson.quiz.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                className="quiz-option"
                onClick={() => onQuizAnswer?.(i === lesson.quiz.correct)}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        </div>
      )}
    </motion.article>
  );
}
