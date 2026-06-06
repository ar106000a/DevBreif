import { useState, useEffect } from "react";
import axios from "axios";
import api from "../lib/api";
import type { Brief } from "../pages/App";

export const useBriefs = () => {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loadingBriefs, setLoadingBriefs] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBriefs = async () => {
      setLoadingBriefs(true);
      try {
        const res = await api.get("/app/brief/list");
        if (isMounted) setBriefs(res.data?.briefs ?? []);
      } catch (err) {
        console.error("Error fetching briefs:", err);
        if (isMounted) setBriefs([]);
      } finally {
        if (isMounted) setLoadingBriefs(false);
      }
    };
    fetchBriefs();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveBrief = async (brief: Brief): Promise<Brief> => {
    try {
      const res = await api.post("/app/brief/save", {
  title: brief.title,
  idea: brief.idea,
  description: brief.description,
  features: brief.features,
  stack: brief.stack,
  timeline: brief.timeline,
  cost: brief.cost,
  team: brief.team,
  questions: brief.questions,
  risks: brief.risks,
  chat_history: brief.chat_history ?? [],
  project_type: brief.project_type,
});
      const saved = { ...brief, id: res.data.brief.id };
      setBriefs((prev) => [saved, ...prev]);
      return saved;
    } catch (error: unknown) {
      let errorDetails: unknown = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDetails = error.response?.data || error.message;
      } else if (error instanceof Error) {
        errorDetails = error.message;
      }
      console.log("Brief not saved in db", errorDetails);
      setBriefs((prev) => [brief, ...prev]);
      return brief;
    }
  };

  const deleteBrief = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/brief/${id}`);
      setBriefs((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch {
      console.error("Failed to delete brief");
      return false;
    }
  };

  const toggleShare = async (id: string) => {
    const current = briefs.find((b) => b.id === id);
    const optimistic = !current?.is_public;

    const applyState = (state: boolean) => {
      setBriefs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_public: state } : b)),
      );
    };

    applyState(optimistic);
    try {
      const res = await api.patch(`/app/brief/${id}/toggle-share`);
      applyState(res.data.is_public);
      return res.data.is_public;
    } catch (err) {
      applyState(!optimistic);
      console.error("Failed to toggle share", err);
      return !optimistic;
    }
  };

  const updateExplanation = (id: string, explanation: string) => {
    setBriefs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, explanation } : b)),
    );
  };

  return {
    briefs,
    loadingBriefs,
    saveBrief,
    deleteBrief,
    toggleShare,
    updateExplanation,
  };
};
