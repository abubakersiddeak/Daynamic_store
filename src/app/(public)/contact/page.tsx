"use client";

import { useEffect, useState } from "react";
import { getStoreSettings } from "@/actions/settings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";

interface StoreContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<StoreContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContactData() {
      try {
        const result = await getStoreSettings(
          "phone email address city postalCode",
        );
        if (result.success && result.settings) {
          setContactInfo(result.settings);
        }
      } catch (error) {
        console.error("Failed loading contact settings:", error);
      } finally {
        setLoading(false);
      }
    }
    void loadContactData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-12 text-center">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Phone Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600 font-medium">
                {loading ? "Loading..." : contactInfo?.phone || "Not Available"}
              </p>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600 break-all">
                {loading ? "Loading..." : contactInfo?.email || "Not Available"}
              </p>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-600 capitalize">
                {loading ? (
                  "Loading..."
                ) : contactInfo?.address ? (
                  <>
                    {contactInfo.address}
                    {contactInfo.city && `, ${contactInfo.city}`}
                    {contactInfo.postalCode && ` (${contactInfo.postalCode})`}
                  </>
                ) : (
                  "Not Available"
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Your Name" name="name" required />
              <Input label="Email Address" type="email" name="email" required />
              <Input label="Subject" name="subject" required />
              <TextArea
                label="Message"
                name="message"
                placeholder="Tell us how we can help..."
                required
              />
              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
