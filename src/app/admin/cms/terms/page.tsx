import { redirect } from 'next/navigation';

export default function TermsRedirect() {
  redirect('/admin/cms/pages/editor?slug=terms-and-conditions');
}
