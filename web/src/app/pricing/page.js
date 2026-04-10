'use client';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FiCheckCircle } from 'react-icons/fi';

const PACKAGES = [
  { id: 'free', name: 'Free Listing', price: '₹0 / mo', features: ['Basic Profile', 'Photo Gallery', 'Customer Reviews'] },
  { id: 'silver', name: 'Silver Package', price: '₹499 / mo', features: ['Verified Badge', 'Top 5 in Search', 'Lead Generation'] },
  { id: 'gold', name: 'Gold Package', price: '₹999 / mo', features: ['Gold Badge', 'Top 3 in Search', 'Premium Support', 'Analytics Dashboard'] },
  { id: 'diamond', name: 'Diamond Partner', price: '₹1499 / mo', features: ['Diamond Badge', '#1 in Search', 'Dedicated Account Manager', 'No Ads on Profile'] },
];

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">Pricing Plans</h1>
        <p className="section-description mt-2">Supercharge your business with premium local listings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PACKAGES.map((pkg) => {
          const isDiamond = pkg.id === 'diamond';
          return (
            <article
              key={pkg.id}
              className={`rounded-2xl border p-6 shadow-sm ${isDiamond ? 'bg-primary text-white border-primary' : 'bg-white border-slate-100'}`}
            >
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-black/10">
                <h2 className={`text-xl font-black ${isDiamond ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h2>
                <p className={`font-black ${isDiamond ? 'text-white' : 'text-slate-700'}`}>{pkg.price}</p>
              </div>

              <div className="space-y-3 mb-6">
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <FiCheckCircle className={isDiamond ? 'text-white' : 'text-emerald-500'} />
                    <p className={`text-sm ${isDiamond ? 'text-white/95' : 'text-slate-600'}`}>{feature}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => (isAuthenticated ? router.push('/support') : router.push('/login'))}
                className={`w-full rounded-xl py-3 text-sm font-bold ${isDiamond ? 'bg-white text-primary' : 'bg-slate-100 text-slate-800'}`}
              >
                Choose Plan
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
