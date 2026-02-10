import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Hand, Users, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";

interface LiveRoomProps {
  courseId: string;
  courseTitle: string;
  roomId: string;
  isTeacher?: boolean;
  onLeave: () => void;
}

const LiveRoom = ({ courseId, courseTitle, roomId, isTeacher = false, onLeave }: LiveRoomProps) => {
  const { user } = useAuth();
  const [micOn, setMicOn] = useState(isTeacher);
  const [camOn, setCamOn] = useState(isTeacher);
  const [sharing, setSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [participants] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch chat messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("live_messages")
        .select("*, profiles:user_id(full_name)")
        .eq("course_id", courseId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (data) setMessages(data);
    };
    fetchMessages();

    const channel = supabase
      .channel(`live-room-${courseId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "live_messages",
        filter: `course_id=eq.${courseId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [courseId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Camera access
  useEffect(() => {
    if (camOn && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: micOn })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => setCamOn(false));
    } else if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }, [camOn]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !user) return;
    await supabase.from("live_messages").insert({
      course_id: courseId,
      user_id: user.id,
      content: newMsg,
      message_type: handRaised ? "question" : "chat",
    });
    setNewMsg("");
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-background">
      {/* Video area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <h2 className="font-heading font-semibold text-sm truncate">{courseTitle}</h2>
          <span className="text-xs text-muted-foreground ml-auto">Room: {roomId.slice(0, 8)}</span>
        </div>

        <div className="flex-1 bg-foreground/95 relative flex items-center justify-center">
          {camOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
                <VideoOff className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground/70 text-sm">
                {isTeacher ? "Activez votre caméra" : "En attente du flux vidéo..."}
              </p>
            </div>
          )}

          {/* Participant count overlay */}
          <div className="absolute top-3 right-3 bg-foreground/60 text-background text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{participants.length + 1}</span>
          </div>
        </div>

        {/* Controls bar */}
        <div className="flex items-center justify-center gap-2 p-3 bg-card border-t border-border flex-wrap">
          <Button
            variant={micOn ? "outline" : "destructive"}
            size="sm"
            onClick={() => setMicOn(!micOn)}
            className="gap-1.5"
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{micOn ? "Micro" : "Muet"}</span>
          </Button>

          <Button
            variant={camOn ? "outline" : "destructive"}
            size="sm"
            onClick={() => setCamOn(!camOn)}
            className="gap-1.5"
          >
            {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{camOn ? "Caméra" : "Off"}</span>
          </Button>

          {isTeacher && (
            <Button
              variant={sharing ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSharing(!sharing)}
              className="gap-1.5"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Partager</span>
            </Button>
          )}

          {!isTeacher && (
            <Button
              variant={handRaised ? "secondary" : "outline"}
              size="sm"
              onClick={() => setHandRaised(!handRaised)}
              className="gap-1.5"
            >
              <Hand className="w-4 h-4" />
              <span className="hidden sm:inline">{handRaised ? "Main levée" : "Lever la main"}</span>
            </Button>
          )}

          <Button
            variant={showChat ? "secondary" : "outline"}
            size="sm"
            onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
            className="gap-1.5 lg:hidden"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>

          <Button
            variant={showParticipants ? "secondary" : "outline"}
            size="sm"
            onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
            className="gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Participants</span>
          </Button>

          <Button variant="destructive" size="sm" onClick={onLeave} className="gap-1.5">
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Quitter</span>
          </Button>
        </div>
      </div>

      {/* Sidebar: chat or participants */}
      <div className={`${showChat || showParticipants ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card`}>
        {showParticipants ? (
          <div className="flex-1 p-4">
            <h4 className="font-semibold text-sm mb-3">Participants</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{isTeacher ? "Vous (Enseignant)" : "Enseignant"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>{!isTeacher ? "Vous" : "Étudiant"}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-border">
              <h4 className="text-sm font-semibold">💬 Chat en Direct</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
              {messages.map((m) => (
                <div key={m.id} className={`text-sm ${m.message_type === "question" ? "bg-accent/10 p-2 rounded-lg border border-accent/20" : ""}`}>
                  {m.message_type === "question" && <span className="text-[10px] text-accent font-medium">✋ Question</span>}
                  <div>
                    <span className="font-medium text-primary text-xs">
                      {(m as any).profiles?.full_name || "Anonyme"}:
                    </span>{" "}
                    <span className="text-foreground text-xs">{m.content}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2 p-3 border-t border-border">
              <Input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder={handRaised ? "Poser votre question..." : "Message..."}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={sendMessage}>
                Envoyer
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveRoom;
