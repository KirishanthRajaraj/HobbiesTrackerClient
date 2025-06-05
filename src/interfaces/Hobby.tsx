import type { Category } from "./Category"
import type { Point } from "./Point"

export interface Hobby {
  id: number
  name: string
  description?: string
  interestLevel?: number
  effortLevel?: number
  categories: Category[]
  pluspoints: Point[]
  minuspoints: Point[]
  //image?: string
}