export interface PharmacyDetails {
  name: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  logo: string;
}

export const pharmacyDetails: Record<string, PharmacyDetails> = {
  "perrishills.otcform@gmail.com": {
    name: "Perris Hills Pharmacy",
    address: "524 W 4th St, Ste A, Perris, CA 92570",
    phone: "(951) 407-0707",
    fax: "(951) 657-5481",
    email: "Email@PerrisHillsPharmacy.com",
    website: "www.PerrisHillsPharmacy.com",
    logo: "/php.png",
  },
  "pridepharmacy.otcform@yahoo.com": {
    name: "Pride Pharmacy",
    address: "1270 University Ave, San Diego, CA 92103",
    phone: "(619) 501-5888",
    fax: "(619) 501-6888",
    email: "email@pridepharmacysd.com",
    website: "www.pridepharmacysd.com",
    logo: "/pp.png",
  },
};

export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  pharmacyEmails: {
    "perrishills.otcform@gmail.com": "Perris Hills Pharmacy",
    "pridepharmacy.otcform@yahoo.com": "Pride Pharmacy",
  },
} as const;

export function assertConfig() {
  if (!config.supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Create a .env.local (or .env) based on .env.example."
    );
  }
  if (!config.supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Create a .env.local (or .env) based on .env.example."
    );
  }
}
