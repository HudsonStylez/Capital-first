import React, { useState } from 'react';
import { CapitalOneLogo } from '../components/CapitalOneLogo';
import { useAdminStore } from '../store/AdminStore';
import { BottomNav } from '../components/BottomNav';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Save,
  BadgeCheck,
  CreditCard,
  FileText,
  Home,
  Copy,
  Globe,
  Building,
  Check,
  Eye,
  EyeOff,
  Briefcase,
  Calendar,
  DollarSign,
  Hash,
  Search,
  Scan,
  MonitorSmartphone,
  LogIn,
} from 'lucide-react';
import { FaceIdVerificationModal } from '../components/FaceIdVerificationModal';
import { timeAgo, formatDateTime } from '../lib/time';
import { useNow } from '../hooks/useNow';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { currentUser, updateUserProfile, changePassword, logout, updateClientAccountNumbers, systemLogs } =
    useAdminStore();

  const now = useNow();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full text-center shadow-lg">
          <CapitalOneLogo className="h-8 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Session</h2>
          <p className="text-xs text-slate-500 mb-6">
            Please sign in to view and manage your profile settings.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/signin')}
            className="px-5 py-2.5 bg-[#005C9D] text-white font-bold text-xs rounded-lg hover:bg-[#00487D] cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Profile Form State
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '(555) 234-5678');
  const [ssn, setSsn] = useState(currentUser.ssn || '');
  const [showSsn, setShowSsn] = useState(false);
  const [dob, setDob] = useState(currentUser.dob || '1990-05-15');
  const [occupation, setOccupation] = useState(currentUser.occupation || 'Software Engineer');
  const [annualIncome, setAnnualIncome] = useState(currentUser.annualIncome ? currentUser.annualIncome.toString() : '95000');
  const [street, setStreet] = useState(currentUser.address?.street || '1680 Capital One Drive');
  const [city, setCity] = useState(currentUser.address?.city || 'McLean');
  const [state, setState] = useState(currentUser.address?.state || 'VA');
  const [zip, setZip] = useState(currentUser.address?.zip || '22102');

  // Address Search & Autocomplete State
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  const PRESET_ADDRESSES = [
    { street: '1680 Capital One Drive', city: 'McLean', state: 'VA', zip: '22102' },
    { street: '15000 Capital One Drive', city: 'Richmond', state: 'VA', zip: '23238' },
    { street: '11 W 42nd Street', city: 'New York', state: 'NY', zip: '10036' },
    { street: '77 Tremont Street', city: 'Boston', state: 'MA', zip: '02108' },
    { street: '201 3rd Street', city: 'San Francisco', state: 'CA', zip: '94103' },
    { street: '100 Congress Avenue', city: 'Austin', state: 'TX', zip: '78701' },
    { street: '222 Merchandise Mart Plaza', city: 'Chicago', state: 'IL', zip: '60654' },
    { street: '1000 Wilshire Boulevard', city: 'Los Angeles', state: 'CA', zip: '90017' },
    { street: '1111 Brickell Avenue', city: 'Miami', state: 'FL', zip: '33131' },
    { street: '1201 3rd Avenue', city: 'Seattle', state: 'WA', zip: '98101' },
    { street: '1717 McKinney Avenue', city: 'Dallas', state: 'TX', zip: '75202' },
    { street: '1075 Peachtree Street NE', city: 'Atlanta', state: 'GA', zip: '30309' },
  ];

  const filteredAddresses = addressSearchQuery.trim()
    ? PRESET_ADDRESSES.filter((a) =>
        `${a.street} ${a.city} ${a.state} ${a.zip}`.toLowerCase().includes(addressSearchQuery.toLowerCase())
      )
    : [];

  // Banking Credentials State
  const [routingNumber, setRoutingNumber] = useState(
    currentUser.routingNumber || currentUser.accounts.find((a) => a.type === 'checking')?.routingNumber || '051405515'
  );
  const [swiftCode, setSwiftCode] = useState(currentUser.swiftCode || 'CAPOUS33');
  const [checkingAccountNumber, setCheckingAccountNumber] = useState(
    currentUser.accounts.find((a) => a.type === 'checking')?.accountNumber || '2304918201'
  );
  const [securityPin, setSecurityPin] = useState(currentUser.securityPin || '4921');
  const [bankingSuccessNotice, setBankingSuccessNotice] = useState<string | null>(null);

  const [profileSuccessNotice, setProfileSuccessNotice] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // Security Toggles State
  const [passkeyActive, setPasskeyActive] = useState(true);
  const [twoFactorActive, setTwoFactorActive] = useState(true);
  const [fraudAlertsActive, setFraudAlertsActive] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [isFaceIdModalOpen, setIsFaceIdModalOpen] = useState(false);
  const [faceIdToast, setFaceIdToast] = useState<string | null>(null);

  // International Travel Notice State
  const [travelCountry, setTravelCountry] = useState('United Kingdom');
  const [travelDepartureDate, setTravelDepartureDate] = useState('2026-11-20');
  const [travelReturnDate, setTravelReturnDate] = useState('2026-11-30');
  const [travelNoticeSuccess, setTravelNoticeSuccess] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 3000);
  };

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccessNotice, setPasswordSuccessNotice] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return;
    }

    updateUserProfile(currentUser.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ssn: ssn.trim(),
      dob: dob.trim(),
      occupation: occupation.trim(),
      annualIncome: parseFloat(annualIncome) || 0,
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
      },
    });

    setProfileSuccessNotice('Profile details, occupation, and contact information updated successfully.');
    setTimeout(() => setProfileSuccessNotice(null), 3500);
  };

  const handleSaveBankingDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      routingNumber: routingNumber.trim(),
      swiftCode: swiftCode.trim(),
      securityPin: securityPin.trim(),
    });

    const chk = currentUser.accounts.find((a) => a.type === 'checking');
    if (chk) {
      updateClientAccountNumbers(currentUser.id, chk.id, checkingAccountNumber.trim(), routingNumber.trim());
    }

    setBankingSuccessNotice('Official routing transit (ABA), SWIFT, and account numbers updated.');
    setTimeout(() => setBankingSuccessNotice(null), 3500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccessNotice(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const result = changePassword(currentUser.id, currentPassword, newPassword);
    if (!result.success) {
      setPasswordError(result.error || 'Failed to change password.');
      return;
    }

    setPasswordSuccessNotice('Your password has been updated securely.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between text-[#1A1A1A]">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="cursor-pointer hover:opacity-85 transition-opacity"
              title="Capital One Banking Home"
            >
              <CapitalOneLogo className="h-7 sm:h-8" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-[#005C9D] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#005C9D]" />
              <span>Home</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('/signin');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 my-2">
        {/* Profile Header Hero */}
        <div className="bg-gradient-to-r from-[#001B3A] via-[#003865] to-[#005C9D] rounded-2xl p-6 text-white shadow-md flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-inner">
            {currentUser.firstName[0]}
            {currentUser.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                  currentUser.kycStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : currentUser.kycStatus === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : 'bg-red-500/20 text-red-300 border-red-400/30'
                }`}
              >
                {currentUser.kycStatus === 'verified' ? (
                  <>
                    <BadgeCheck className="w-3 h-3 text-emerald-400" />
                    Verified
                  </>
                ) : currentUser.kycStatus === 'pending' ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    Verification Pending
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    Action Required
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-sky-100 mt-1">
              Member #{currentUser.id} &middot; SSN ending in {currentUser.ssn.slice(-4)}
            </p>
          </div>
        </div>

        {/* Profile Notifications */}
        {profileSuccessNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{profileSuccessNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Personal Information Form (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
              <UserIcon className="w-4 h-4 text-[#005C9D]" />
              <h2 className="text-base font-bold text-slate-900">Personal &amp; Contact Details</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Username & Account ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] bg-slate-50 focus:bg-white font-mono"
                    placeholder="Online Username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span>Member ID</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.id}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-mono cursor-not-allowed"
                    title="Assigned Member Reference Number"
                  />
                </div>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>
              </div>

              {/* SSN & Date of Birth */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Social Security (SSN)</span>
                    <button
                      type="button"
                      onClick={() => setShowSsn(!showSsn)}
                      className="text-[10px] text-[#005C9D] hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
                    >
                      {showSsn ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showSsn ? 'Hide' : 'Reveal'}</span>
                    </button>
                  </label>
                  <input
                    type={showSsn ? 'text' : 'password'}
                    required
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                    placeholder="9-digit SSN"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] font-mono tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] font-mono"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                    />
                  </div>
                </div>
              </div>

              {/* Occupation & Annual Income */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Occupation / Industry</span>
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Senior Software Architect"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Annual Household Income ($)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    placeholder="e.g. 95000"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Mailing Address & Search */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Residential &amp; Mailing Address</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Search verified addresses or enter custom</span>
                </div>

                {/* Quick Search Autocomplete */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={addressSearchQuery}
                    onChange={(e) => {
                      setAddressSearchQuery(e.target.value);
                      setShowAddressSuggestions(true);
                    }}
                    onFocus={() => setShowAddressSuggestions(true)}
                    placeholder="Search address (e.g. McLean, Richmond, New York, Austin)..."
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] text-slate-800"
                  />

                  {showAddressSuggestions && filteredAddresses.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {filteredAddresses.map((addr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setStreet(addr.street);
                            setCity(addr.city);
                            setState(addr.state);
                            setZip(addr.zip);
                            setShowAddressSuggestions(false);
                            setAddressSearchQuery('');
                          }}
                          className="w-full text-left p-2.5 hover:bg-sky-50 text-xs transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 block">{addr.street}</span>
                            <span className="text-[11px] text-slate-500">{addr.city}, {addr.state} {addr.zip}</span>
                          </div>
                          <span className="text-[10px] font-bold text-[#005C9D] bg-sky-100 px-2 py-0.5 rounded">
                            Select
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Detailed Address Inputs */}
                <input
                  type="text"
                  required
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                />

                <div className="grid grid-cols-6 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="col-span-3 text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="col-span-1 text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="ZIP"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="col-span-2 text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Data automatically synchronizes with active Admin records.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Security & Change Password (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-5">
                <KeyRound className="w-4 h-4 text-[#005C9D]" />
                <h2 className="text-base font-bold text-slate-900">Change Password</h2>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccessNotice && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccessNotice}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* Identity & Account Activation (KYC) Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#005C9D]" />
                  <span className="text-xs font-bold text-slate-900">Identity &amp; KYC Verification</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    currentUser.kycStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : currentUser.kycStatus === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {currentUser.kycStatus === 'verified'
                    ? 'Verified'
                    : currentUser.kycStatus === 'pending'
                    ? 'Pending Review'
                    : 'Action Required'}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {currentUser.kycStatus === 'verified'
                  ? 'All account documents verified. Outbound withdrawals and federal wires are active.'
                  : currentUser.kycStatus === 'pending'
                  ? 'Documents submitted and awaiting Admin approval in the Admin Panel.'
                  : 'Federal banking law requires verified ID and utility bill before processing withdrawals.'}
              </p>

              {(currentUser.kycDocuments || []).length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Documents On File:</span>
                  {currentUser.kycDocuments?.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 truncate mr-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{doc.fileName}</span>
                      </div>
                      <span className="text-[9px] font-bold uppercase text-slate-500">{doc.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentUser.kycStatus !== 'verified' && (
                <button
                  type="button"
                  onClick={() => onNavigate('/dashboard')}
                  className="w-full py-2 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  {currentUser.kycStatus === 'pending' ? 'View Dashboard Status' : 'Upload Identification'}
                </button>
              )}
            </div>

            {/* Virtual Cards Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-slate-900">Virtual Cards Hub</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#005C9D]">
                  {currentUser.virtualCards?.length || 0} / 3 Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Protect your account with digital token cards, custom spending limits, and instant lock.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/dashboard')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Manage Virtual Cards
              </button>
            </div>

            {/* Official Account Numbers & Routings Card - Fully Interactive */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Official Routing &amp; SWIFT</span>
                </div>
                {copiedLabel && (
                  <span className="text-[10px] font-bold text-emerald-600 animate-in fade-in">
                    Copied {copiedLabel}!
                  </span>
                )}
              </div>

              {bankingSuccessNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{bankingSuccessNotice}</span>
                </div>
              )}

              <form onSubmit={handleSaveBankingDetails} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Routing Transit Number (ABA)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(routingNumber, 'Routing Number')}
                      className="text-[10px] text-[#005C9D] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                    placeholder="9-digit ABA Routing"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>International SWIFT / BIC</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(swiftCode, 'SWIFT Code')}
                      className="text-[10px] text-[#005C9D] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                    placeholder="e.g. CAPOUS33"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Primary Checking Account Number</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(checkingAccountNumber, 'Account Number')}
                      className="text-[10px] text-[#005C9D] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    value={checkingAccountNumber}
                    onChange={(e) => setCheckingAccountNumber(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                    placeholder="Checking Account Number"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Customer ATM / Debit Security PIN</span>
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono tracking-widest focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                    placeholder="4-digit PIN"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Banking &amp; Routing Details</span>
                  </button>
                </div>
              </form>
            </div>

            {/* International Travel Notice Tool */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-slate-900">International Travel Notice</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Worldwide</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Keep your cards working seamlessly abroad with zero foreign transaction fees.
              </p>

              {travelNoticeSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{travelNoticeSuccess}</span>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={travelCountry}
                    onChange={(e) => setTravelCountry(e.target.value)}
                    placeholder="e.g. United Kingdom, Japan, France"
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Departure</label>
                    <input
                      type="date"
                      value={travelDepartureDate}
                      onChange={(e) => setTravelDepartureDate(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Return</label>
                    <input
                      type="date"
                      value={travelReturnDate}
                      onChange={(e) => setTravelReturnDate(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTravelNoticeSuccess(`Travel notice registered for ${travelCountry}. Have a wonderful trip!`);
                    setTimeout(() => setTravelNoticeSuccess(null), 4000);
                  }}
                  className="w-full py-2 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  Register Travel Notice
                </button>
              </div>
            </div>

            {/* Interactive Security & Authentication Toggles */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">Security &amp; Fraud Protections</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Dedicated Enable FaceID Toggle with Simulated Verification Flow */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        faceIdEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Scan className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 block">Enable FaceID</span>
                        {faceIdEnabled && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        3D TrueDepth biometric verification for fast &amp; secure instant login
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!faceIdEnabled) {
                        setIsFaceIdModalOpen(true);
                      } else {
                        setFaceIdEnabled(false);
                        setFaceIdToast('FaceID authentication disabled.');
                        setTimeout(() => setFaceIdToast(null), 3000);
                      }
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ml-3 ${
                      faceIdEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-xs ${
                        faceIdEnabled ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Biometric Passkey</span>
                    <span className="text-[11px] text-slate-500">Fast authentication token on trusted hardware</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasskeyActive(!passkeyActive)}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                      passkeyActive ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        passkeyActive ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">2-Factor Authentication</span>
                    <span className="text-[11px] text-slate-500">SMS code required on new devices</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorActive(!twoFactorActive)}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                      twoFactorActive ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        twoFactorActive ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">Instant Fraud Alerts</span>
                    <span className="text-[11px] text-slate-500">Real-time SMS &amp; push notification</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFraudAlertsActive(!fraudAlertsActive)}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                      fraudAlertsActive ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        fraudAlertsActive ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Logins & Security Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MonitorSmartphone className="w-4 h-4 text-[#005C9D]" />
                  <span className="text-xs font-bold text-slate-900">Recent Logins &amp; Security Activity</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {systemLogs
                  .filter(
                    (l) =>
                      l.userId === currentUser.id &&
                      ['LOGIN', 'LOGOUT', 'LOCK', 'UNLOCK', 'PASSWORD_RESET', 'PROFILE_UPDATE', 'KYC_REVIEW', 'VIRTUAL_CARD', 'SETTINGS_UPDATE'].includes(
                        l.action
                      )
                  )
                  .slice(0, 6)
                  .map((l) => (
                    <div key={l.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#005C9D] flex items-center justify-center shrink-0">
                        {l.action === 'LOGIN' ? <LogIn className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 block">{l.action.replace(/_/g, ' ')}</span>
                        <span className="text-[11px] text-slate-500 block truncate">{l.details}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0" title={formatDateTime(l.timestamp)}>
                        {timeAgo(l.timestamp, now)}
                      </span>
                    </div>
                  ))}
                {systemLogs.filter((l) => l.userId === currentUser.id).length === 0 && (
                  <p className="text-[11px] text-slate-400 py-2">No recent security activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Navigation */}
      <BottomNav
        currentTab="profile"
        onNavigate={onNavigate}
        onGoHome={() => onNavigate('/dashboard')}
        onOpenDeposit={() => onNavigate('/dashboard')}
        onOpenWithdraw={() => onNavigate('/dashboard')}
        onOpenPayBill={() => onNavigate('/dashboard')}
        onOpenTransfer={() => onNavigate('/dashboard')}
        onOpenTravel={() => onNavigate('/dashboard')}
        onOpenVirtualCards={() => onNavigate('/dashboard')}
        onOpenKyc={() => onNavigate('/dashboard')}
      />

      {/* FaceID Biometric Verification Scanner Modal */}
      <FaceIdVerificationModal
        isOpen={isFaceIdModalOpen}
        onClose={() => setIsFaceIdModalOpen(false)}
        onSuccess={() => {
          setFaceIdEnabled(true);
          setIsFaceIdModalOpen(false);
          setFaceIdToast('FaceID biometric verified & active for instant security login!');
          setTimeout(() => setFaceIdToast(null), 4000);
        }}
      />

      {/* FaceID Notification Toast */}
      {faceIdToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{faceIdToast}</span>
        </div>
      )}
    </div>
  );
};
