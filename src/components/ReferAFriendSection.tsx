import React, { useState } from 'react';
import {
  Gift,
  Users,
  Copy,
  Check,
  Send,
  Sparkles,
  CreditCard,
  Landmark,
  Briefcase,
  Share2,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface SentReferral {
  id: string;
  name: string;
  email: string;
  cardProduct: string;
  sentDate: string;
  status: 'Pending' | 'Approved & Credited';
  rewardAmount: string;
}

interface ReferAFriendSectionProps {
  onApplyProduct?: (productName: string) => void;
  showToast?: (message: string) => void;
}

export const ReferAFriendSection: React.FC<ReferAFriendSectionProps> = ({
  onApplyProduct,
  showToast,
}) => {
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [recommendedProduct, setRecommendedProduct] = useState('Capital One Venture X');
  const [personalMessage, setPersonalMessage] = useState(
    "Hey! I've been using Capital One for everyday rewards and travel perks. Check it out and we'll both get a bonus when you're approved!"
  );

  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const referralCode = 'CAPITAL-VIP-7492';
  const referralUrl = `https://capitalone.com/apply?referral=${referralCode}`;

  const [sentReferrals, setSentReferrals] = useState<SentReferral[]>([
    {
      id: 'ref-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      cardProduct: 'Capital One Venture X',
      sentDate: '2 days ago',
      status: 'Approved & Credited',
      rewardAmount: '20,000 Miles ($200)',
    },
    {
      id: 'ref-2',
      name: 'Michael Chang',
      email: 'mchang88@example.com',
      cardProduct: 'Savor Cash Rewards',
      sentDate: 'Yesterday',
      status: 'Pending',
      rewardAmount: '$100 Cash Back',
    },
  ]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralUrl);
    setCopiedLink(true);
    showToast?.('Referral link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim() || !friendEmail.trim()) return;

    let reward = '$100 Cash Back';
    if (recommendedProduct.includes('Venture')) reward = '20,000 Bonus Miles';
    if (recommendedProduct.includes('360')) reward = '$50 Cash Deposit';
    if (recommendedProduct.includes('Spark')) reward = '$200 Statement Credit';

    const newReferral: SentReferral = {
      id: `ref-${Date.now()}`,
      name: friendName.trim(),
      email: friendEmail.trim(),
      cardProduct: recommendedProduct,
      sentDate: 'Just now',
      status: 'Pending',
      rewardAmount: reward,
    };

    setSentReferrals([newReferral, ...sentReferrals]);
    setSuccessNotice(`Invitation sent to ${friendName} (${friendEmail})! You'll be notified upon approval.`);
    showToast?.(`Invitation dispatched to ${friendEmail}!`);

    setFriendName('');
    setFriendEmail('');
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const tiers = [
    {
      id: 'venture',
      title: 'Venture & Venture X',
      badge: 'Most Popular',
      bonus: '20,000 Bonus Miles',
      dollarValue: 'Up to $200 Value',
      annualCap: 'Earn up to 100,000 miles/yr ($1,000 max)',
      highlight: 'Unlimited 2X miles on all purchases + premium lounge benefits.',
      icon: <Sparkles className="w-5 h-5 text-sky-400" />,
      accentColor: 'from-[#001B3A] to-[#003865]',
    },
    {
      id: 'savor',
      title: 'Savor & Quicksilver',
      badge: 'Cash Back',
      bonus: '$100 Cash Back',
      dollarValue: 'Statement Credit',
      annualCap: 'Earn up to $500 cash back/yr',
      highlight: '3% cash back on dining, entertainment, groceries & streaming.',
      icon: <CreditCard className="w-5 h-5 text-amber-400" />,
      accentColor: 'from-[#1E293B] to-[#334155]',
    },
    {
      id: 'checking',
      title: '360 Checking & Savings',
      badge: 'Zero Fees',
      bonus: '$50 Bonus Cash',
      dollarValue: 'Direct Deposit',
      annualCap: 'Earn up to $250 bonus/yr',
      highlight: 'No monthly maintenance fees, 70,000+ fee-free ATMs nationwide.',
      icon: <Landmark className="w-5 h-5 text-emerald-400" />,
      accentColor: 'from-[#064E3B] to-[#047857]',
    },
    {
      id: 'spark',
      title: 'Spark Business Cards',
      badge: 'Business Owners',
      bonus: '$200 Statement Credit',
      dollarValue: 'Per Approved Business',
      annualCap: 'Earn up to $1,000 credit/yr',
      highlight: 'Unlimited 2% cash back on every business purchase with no caps.',
      icon: <Briefcase className="w-5 h-5 text-indigo-400" />,
      accentColor: 'from-[#312E81] to-[#4338CA]',
    },
  ];

  return (
    <section id="refer-a-friend" className="py-16 px-4 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#005C9D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#005C9D]/30 border border-[#005C9D] rounded-full text-xs font-bold text-sky-300 uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-sky-400" />
            <span>Refer-a-Friend Rewards</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Share Capital One, Earn Bonus Rewards
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Invite friends, family, or colleagues to experience award-winning cards and fee-free banking.
            When they get approved using your invitation, you both receive bonus rewards.
          </p>
        </div>

        {/* Current Bonus Reward Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-5 border border-slate-700/80 bg-gradient-to-b ${tier.accentColor} shadow-lg hover:border-sky-400 transition-all flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    {tier.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-sky-200 uppercase tracking-wider">
                    {tier.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{tier.title}</h3>
                  <div className="mt-1">
                    <span className="text-lg font-black text-white block">{tier.bonus}</span>
                    <span className="text-[11px] font-mono text-sky-200">{tier.dollarValue}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {tier.highlight}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 text-[11px] font-semibold text-slate-300">
                <span>{tier.annualCap}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Referral Hub: Personalized Link & Send Email Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Left Column: Personal Link & Sharing (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1">
                Your Personal Referral Link
              </span>
              <h3 className="text-lg font-bold text-white">
                Share anywhere &mdash; social, text, or email
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Anyone who applies through this unique link gets credited to your account upon approval.
              </p>
            </div>

            {/* Referral Link Copy Bar */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between gap-2">
                <div className="truncate text-xs font-mono text-sky-300 select-all">
                  {referralUrl}
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Referral Code: <strong className="text-white font-mono">{referralCode}</strong></span>
                <button
                  type="button"
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="text-sky-400 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showQrCode ? 'Hide QR' : 'Show QR Code'}</span>
                </button>
              </div>
            </div>

            {/* QR Code Preview Box */}
            {showQrCode && (
              <div className="p-4 bg-white rounded-2xl max-w-[220px] mx-auto text-center space-y-2 text-slate-900 animate-in zoom-in-95">
                <div className="w-40 h-40 mx-auto bg-slate-100 border border-slate-300 rounded-xl flex flex-col items-center justify-center p-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <QrCode className="w-24 h-24 text-white" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 block uppercase">
                  Scan to Apply Instantly
                </span>
              </div>
            )}

            {/* Sent Referrals Status Tracker */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Recent Referrals ({sentReferrals.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sentReferrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">{ref.name}</span>
                      <span className="text-[10px] text-slate-400 block">{ref.cardProduct} &middot; {ref.sentDate}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase block mb-0.5 ${
                          ref.status === 'Approved & Credited'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {ref.status}
                      </span>
                      <span className="text-[10px] font-mono text-sky-300 font-bold">
                        {ref.rewardAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Send Email Invitation Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#005C9D]" />
                <h3 className="text-base font-bold text-white">Send Direct Email Invitation</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                We&apos;ll send an official Capital One pre-qualified invite email with your link attached.
              </p>
            </div>

            {successNotice && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{successNotice}</span>
              </div>
            )}

            <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Friend&apos;s Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Friend&apos;s Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan.miller@example.com"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Recommended Product</label>
                <select
                  value={recommendedProduct}
                  onChange={(e) => setRecommendedProduct(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#005C9D] focus:outline-none cursor-pointer"
                >
                  <option value="Capital One Venture X">Capital One Venture X Rewards (20,000 Bonus Miles)</option>
                  <option value="Capital One Venture Rewards">Capital One Venture Rewards (20,000 Bonus Miles)</option>
                  <option value="Savor Cash Rewards">Savor Cash Rewards ($100 Cash Back)</option>
                  <option value="Quicksilver Cash Rewards">Quicksilver Cash Rewards ($100 Cash Back)</option>
                  <option value="360 Checking & High Yield Savings">360 Checking &amp; Savings ($50 Bonus Deposit)</option>
                  <option value="Spark 2% Cash Plus (Business)">Spark 2% Cash Plus Business ($200 Statement Credit)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Personalized Message</label>
                <textarea
                  rows={3}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#005C9D] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No credit check required for your referral invitation</span>
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
