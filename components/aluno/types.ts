import type { Row } from "@/lib/supabase/database.types"

export type StudentWorkout = Pick<
  Row<"student_workouts">,
  "sex" | "frequency" | "goal" | "experience" | "injury_note"
>
export type Membership = Pick<Row<"memberships">, "plan" | "starts_on" | "expires_on">
export type SessionItem = Pick<
  Row<"workout_sessions">,
  "id" | "trained_on" | "day_index" | "day_focus" | "plan_sex" | "plan_frequency"
>
export type LoadEntry = { exercise: string; load_kg: number | null; trained_on: string }

export type AlunoTab = "treino" | "evolucao" | "frequencia" | "plano"
export const ALUNO_TABS: AlunoTab[] = ["treino", "evolucao", "frequencia", "plano"]
