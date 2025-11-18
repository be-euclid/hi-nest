// Enum 대신 상수 객체 사용
export const RoomType = {
  STUDY_ROOM: 'STUDY_ROOM',
  READING_ROOM: 'READING_ROOM',
  SEMINAR_ROOM: 'SEMINAR_ROOM',
} as const;

export type RoomType = typeof RoomType[keyof typeof RoomType];

export const ReservationStatus = {
  ACTIVE: 'ACTIVE',
  TRANSFERRED: 'TRANSFERRED',
  CANCELLED: 'CANCELLED',
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];