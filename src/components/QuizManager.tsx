import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Eye, FileQuestion } from "lucide-react";

interface QuizManagerProps {
  courses: any[];
}

const QuizManager = ({ courses }: QuizManagerProps) => {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuiz, setNewQuiz] = useState({
    course_id: "",
    title: "",
    description: "",
    time_limit_minutes: 30,
    passing_score: 70,
  });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    points: 1,
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const { data } = await supabase
      .from("quizzes")
      .select("*, courses:course_id(title)")
      .order("created_at", { ascending: false });
    if (data) setQuizzes(data);
  };

  const addQuiz = async () => {
    if (!newQuiz.course_id || !newQuiz.title) return;
    const { error } = await supabase.from("quizzes").insert(newQuiz);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Quiz créé" });
      setShowAdd(false);
      setNewQuiz({ course_id: "", title: "", description: "", time_limit_minutes: 30, passing_score: 70 });
      fetchQuizzes();
    }
  };

  const deleteQuiz = async (id: string) => {
    await supabase.from("quizzes").delete().eq("id", id);
    fetchQuizzes();
    toast({ title: "Quiz supprimé" });
  };

  const fetchQuestions = async (quizId: string) => {
    const { data } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_num");
    if (data) setQuestions(data);
    setEditingQuiz(quizId);
  };

  const addQuestion = async () => {
    if (!editingQuiz || !newQuestion.question) return;
    const filteredOptions = newQuestion.options.filter((o) => o.trim());
    if (filteredOptions.length < 2) {
      toast({ variant: "destructive", title: "Erreur", description: "Au moins 2 options requises" });
      return;
    }
    const { error } = await supabase.from("quiz_questions").insert({
      quiz_id: editingQuiz,
      question: newQuestion.question,
      options: filteredOptions,
      correct_answer: newQuestion.correct_answer,
      points: newQuestion.points,
      order_num: questions.length,
    });
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      toast({ title: "Question ajoutée" });
      setNewQuestion({ question: "", options: ["", "", "", ""], correct_answer: 0, points: 1 });
      fetchQuestions(editingQuiz);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!editingQuiz) return;
    await supabase.from("quiz_questions").delete().eq("id", id);
    fetchQuestions(editingQuiz);
  };

  if (editingQuiz) {
    const quiz = quizzes.find((q) => q.id === editingQuiz);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <Button variant="ghost" size="sm" onClick={() => setEditingQuiz(null)} className="mb-2">
              ← Retour
            </Button>
            <h2 className="text-xl font-bold">{quiz?.title}</h2>
          </div>
        </div>

        {/* Existing questions */}
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-card p-4 rounded-xl border border-border">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">Q{i + 1}. {q.question}</p>
                  <div className="mt-2 space-y-1">
                    {(q.options as string[]).map((opt: string, j: number) => (
                      <p key={j} className={`text-xs px-2 py-1 rounded ${j === q.correct_answer ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}>
                        {String.fromCharCode(65 + j)}. {opt} {j === q.correct_answer && "✓"}
                      </p>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{q.points} point(s)</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteQuestion(q.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add question form */}
        <div className="bg-card p-4 rounded-xl border border-border space-y-3">
          <h4 className="font-semibold text-sm">Ajouter une question</h4>
          <div className="space-y-2">
            <Label className="text-xs">Question</Label>
            <Textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              placeholder="Entrez la question..."
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {newQuestion.options.map((opt, i) => (
              <div key={i} className="space-y-1">
                <Label className="text-xs">Option {String.fromCharCode(65 + i)}</Label>
                <Input
                  value={opt}
                  onChange={(e) => {
                    const opts = [...newQuestion.options];
                    opts[i] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: opts });
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-1">
              <Label className="text-xs">Bonne réponse</Label>
              <select
                value={newQuestion.correct_answer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: parseInt(e.target.value) })}
                className="border border-border rounded-md px-2 py-1.5 text-sm bg-background"
              >
                {newQuestion.options.map((_, i) => (
                  <option key={i} value={i}>{String.fromCharCode(65 + i)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Points</Label>
              <Input
                type="number"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 1 })}
                className="w-20 text-sm"
              />
            </div>
          </div>
          <Button size="sm" onClick={addQuestion} className="gap-1">
            <Plus className="w-3 h-3" /> Ajouter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Quiz & Évaluations</h1>
        <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
          <Plus className="w-4 h-4" /> Créer un quiz
        </Button>
      </div>

      {showAdd && (
        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cours</Label>
              <select
                value={newQuiz.course_id}
                onChange={(e) => setNewQuiz({ ...newQuiz, course_id: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="">Sélectionner un cours</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>Module {c.module_number}: {c.title}</option>
                ))}</select>
            </div>
            <div className="space-y-2">
              <Label>Titre du quiz</Label>
              <Input value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={newQuiz.description} onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Durée (min)</Label>
              <Input type="number" value={newQuiz.time_limit_minutes} onChange={(e) => setNewQuiz({ ...newQuiz, time_limit_minutes: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Score de réussite (%)</Label>
              <Input type="number" value={newQuiz.passing_score} onChange={(e) => setNewQuiz({ ...newQuiz, passing_score: parseInt(e.target.value) })} />
            </div>
          </div>
          <Button onClick={addQuiz}>Créer le quiz</Button>
        </div>
      )}

      <div className="space-y-3">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-card p-4 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-sm">{quiz.title}</h3>
              <p className="text-xs text-muted-foreground">
                {(quiz as any).courses?.title} • {quiz.time_limit_minutes}min • Score: {quiz.passing_score}%
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fetchQuestions(quiz.id)} className="gap-1 text-xs">
                <Eye className="w-3 h-3" /> Questions
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteQuiz(quiz.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileQuestion className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun quiz créé. Cliquez "Créer un quiz" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManager;
