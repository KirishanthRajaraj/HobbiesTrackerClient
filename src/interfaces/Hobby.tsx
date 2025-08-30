import type { Category } from "./Category"
import type { DaysOfWeek } from "./DaysOfWeek"
import type { Point } from "./Point"
import type { PointsInterval } from "./PointsInterval"

export interface Hobby {
  id: number
  name: string
  description?: string
  interestLevel?: number
  effortLevel?: number
  categories: Category[]
  pluspoints: Point[]
  minuspoints: Point[]
  pointIntervalType: PointsInterval
  intervalDaysOfWeek: DaysOfWeek[]
  intervalDaysOfMonth: number[]
  pointsCurrent: number
  pointsValued: number
  //image?: string
}