'use client';

import { useState } from 'react';
import { MapPin, Upload, X } from 'lucide-react';

type Tab = 'Hotel Info' | 'Policies' | 'Contact Details' | 'Tax & Fees';

const TABS: Tab[] = ['Hotel Info', 'Policies', 'Contact Details', 'Tax & Fees'];

const PHOTO_THUMBS = [
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=140&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&h=140&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=140&fit=crop&auto=format',
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Hotel Info');

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[24px] font-bold text-[#0D0F2B]">The Grand Oasis Abuja</h1>
        <p className="text-[14px] text-[#64748B] mt-1">Manage hotel information, policies and settings</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-[#020887] text-[#020887]'
                : 'border-transparent text-[#64748B] hover:text-[#0D0F2B]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Hotel Info' && (
        <div className="flex flex-col gap-5">
          {/* General Information */}
          <div className="admin-card p-6">
            <h2 className="text-[15px] font-semibold text-[#0D0F2B] mb-5">General Information</h2>
            <div className="flex flex-col gap-5">
              <div className="form-field">
                <label className="field-label">Hotel Name</label>
                <input
                  type="text"
                  defaultValue="The Grand Oasis Abuja"
                  className="field-input field-input-valid"
                />
              </div>
              <div className="form-field">
                <label className="field-label">Brand Affiliation</label>
                <select className="field-input field-input-valid appearance-none cursor-pointer">
                  <option>Independent</option>
                  <option>Marriott</option>
                  <option>Hilton</option>
                  <option>Radisson</option>
                  <option>Sheraton</option>
                </select>
              </div>
              <div className="form-field">
                <label className="field-label">Short Description</label>
                <textarea
                  rows={3}
                  defaultValue="The Grand Oasis Abuja is a luxury five-star property nestled in the heart of Nigeria's capital, offering world-class hospitality and unparalleled comfort."
                  className="field-input field-input-valid resize-none py-3"
                />
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div className="admin-card p-6">
            <h2 className="text-[15px] font-semibold text-[#0D0F2B] mb-5">Location & Address</h2>
            <div className="flex flex-col gap-5">
              <div className="form-field">
                <label className="field-label">Street Address</label>
                <input
                  type="text"
                  defaultValue="Plot 1234 Maitama District, Central Business District"
                  className="field-input field-input-valid"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="form-field">
                  <label className="field-label">City</label>
                  <input type="text" defaultValue="Abuja" className="field-input field-input-valid" />
                </div>
                <div className="form-field">
                  <label className="field-label">State / Region</label>
                  <input type="text" defaultValue="Federal Capital Territory" className="field-input field-input-valid" />
                </div>
              </div>

              {/* Map placeholder */}
              <div>
                <p className="field-label mb-2">Map Location</p>
                <div className="h-48 rounded-lg bg-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#020887] flex items-center justify-center mx-auto mb-2">
                      <MapPin size={20} color="white" />
                    </div>
                    <p className="text-[13px] font-medium text-[#064E3B]">The Grand Oasis Abuja</p>
                    <p className="text-[11px] text-[#065F46] mt-0.5">Maitama, Abuja</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EEF0FF] text-[12px] font-medium text-[#020887]">
                    <MapPin size={12} />
                    9.0765° N, 7.3986° E
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="admin-card p-6">
            <h2 className="text-[15px] font-semibold text-[#0D0F2B] mb-5">Photo Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Upload box */}
              <div className="h-32 rounded-lg border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#020887] hover:bg-[#F8FAFC] transition-colors">
                <Upload size={20} className="text-[#94A3B8]" />
                <p className="text-[12px] text-[#64748B] text-center leading-tight">Upload New</p>
              </div>
              {/* Thumbnails */}
              {PHOTO_THUMBS.map((src, i) => (
                <div key={i} className="relative h-32 rounded-lg overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Hotel photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X size={12} color="white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'Hotel Info' && (
        <div className="admin-card p-10 flex items-center justify-center">
          <p className="text-[14px] text-[#94A3B8]">{activeTab} settings coming soon.</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end gap-4 mt-7 pt-5 border-t border-[#E2E8F0]">
        <button className="text-[13px] font-medium text-[#64748B] hover:text-[#0D0F2B] transition-colors">
          Discard Changes
        </button>
        <button className="flex items-center gap-1.5 h-10 px-5 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors">
          Save All Settings
        </button>
      </div>
    </div>
  );
}
