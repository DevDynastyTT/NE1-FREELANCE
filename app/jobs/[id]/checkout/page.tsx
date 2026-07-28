import CheckoutComponent from '@/components/jobs/checkout/CheckoutComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout — NE1 Freelance',
};

export default function CheckoutPage() {
  return <CheckoutComponent />;
}
