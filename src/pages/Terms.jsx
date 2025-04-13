
import React from "react";
import { motion } from "framer-motion";
import { MainNav } from "@/components/layout/MainNav";
import { ScrollText, Scale, AlertCircle, HelpCircle, FileCheck, UserCheck, MapPin, CreditCard } from "lucide-react";

export function Terms() {
  const sections = [
    {
      icon: ScrollText,
      title: "Agreement to Terms",
      content: "By accessing or using LocScout, you agree to be bound by these Terms and Conditions. If you disagree, please do not use the service."
    },
    {
      icon: Scale,
      title: "Use License",
      content: "We grant you a non-exclusive, non-transferable license to use our service for commercial and non-commercial purposes."
    },
    {
      icon: UserCheck,
      title: "Account Access",
      content: "Create an account to access premium features. You're responsible for maintaining account security and confidentiality."
    },
    {
      icon: MapPin,
      title: "Location Services",
      content: "We use location data to provide you with relevant search results and enhance your experience."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <div className="grid gap-8 mb-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground">{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8">
            <section>
              <p className="text-muted-foreground text-lg leading-relaxed">
                By accessing or using the LocScout app and services (collectively, the "Service"), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Use of the Service</h2>
              <p className="text-muted-foreground">
                LocScout grants you a non-exclusive, non-transferable, revocable license to access and use the Service for commercial and non-commercial use, subject to these Terms. You agree to use the Service in accordance with all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
              <p className="text-muted-foreground">
                To access certain features of the Service, you may be required to create an account. You agree to provide accurate and complete information during registration and to update it as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
              <p className="text-muted-foreground">
                You retain ownership of any content you upload or submit to LocScout, including photos and location information. By submitting content, you grant LocScout a worldwide, royalty-free, non-exclusive license to use, display, and distribute your content for the purpose of providing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Location Data</h2>
              <p className="text-muted-foreground">
                By using the Service, you consent to the collection and use of your GPS location data. This data is used to provide location-based search results and enhance the functionality of the app. You can manage your location settings in your device's settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Payment and Subscription</h2>
              <p className="text-muted-foreground">
                LocScout offers both free and paid subscription plans. Payment for premium features is processed through third-party payment providers, and you agree to their terms and conditions. Subscription fees are billed on a recurring basis (monthly or annually), and you can cancel at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Prohibited Conduct</h2>
              <p className="text-muted-foreground">You agree not to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>Violate any laws or regulations while using the Service.</li>
                <li>Attempt to interfere with or disrupt the Service's operation.</li>
                <li>Upload or distribute harmful content, such as viruses or malware.</li>
                <li>Use the Service for any unlawful, offensive, or inappropriate purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p className="text-muted-foreground">
                LocScout reserves the right to suspend or terminate your account at any time if you violate these Terms. Upon termination, your access to the Service will be revoked, and you may lose access to any paid features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Limitation of Liability</h2>
              <p className="text-muted-foreground">
                The Service is provided "as is" and without warranty of any kind, either express or implied. LocScout does not guarantee the accuracy, reliability, or availability of the app or its content. To the fullest extent permitted by law, LocScout is not liable for any damages resulting from the use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold LocScout harmless from any claims, damages, or losses arising out of your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms are governed by the laws of Georgia, USA, without regard to its conflict of laws principles. Any disputes will be resolved in the appropriate courts in the state of Georgia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to These Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by updating the "Last Updated" date at the top of this page. Continued use of the Service after such changes will constitute your acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions or concerns about these Terms, please contact us at locscoutai@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
