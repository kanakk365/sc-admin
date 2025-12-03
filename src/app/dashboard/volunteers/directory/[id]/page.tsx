'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Download, FileText, Loader2 } from 'lucide-react';
import { useVolunteerStore } from '@/store/volunteerStore';
import Image from 'next/image';

export default function VolunteerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedVolunteer, isLoading, fetchVolunteerDetails, updateVolunteerStatus } = useVolunteerStore();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchVolunteerDetails(id);
    }
  }, [id, fetchVolunteerDetails]);

  if (isLoading || !selectedVolunteer) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleAction = async (status: 'FROZEN' | 'SUSPENDED') => {
    await updateVolunteerStatus(id, status);
    // Refresh details
    fetchVolunteerDetails(id);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={handleBack}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Details</h1>
      </div>

      {/* Profile Info Card */}
      <div className="bg-gray-50 rounded-xl ">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Info:</h2>
        
        <div className="flex items-start gap-8 bg-[#f7f5f9] p-4 rounded-xl">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shrink-0 border-4 border-white shadow-sm">
            {selectedVolunteer.profileImageUrl ? (
              <Image 
                src={selectedVolunteer.profileImageUrl} 
                alt={selectedVolunteer.fullName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-3xl font-bold">
                {selectedVolunteer.fullName.charAt(0)}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-3 gap-x-12 gap-y-6">
            <div>
              <p className="text-sm text-gray-900 font-medium">
                <span className="font-bold">Name-</span> {selectedVolunteer.fullName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">
                <span className="font-bold">Phone number-</span> {selectedVolunteer.phoneNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">
                <span className="font-bold">State -</span>{selectedVolunteer.state}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">
                <span className="font-bold">Role-</span>{selectedVolunteer.role}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">
                <span className="font-bold">E mail ID-</span>{selectedVolunteer.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">
                <span className="font-bold">Division-</span>{selectedVolunteer.division}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium">
                <span className="font-bold">SC ID-</span> {selectedVolunteer.registrationCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Documents:</h2>
        <div className="bg-[#f7f5f9] p-4 rounded-xl">
          {selectedVolunteer.governmentIdUrl ? (
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <span className="font-medium text-gray-900">
                  {selectedVolunteer.governmentIdType || 'Government ID'}.PDF
                </span>
              </div>
              <a 
                href={selectedVolunteer.governmentIdUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Download className="w-5 h-5 text-gray-500" />
              </a>
            </div>
          ) : (
            <p className="text-gray-500 italic">No documents uploaded.</p>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Address:</h2>
        <div className="bg-[#f7f5f9] p-4 rounded-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p className="text-sm text-gray-900 font-medium">
              <span className="font-bold">Address line 1-</span> {selectedVolunteer.addressLine1}
            </p>
            <p className="text-sm text-gray-900 font-medium">
              <span className="font-bold">Address line 2 -</span>{selectedVolunteer.addressLine2}
            </p>
          </div>
          <div className="flex gap-12">
            <p className="text-sm text-gray-900 font-medium">
              <span className="font-bold">City-</span>{selectedVolunteer.city}
            </p>
            <p className="text-sm text-gray-900 font-medium">
              <span className="font-bold">State-</span>{selectedVolunteer.state}
            </p>
            <p className="text-sm text-gray-900 font-medium">
              <span className="font-bold">Pincode-</span>{selectedVolunteer.postalCode}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button 
          onClick={() => handleAction('FROZEN')}
          className="px-8 py-2.5 bg-[#F79009] text-white font-medium rounded-lg hover:bg-[#DC6803] transition-colors shadow-sm"
        >
          Freeze
        </button>
        <button 
          onClick={() => handleAction('SUSPENDED')}
          className="px-8 py-2.5 bg-[#D92D20] text-white font-medium rounded-lg hover:bg-[#B42318] transition-colors shadow-sm"
        >
          Suspend
        </button>
      </div>
    </div>
  );
}

