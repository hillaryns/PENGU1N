import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestionsForTest, getTestById } from '../data/quizzes';
import { useProgress } from '../context/ProgressContext';
import { LEADERBOARD } from '../data/leaderboard';

const PASS_PERCENT = 70;

export default function QuizPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { recordTestResult } = useProgress();
  const test = getTestById(testId);
  const questions = useMemo(() => (test ? getQuestionsForTest(testId) : []), [testId, test]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => (test?.minutes || 10) * 60);

  useEffect(() => {
    if (!test) return undefined;
    if (finished) return undefined;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [test, finished]);

  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct += 1;
    });
    return correct;
  }, [answers, questions, finished]);

  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const passed = percent >= PASS_PERCENT;

  const finishQuiz = useCallback(() => {
    if (finished) return;
    setFinished(true);
    const xpEarned = passed ? Math.round((test?.xp || 200) * (percent / 100)) : Math.round((test?.xp || 200) * 0.2);
    recordTestResult(testId, {
      score: percent,
      total: questions.length,
      passed,
      xpEarned,
    });
  }, [finished, test, percent, passed, testId, questions.length, recordTestResult]);

  useEffect(() => {
    if (secondsLeft === 0 && !finished && test) finishQuiz();
  }, [secondsLeft, finished, test, finishQuiz]);

  if (!test || !questions.length) {
    return (
      <motion.div className="quiz-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>Test not found</h2>
        <Link to="/tests" className="btn btn-primary">Back to Tests</Link>
      </motion.div>
    );
  }

  const q = questions[index];
  const progressPct = ((index + (showExplanation ? 1 : 0)) / questions.length) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const selectOption = (optIdx) => {
    if (showExplanation || finished) return;
    setSelected(optIdx);
    setAnswers((prev) => ({ ...prev, [index]: optIdx }));
    setShowExplanation(true);
  };

  const goNext = () => {
    if (index >= questions.length - 1) {
      finishQuiz();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(answers[index + 1] ?? null);
    setShowExplanation(!!answers[index + 1] || answers[index + 1] === 0);
  };

  const goPrev = () => {
    if (index <= 0) return;
    const prev = index - 1;
    setIndex(prev);
    setSelected(answers[prev] ?? null);
    setShowExplanation(true);
  };

  if (finished) {
    return (
      <motion.div
        className="quiz-result"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className={`result-banner ${passed ? 'pass' : 'fail'}`}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <span className="result-emoji">{passed ? '🎉' : '📚'}</span>
          <h1>{passed ? 'Passed!' : 'Keep Practicing'}</h1>
          <p className="result-score">{score} / {questions.length} correct ({percent}%)</p>
          <p className="result-xp">+{passed ? Math.round((test.xp || 200) * (percent / 100)) : Math.round((test.xp || 200) * 0.2)} XP</p>
          {passed && <span className="badge-earned">🏅 Badge progress updated</span>}
        </motion.div>

        <div className="result-breakdown">
          <h3>Review</h3>
          {questions.map((question, i) => {
            const userAns = answers[i];
            const ok = userAns === question.correctIndex;
            return (
              <div key={question.id} className={`result-item ${ok ? 'correct' : 'wrong'}`}>
                <p><strong>Q{i + 1}.</strong> {question.question}</p>
                <p className="result-answer">Your answer: {question.options[userAns] ?? '—'}</p>
                {!ok && <p className="result-correct">Correct: {question.options[question.correctIndex]}</p>}
                <p className="result-explain">{question.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="quiz-actions">
          <button type="button" className="btn btn-primary" onClick={() => window.location.assign(`/tests/${testId}`)}>
            Retry
          </button>
          <Link to="/tests" className="btn btn-ghost">All Tests</Link>
        </div>

        <LeaderboardSection userPercent={percent} />
      </motion.div>
    );
  }

  return (
    <motion.div className="quiz-runner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="quiz-topbar" layout>
        <Link to="/tests" className="quiz-back"><i className="fas fa-arrow-left" /> Tests</Link>
        <h2 className="quiz-title">{test.title}</h2>
        <motion.div className={`quiz-timer ${secondsLeft < 60 ? 'urgent' : ''}`}>
          <i className="fas fa-clock" /> {mins}:{secs}
        </motion.div>
      </motion.div>

      <div className="quiz-progress-wrap">
        <div className="progress-bar">
          <motion.div className="progress-fill" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className="quiz-progress-label">Question {index + 1} of {questions.length}</span>
      </div>

      <motion.div className="quiz-score-pill">
        Score:{' '}
        {Object.keys(answers).filter((k) => answers[Number(k)] === questions[Number(k)]?.correctIndex).length}
        {' '}/ {questions.length}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          className="quiz-question-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          <h3 className="quiz-question">{q.question}</h3>
          <div className="quiz-options">
            {q.options.map((opt, optIdx) => {
              let cls = 'quiz-option';
              if (showExplanation) {
                if (optIdx === q.correctIndex) cls += ' correct';
                else if (optIdx === selected && optIdx !== q.correctIndex) cls += ' wrong';
              } else if (selected === optIdx) cls += ' selected';
              return (
                <motion.button
                  key={opt}
                  type="button"
                  className={cls}
                  onClick={() => selectOption(optIdx)}
                  whileHover={!showExplanation ? { scale: 1.02 } : {}}
                  whileTap={!showExplanation ? { scale: 0.98 } : {}}
                  disabled={showExplanation}
                >
                  <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                  {opt}
                </motion.button>
              );
            })}
          </div>
          {showExplanation && (
            <motion.div className="quiz-explanation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <i className="fas fa-lightbulb" /> {q.explanation}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="quiz-nav">
        <button type="button" className="btn btn-ghost" onClick={goPrev} disabled={index === 0}>
          <i className="fas fa-chevron-left" /> Previous
        </button>
        {showExplanation ? (
          <button type="button" className="btn btn-primary" onClick={goNext}>
            {index >= questions.length - 1 ? 'Finish' : 'Next'} <i className="fas fa-chevron-right" />
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={finishQuiz}>
            Submit Early
          </button>
        )}
      </div>
    </motion.div>
  );
}

function LeaderboardSection({ userPercent }) {
  const rows = [...LEADERBOARD].sort((a, b) => b.xp - a.xp);
  return (
    <div className="leaderboard">
      <h3><i className="fas fa-trophy" /> Leaderboard</h3>
      <div className="leaderboard-list">
        {rows.map((row, i) => (
          <div key={row.name} className="leaderboard-row">
            <span className="lb-rank">#{i + 1}</span>
            <span className="lb-name">{row.name}</span>
            <span className="lb-xp">{row.xp} XP</span>
          </div>
        ))}
        <motion.div className="leaderboard-row you" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <span className="lb-rank">—</span>
          <span className="lb-name">You (this attempt)</span>
          <span className="lb-xp">{userPercent}%</span>
        </motion.div>
      </div>
    </div>
  );
}
