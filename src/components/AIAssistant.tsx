import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, BookOpen, HelpCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

const QUICK_ACTIONS = [
  { label: "Créer un module", icon: BookOpen, prompt: "Aide-moi à créer le contenu d'un nouveau module de formation en finance islamique.", mode: "create_module" },
  { label: "Suggestions", icon: Sparkles, prompt: "Quelles améliorations proposes-tu pour la plateforme USFUR ?", mode: "admin" },
  { label: "Support", icon: HelpCircle, prompt: "J'ai besoin d'aide avec la plateforme.", mode: "support" },
];

interface AIAssistantProps {
  isAdmin?: boolean;
}

const AIAssistant = ({ isAdmin = false }: AIAssistantProps) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<string>("admin");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Msg[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages, mode }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Erreur réseau" }));
      throw new Error(err.error || `Erreur ${resp.status}`);
    }
    if (!resp.body) throw new Error("No stream");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantSoFar = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
              }
              return [...prev, { role: "assistant", content: assistantSoFar }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMsg: Msg = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat([...messages, userMsg]);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erreur IA", description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
      >
        <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 bg-card border border-border rounded-xl shadow-2xl flex flex-col transition-all ${
      expanded ? "inset-4" : "bottom-6 right-6 w-[380px] h-[520px] max-h-[80vh]"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Assistant USFUR IA</h3>
            <p className="text-[10px] text-muted-foreground">
              {isAdmin ? "Mode Administrateur" : "Support 24/7"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setExpanded(!expanded)}>
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setOpen(false)}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-4 pt-4">
            <div className="text-center">
              <Bot className="w-10 h-10 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Bienvenue 👋</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isAdmin
                  ? "Je peux vous aider à gérer la plateforme, créer des modules, et plus encore."
                  : "Comment puis-je vous aider ?"}
              </p>
            </div>
            {isAdmin && (
              <div className="space-y-2">
                {QUICK_ACTIONS.map(a => (
                  <button
                    key={a.label}
                    onClick={() => { setMode(a.mode); send(a.prompt); }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-lg border border-border hover:bg-accent/30 text-left text-sm transition-colors"
                  >
                    <a.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-muted px-3 py-2 rounded-xl rounded-bl-sm">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Posez votre question..."
            className="min-h-[40px] max-h-[100px] text-sm resize-none"
            rows={1}
          />
          <Button size="sm" onClick={() => send()} disabled={isLoading || !input.trim()} className="h-10 w-10 p-0 flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
