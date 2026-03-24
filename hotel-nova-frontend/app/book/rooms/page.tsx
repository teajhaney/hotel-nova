// The available rooms step has been removed from the booking wizard.
// Users now select their room from the /rooms listing page before entering
// the wizard. Anyone who lands here (bookmarks, old links) is redirected.
import { redirect } from 'next/navigation';

export default function BookRoomsRedirect() {
  redirect('/rooms');
}
