import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFormData } from "../hooks/useFormData";
import { medicationCategories } from "../data/medications";
import { CategoryAccordion } from "../components/CategoryAccordion";
import type { CategoryData } from "../types/form";
import { generatePDF } from "../utils/pdfGenerator";
import { sendEmail } from "../utils/emailService";

export function Form() {
  const { user, getPharmacyName, getPharmacyDetails, signOut, loading: authLoading } = useAuth();
  const { formData, updateFormData, clearFormData } = useFormData();
  const navigate = useNavigate();
  
  // Validation errors state
  const [errors, setErrors] = useState({
    patientFirstName: '',
    patientLastName: '',
    primaryCarePhysician: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const pharmacyName = getPharmacyName();
    if (pharmacyName && !formData.pharmacy) {
      updateFormData({ pharmacy: pharmacyName });
    }
  }, [getPharmacyName, formData.pharmacy, updateFormData]);

  const handleCategoryUpdate = (categoryId: string, data: CategoryData) => {
    updateFormData({
      categories: {
        ...formData.categories,
        [categoryId]: data,
      },
    });
  };

  const handleNameChange = (field: 'patientFirstName' | 'patientLastName' | 'primaryCarePhysician', value: string) => {
    // Only allow alphabetical characters and spaces
    const cleaned = value.replace(/[^a-zA-Z\s]/g, '');
    updateFormData({ [field]: cleaned });
    
    // Validate and show error if needed
    if (value !== cleaned && value.length > 0) {
      setErrors(prev => ({ ...prev, [field]: 'Only alphabetical characters are allowed' }));
    } else if (cleaned.length > 0 && /^[A-Za-z\s]+$/.test(cleaned)) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateName = (field: 'patientFirstName' | 'patientLastName' | 'primaryCarePhysician', value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [field]: 'This field is required' }));
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      setErrors(prev => ({ ...prev, [field]: 'Only alphabetical characters are allowed' }));
      return false;
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
    return true;
  };

  const handleDateChange = (value: string) => {
    updateFormData({ dateOfBirth: value });
    
    // Validate date
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        setErrors(prev => ({ ...prev, dateOfBirth: 'Date of birth cannot be in the future' }));
      } else {
        setErrors(prev => ({ ...prev, dateOfBirth: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  // Get today's date in YYYY-MM-DD format for max attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    // Validate all fields
    const isFirstNameValid = validateName('patientFirstName', formData.patientFirstName);
    const isLastNameValid = validateName('patientLastName', formData.patientLastName);
    const isPhysicianValid = validateName('primaryCarePhysician', formData.primaryCarePhysician);
    
    // Check if date is in future
    if (formData.dateOfBirth) {
      const selectedDate = new Date(formData.dateOfBirth);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        setErrors(prev => ({ ...prev, dateOfBirth: 'Date of birth cannot be in the future' }));
        alert("Please fix the validation errors before submitting.");
        return;
      }
    }
    
    // Validate form
    if (
      !formData.pharmacy ||
      !formData.patientFirstName ||
      !formData.patientLastName ||
      !formData.dateOfBirth ||
      !formData.primaryCarePhysician ||
      !formData.pdfType
    ) {
      alert("Please fill in all required fields and select a PDF type.");
      return;
    }

    // Check if there are any validation errors
    if (!isFirstNameValid || !isLastNameValid || !isPhysicianValid || errors.dateOfBirth) {
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      // Generate PDF with pharmacy details
      const pharmacyDetails = getPharmacyDetails();
      const pdfBlob = await generatePDF(formData, pharmacyDetails);

      // Send email
      await sendEmail(formData, pdfBlob);

      // Clear form (preserve pharmacy) and navigate to success
      clearFormData(true);
      navigate("/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-full transition-colors text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/otc.png"
              alt="OTC Form Icon"
              className="w-[150px] h-auto"
            />
          </div>
          <h1 className="mb-4 text-slate-800 uppercase font-bold" style={{ fontSize: 'calc(1em + 6.66667px)' }}>
            Welcome to Our OTC Request Form
          </h1>
          <div className="text-slate-600 max-w-2xl mx-auto space-y-2">
            <p>
              This form helps eligible patients receive Medi-Cal coverage for
              routine over-the-counter (OTC) items with a provider's
              prescription.
            </p>
            <p>
              Click each major category below to view the available medications.
            </p>
            <p>
              Select the items your patient currently purchases out of pocket.
            </p>
            <p>
              After submission, a PDF copy will be emailed to your pharmacy
              inbox.
            </p>
            <p>
              Please print the form and either hand it to the patient or fax it
              to their doctor for prescription authorization.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="mb-6 text-slate-800 font-bold uppercase" style={{ fontSize: 'calc(1em + 4px)' }}>
            Pharmacy filling out this form
          </h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="pharmacy"
                className="mt-1 w-4 h-4 accent-red-500"
                value={getPharmacyName() || ''}
                checked
                readOnly
              />
              <span className="text-slate-700">{getPharmacyName()}</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="mb-6 text-slate-800 font-bold uppercase" style={{ fontSize: 'calc(1em + 4px)' }}>
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm leading-none font-medium text-slate-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.patientFirstName}
                onChange={(e) => handleNameChange('patientFirstName', e.target.value)}
                onBlur={(e) => validateName('patientFirstName', e.target.value)}
                placeholder="Enter first name"
                required
                className="mt-1 flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none placeholder:text-muted-foreground md:text-sm"
              />
              {errors.patientFirstName && (
                <p className="text-red-500 text-xs mt-1">{errors.patientFirstName}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm leading-none font-medium text-slate-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.patientLastName}
                onChange={(e) => handleNameChange('patientLastName', e.target.value)}
                onBlur={(e) => validateName('patientLastName', e.target.value)}
                placeholder="Enter last name"
                required
                className="mt-1 flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none placeholder:text-muted-foreground md:text-sm"
              />
              {errors.patientLastName && (
                <p className="text-red-500 text-xs mt-1">{errors.patientLastName}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm leading-none font-medium text-slate-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleDateChange(e.target.value)}
                max={getTodayDate()}
                required
                className="mt-1 flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none placeholder:text-muted-foreground md:text-sm"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm leading-none font-medium text-slate-700">
                Primary Care Physician <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.primaryCarePhysician}
                onChange={(e) => handleNameChange('primaryCarePhysician', e.target.value)}
                onBlur={(e) => validateName('primaryCarePhysician', e.target.value)}
                placeholder="Enter physician name"
                required
                className="mt-1 flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none placeholder:text-muted-foreground md:text-sm"
              />
              {errors.primaryCarePhysician && (
                <p className="text-red-500 text-xs mt-1">{errors.primaryCarePhysician}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="mb-6 text-slate-800 font-bold uppercase" style={{ fontSize: 'calc(1em + 4px)' }}>
            Current OTC Medications
          </h2>
          <div className="w-full space-y-3">
            {medicationCategories.map((category) => (
              <CategoryAccordion
                key={category.id}
                category={category}
                data={
                  formData.categories[category.id] || {
                    selectedMedications: [],
                    otherMedications: [],
                  }
                }
                onUpdate={(data) => handleCategoryUpdate(category.id, data)}
              />
            ))}
          </div>
          <p className="text-center text-slate-500 mt-6">
            Progress is automatically saved to your browser
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="mb-6 text-slate-800 font-bold uppercase" style={{ fontSize: 'calc(1em + 4px)' }}>
            Who is this request from?
          </h2>
          <div className="space-y-4">
            <p className="font-bold text-slate-800">Choose one:</p>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pdfType"
                  className="mt-1 w-4 h-4 accent-red-500"
                  value="A"
                  checked={formData.pdfType === "A"}
                  onChange={(e) =>
                    updateFormData({ pdfType: e.target.value as "A" | "B" })
                  }
                />
                <span className="text-slate-700">
                  PDF A – Pharmacy requests on behalf of the patient
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pdfType"
                  className="mt-1 w-4 h-4 accent-red-500"
                  value="B"
                  checked={formData.pdfType === "B"}
                  onChange={(e) =>
                    updateFormData({ pdfType: e.target.value as "A" | "B" })
                  }
                />
                <span className="text-slate-700">
                  PDF B – Patient requests provider authorization
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-full h-9 has-[>svg]:px-3 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            SEND
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 h-5 w-5"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
