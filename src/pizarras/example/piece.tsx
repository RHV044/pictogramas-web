import type { FC } from 'react'

import { Knight } from './knight'

export interface PieceProps {
  isKnight: boolean
}

export const Piece: FC<PieceProps> = ({ isKnight }) =>
  isKnight ? <Knight /> : null
