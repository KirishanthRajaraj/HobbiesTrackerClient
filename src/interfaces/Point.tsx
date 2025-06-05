import type { Hobby } from "./Hobby"

export interface Point {
    id: number
    text: string
    hobbyId?: number | null
}