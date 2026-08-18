import { redirect } from 'next/navigation';

export default function PrivacyRedirect() {
  redirect('/admin/cms/pages/editor?slug=privacy-policy');
}
