"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-12 text-center">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+92 (300) 123-4567</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">hello@cosmatics.com</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-black" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-gray-600">Karachi, Pakistan</p>
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
