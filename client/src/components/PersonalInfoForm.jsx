import React from 'react';
import { BriefcaseBusiness, Mail, MapPin, Phone, User, Globe } from 'lucide-react';

const Linked_in = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const PersonalInfoForm = ({ data, onChange, }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };


  const fields = [
    { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
    { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text" },
    { key: "linkedin", label: "LinkedIn Profile", icon: Linked_in, type: "text" },
    { key: "website", label: "Personal Website", icon: Globe, type: "text" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <div className="flex items-center gap-2">
  
</div>
      </div>

      <p className="text-sm text-gray-600">Get Started with the personal information</p>

      {/* Upload Image */}
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          {data.image ? (
            <img
              src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
              alt="user-image"
              className="w-16 h-16 rounded-full object-cover ring ring-slate-300 hover:opacity-80"
            />
          ) : (
            <div className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-700">
              <User className="size-10 p-2.5 border rounded-full" />
              <span className="text-sm">upload user image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </label>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {fields.map((field) => {
          const IconComponent = field.icon;
          return (
            <div key={field.key} className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-700 tracking-wide">
                {field.label}{field.required && <span className="text-red-500">*</span>}
              </label>
              <div className="relative flex items-center">
                <IconComponent className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                  type={field.type || "text"}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  value={data[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm;