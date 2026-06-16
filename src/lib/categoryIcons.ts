import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  Camera,
  Dumbbell,
  LayoutGrid,
  Palette,
  PartyPopper,
  Scissors,
  Sofa,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  spa: Sparkles,
  scissors: Scissors,
  utensils: UtensilsCrossed,
  utensils_crossed: UtensilsCrossed,
  party_popper: PartyPopper,
  briefcase: Briefcase,
  dumbbell: Dumbbell,
  camera: Camera,
  sofa: Sofa,
  palette: Palette,
  layout_grid: LayoutGrid,
}

export function getCategoryIconComponent(iconName: string | null | undefined): LucideIcon {
  if (!iconName || typeof iconName !== "string") return LayoutGrid
  const key = iconName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
  return ICON_MAP[key] ?? LayoutGrid
}

export const CATEGORY_ICON_OPTIONS = [
  { value: "spa", label: "Spa / Beauty" },
  { value: "scissors", label: "Hair / Scissors" },
  { value: "utensils", label: "Food / Catering" },
  { value: "party_popper", label: "Events" },
  { value: "briefcase", label: "Business" },
  { value: "dumbbell", label: "Fitness" },
  { value: "camera", label: "Photography" },
  { value: "sofa", label: "Home Services" },
  { value: "palette", label: "Creative" },
  { value: "layout_grid", label: "General" },
] as const
