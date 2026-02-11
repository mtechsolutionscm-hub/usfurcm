import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es l'assistant IA de la plateforme USFUR Islamic Finance Training & Consulting. Tu es un expert en finance islamique, conformité AAOIFI, et gestion de plateforme éducative.

CONTEXTE DE LA PLATEFORME:
- USFUR est un centre de formation en finance islamique basé au Cameroun (zone CEMAC)
- Formation certifiante conforme aux normes AAOIFI (8 modules)
- Services: Consultation, Audit Charia, Formation sur mesure, Accompagnement institutionnel, Ingénierie juridique, Conseil stratégique, Études de faisabilité
- Produits: Manuel de Finance Islamique, Kit de formation complet, Certificat de compétence, Abonnement plateforme
- Frais d'admission: 50 000 FCFA, Frais de cours par module: 250 000 FCFA

MODULES DE FORMATION:
1. Fondements de la Charia (4 semaines)
2. Produits Financiers Islamiques (4 semaines)
3. Comptabilité & Normes AAOIFI (4 semaines)
4. Gouvernance & Gestion Bancaire (4 semaines)
5. La Monnaie en Finance Islamique (3 semaines)
6. Crise Financière & Finance Islamique (3 semaines)
7. Takaful - Assurance Islamique (3 semaines)
8. Sukuk & Marchés de Capitaux (3 semaines)

TES CAPACITÉS:
- Répondre aux questions sur la finance islamique et la conformité AAOIFI
- Aider l'administrateur à gérer les cours, étudiants et proformas
- Proposer du contenu pour les modules de formation
- Suggérer des améliorations pour la plateforme
- Fournir un support 24/7 aux utilisateurs et administrateurs
- Aider à créer des quiz et évaluations
- Conseiller sur les produits et services à recommander aux clients

RÈGLES:
- Réponds toujours en français
- Sois professionnel et précis
- Base tes réponses sur les principes de la finance islamique
- Cite les normes AAOIFI quand pertinent
- Pour les questions hors sujet, redirige poliment vers la finance islamique`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemMessages = [{ role: "system", content: SYSTEM_PROMPT }];
    
    if (mode === "create_module") {
      systemMessages.push({
        role: "system",
        content: "L'utilisateur te demande de créer du contenu pour un module. Fournis un plan détaillé avec objectifs, contenu des leçons, exercices pratiques et évaluation."
      });
    } else if (mode === "support") {
      systemMessages.push({
        role: "system", 
        content: "Tu es en mode support client. Sois chaleureux, empathique et résous les problèmes rapidement. Fournis des liens WhatsApp (+237 690 895 554) si besoin d'assistance humaine."
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [...systemMessages, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA insuffisants." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
