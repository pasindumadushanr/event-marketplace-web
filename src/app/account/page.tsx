import { redirect } from 'next/navigation';

export default function AccountIndexPage() {
  // Customers should be instantly redirected to their bookings page when clicking "Account"
  redirect('/account/bookings');
}
