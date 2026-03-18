

export interface RoomData {
  id: string;
  name: string;
  type: string;
  price: number;
  status: string;
  image: string;
  description?: string;
}

export interface RoomFormModalProps {
  room?: RoomData | null;
  onClose: () => void;
  onSave: (data: RoomData) => void;
}

export interface CalendarMonthProps {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  hoverDate: Date | null;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
  minDate: Date;
}


export interface DateRangePickerProps {
  checkIn: string | null;
  checkOut: string | null;
  onChange: (checkIn: string | null, checkOut: string | null) => void;
}


export interface GuestRoomCounterProps {
  adults: number;
  childCount: number;
  rooms: number;
  onAdultsChange: (v: number) => void;
  onChildrenChange: (v: number) => void;
  onRoomsChange: (v: number) => void;
  showRooms?: boolean;
}
