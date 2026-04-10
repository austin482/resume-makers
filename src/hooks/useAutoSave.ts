import { useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { useResumeStore } from '../store/useResumeStore';

// ── Session ID (anonymous, stored in localStorage) ────────────────────────────
const SESSION_KEY = 'resume_session_id';

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// ── Save resume to Supabase ───────────────────────────────────────────────────
export async function saveResume(data: object): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const sessionId = getSessionId();
  const { data: existing } = await supabase
    .from('resumes')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  if (existing?.id) {
    // Update
    const { error } = await supabase
      .from('resumes')
      .update({ data, updated_at: new Date().toISOString() })
      .eq('session_id', sessionId);
    if (error) { console.error('Save error:', error); return null; }
    return existing.id;
  } else {
    // Insert
    const { data: inserted, error } = await supabase
      .from('resumes')
      .insert({ session_id: sessionId, data })
      .select('id')
      .single();
    if (error) { console.error('Save error:', error); return null; }
    return inserted?.id ?? null;
  }
}

// ── Load resume from Supabase by resume ID ────────────────────────────────────
export async function loadResumeById(id: string) {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('resumes')
    .select('data')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data.data as Record<string, unknown>;
}

// ── useAutoSave hook ──────────────────────────────────────────────────────────
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave(
  onStatusChange: (status: SaveStatus) => void,
  intervalMs = 30_000
) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveNow = useCallback(async () => {
    const state = useResumeStore.getState();
    const snapshot = {
      personalInfo: state.personalInfo,
      experiences: state.experiences,
      educations: state.educations,
      skills: state.skills,
      languages: state.languages,
      template: state.template,
    };
    onStatusChange('saving');
    const id = await saveResume(snapshot);
    if (id) {
      // Update URL with resume ID (without page reload)
      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.replaceState({}, '', url.toString());
      onStatusChange('saved');
    } else {
      onStatusChange('error');
    }
  }, [onStatusChange]);

  // Auto-save on interval
  useEffect(() => {
    timerRef.current = setInterval(saveNow, intervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [saveNow, intervalMs]);

  return { saveNow };
}
