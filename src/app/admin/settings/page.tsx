"use client";

import { useEffect, useState } from "react";
import { getStoreSettings, updateStoreSettings } from "@/actions/settings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import toast from "react-hot-toast";

type SettingsState = {
  storeName: string;
  storeDescription: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  currency: string;
  shippingCharge: string;
  bannerImage: string;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  facebook: string;
  instagram: string;
  twitter: string;
};

const initialSettings: SettingsState = {
  storeName: "Cosmatics Store",
  storeDescription: "Premium cosmetics and beauty products",
  phone: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  currency: "BDT",
  shippingCharge: "120",
  bannerImage: "",
  heroTitle: "",
  heroSubtitle: "",
  announcement: "",
  facebook: "",
  instagram: "",
  twitter: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const result = await getStoreSettings();
        if (result.success && result.settings) {
          const data = result.settings;
          setSettings({
            storeName: data.storeName || "",
            storeDescription: data.storeDescription || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            city: data.city || "",
            postalCode: data.postalCode || "",
            currency: data.currency || "BDT",
            shippingCharge: String(data.shippingCharge ?? 0),
            bannerImage: data.bannerImage || "",
            heroTitle: data.heroTitle || "",
            heroSubtitle: data.heroSubtitle || "",
            announcement: data.announcement || "",
            facebook: data.socialLinks?.facebook || "",
            instagram: data.socialLinks?.instagram || "",
            twitter: data.socialLinks?.twitter || "",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      alert(formData);
      const result = await updateStoreSettings(formData);

      if (result.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading settings...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <form onSubmit={handleSave} className="max-w-4xl space-y-6">
        <Card className="">
          <CardHeader className="">
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 ">
            <Input
              label="Store Name"
              name="storeName"
              value={settings.storeName}
              onChange={(e) =>
                setSettings({ ...settings, storeName: e.target.value })
              }
            />
            <Input
              label="Announcement Bar"
              name="announcement"
              value={settings.announcement}
              onChange={(e) =>
                setSettings({ ...settings, announcement: e.target.value })
              }
            />
            <div className="md:col-span-2">
              <TextArea
                label="Store Description"
                name="storeDescription"
                value={settings.storeDescription}
                onChange={(e) =>
                  setSettings({ ...settings, storeDescription: e.target.value })
                }
              />
            </div>
            <Input
              label="Phone"
              name="phone"
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />
            <div className="md:col-span-2">
              <TextArea
                label="Address"
                name="address"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
              />
            </div>
            <Input
              label="City"
              name="city"
              value={settings.city}
              onChange={(e) =>
                setSettings({ ...settings, city: e.target.value })
              }
            />
            <Input
              label="Postal Code"
              name="postalCode"
              value={settings.postalCode}
              onChange={(e) =>
                setSettings({ ...settings, postalCode: e.target.value })
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="">
            <CardTitle>Homepage Content</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 ">
            <Input
              label="Hero Title"
              name="heroTitle"
              value={settings.heroTitle}
              onChange={(e) =>
                setSettings({ ...settings, heroTitle: e.target.value })
              }
            />
            <TextArea
              label="Hero Subtitle"
              name="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={(e) =>
                setSettings({ ...settings, heroSubtitle: e.target.value })
              }
            />
            <Input
              label="Banner Image URL"
              name="bannerImage"
              value={settings.bannerImage}
              onChange={(e) =>
                setSettings({ ...settings, bannerImage: e.target.value })
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="">
            <CardTitle>Store Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 ">
            <Select
              label="Currency"
              name="currency"
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
              options={[
                { value: "BDT", label: "Bangladeshi Taka (BDT)" },
                { value: "PKR", label: "Pakistani Rupee (PKR)" },
                { value: "USD", label: "US Dollar (USD)" },
              ]}
            />
            <Input
              label="Shipping Charge"
              name="shippingCharge"
              type="number"
              value={settings.shippingCharge}
              onChange={(e) =>
                setSettings({ ...settings, shippingCharge: e.target.value })
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="">
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3 ">
            <Input
              label="Facebook"
              name="facebook"
              value={settings.facebook}
              onChange={(e) =>
                setSettings({ ...settings, facebook: e.target.value })
              }
            />
            <Input
              label="Instagram"
              name="instagram"
              value={settings.instagram}
              onChange={(e) =>
                setSettings({ ...settings, instagram: e.target.value })
              }
            />
            <Input
              label="Twitter / X"
              name="twitter"
              value={settings.twitter}
              onChange={(e) =>
                setSettings({ ...settings, twitter: e.target.value })
              }
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" isLoading={isSaving}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
