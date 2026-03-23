

export interface RoomData {
  id?: string;
  roomNumber: number;
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
  onSave: () => void;
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


export interface PromoData {
  code: string;
  description: string;
  discount: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  usageLimit: number;
  used: number;
  validFrom: string;
  validTo: string;
  status: string;
}

export interface PromoFormModalProps {
  promo?: PromoData | null;
  onClose: () => void;
  onSave: (data: PromoData) => void;
}
