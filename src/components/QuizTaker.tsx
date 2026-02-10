import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";

interface QuizTakerProps {
  courseIds: string[];
}

const QuizTaker = ({ courseIds }: QuizTakerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (courseIds.length === 0) return;
    const fetchQuizzes = async () => {
      const { data } = await supabase
        .from("quizzes")
        .select("*, courses:course_id(title)")
        .in("course_id", courseIds)
        .eq("is_active", true);
      if (data) setQuizzes(data);
    };
    const fetchAttempts = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("quiz_attempts")
        .select("*, quizzes:quiz_id(title)")
        .eq("student_id", user.id)
        .order("started_at", { ascending: false });
      if (data) setAttempts(data);
    };
    fetchQuizzes();
    fetchAttempts();
  }, [courseIds, user]);

  // Timer
  useEffect(() => {
    if (!activeQuiz || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuiz, submitted, timeLeft]);

  const startQuiz = async (quiz: any) => {
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("order_num");
    if (data && data.length > 0) {
      setQuestions(data);
      setActiveQuiz(quiz);
      setCurrentQ(0);
      setAnswers({});
      setSubmitted(false);
      setResult(null);
      setTimeLeft(quiz.time_limit_minutes * 60);
    } else {
      toast({ variant: "destructive", title: "Ce quiz n'a pas encore de questions" });
    }
  };

  const submitQuiz = async () => {
    if (!user || !activeQuiz) return;
    let score = 0;
    let totalPoints = 0;
    questions.forEach((q) => {
      totalPoints += q.points;
      if (answers[q.id] === q.correct_answer) {
        score += q.points;
      }
    });
    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= activeQuiz.passing_score;

    const { error } = await supabase.from("quiz_attempts").insert({
      quiz_id: activeQuiz.id,
      student_id: user.id,
      score,
      total_points: totalPoints,
      percentage,
      passed,
      answers,
      completed_at: new Date().toISOString(),
    });

    if (!error) {
      setResult({ score, totalPoints, percentage, passed });
      setSubmitted(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Active quiz view
  if (activeQuiz && !submitted) {
    const q = questions[currentQ];
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-heading font-bold text-lg">{activeQuiz.title}</h2>
          <div className={`flex items-center gap-1 text-sm font-mono ${timeLeft < 60 ? "text-destructive" : "text-muted-foreground"}`}>
            <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex gap-1 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-8 h-8 rounded text-xs font-medium ${
                i === currentQ
                  ? "bg-primary text-primary-foreground"
                  : answers[questions[i].id] !== undefined
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <p className="font-medium">Q{currentQ + 1}. {q.question}</p>
          <div className="space-y-2">
            {(q.options as string[]).map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => setAnswers({ ...answers, [q.id]: i })}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                  answers[q.id] === i
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
            Précédent
          </Button>
          {currentQ < questions.length - 1 ? (
            <Button onClick={() => setCurrentQ(currentQ + 1)}>Suivant</Button>
          ) : (
            <Button onClick={submitQuiz} variant="default">
              Soumettre ({Object.keys(answers).length}/{questions.length})
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Result view
  if (submitted && result) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${result.passed ? "bg-primary/10" : "bg-destructive/10"}`}>
          {result.passed ? <Trophy className="w-10 h-10 text-primary" /> : <XCircle className="w-10 h-10 text-destructive" />}
        </div>
        <h2 className="font-heading text-2xl font-bold">
          {result.passed ? "Félicitations ! 🎉" : "Essayez encore"}
        </h2>
        <p className="text-4xl font-bold text-primary">{result.percentage}%</p>
        <p className="text-muted-foreground">
          {result.score}/{result.totalPoints} points • Score requis: {activeQuiz.passing_score}%
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { setActiveQuiz(null); setSubmitted(false); }}>
            Retour aux quiz
          </Button>
          {!result.passed && (
            <Button onClick={() => startQuiz(activeQuiz)}>Réessayer</Button>
          )}
        </div>
      </div>
    );
  }

  // Quiz list
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quiz & Évaluations</h1>

      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => {
            const myAttempts = attempts.filter((a) => a.quiz_id === quiz.id);
            const bestAttempt = myAttempts.length > 0
              ? myAttempts.reduce((best, a) => (a.percentage > best.percentage ? a : best), myAttempts[0])
              : null;

            return (
              <div key={quiz.id} className="bg-card p-5 rounded-xl border border-border space-y-3">
                <h3 className="font-semibold">{quiz.title}</h3>
                <p className="text-xs text-muted-foreground">{(quiz as any).courses?.title}</p>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>⏱ {quiz.time_limit_minutes} min</span>
                  <span>📊 Score requis: {quiz.passing_score}%</span>
                </div>
                {bestAttempt && (
                  <div className={`flex items-center gap-2 text-xs p-2 rounded-lg ${bestAttempt.passed ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                    {bestAttempt.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Meilleur score: {bestAttempt.percentage}% ({myAttempts.length} tentative{myAttempts.length > 1 ? "s" : ""})
                  </div>
                )}
                <Button size="sm" onClick={() => startQuiz(quiz)}>
                  {myAttempts.length > 0 ? "Réessayer" : "Commencer"}
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card p-12 rounded-xl border border-border text-center">
          <p className="text-muted-foreground">Aucun quiz disponible pour vos cours.</p>
        </div>
      )}
    </div>
  );
};

export default QuizTaker;
