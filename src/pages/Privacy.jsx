
import React from "react";
import { motion } from "framer-motion";
import { MainNav } from "@/components/layout/MainNav";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export function Privacy() {
  const sections = [
    {
      icon: Shield,
      title: "Data Protection",
      content: "We take the protection of your personal data seriously. This policy explains how we collect, use, and safeguard your information when you use our location scouting service."
    },
    {
      icon: Lock,
      title: "Information Security",
      content: "Your data is encrypted and stored securely. We implement reasonable security measures to protect against unauthorized access, alteration, disclosure, or destruction."
    },
    {
      icon: Eye,
      title: "Data Collection",
      content: "We collect information that you provide directly to us, including your name, email address, and location data. We also collect data about how you use our service."
    },
    {
      icon: FileText,
      title: "Data Usage",
      content: "We use your information to provide and improve our services, communicate with you, and ensure a personalized experience. We do not sell your personal information to third parties."
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
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
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
                LocScout ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal data when you use our mobile application, website, and services (collectively, "LocScout" or "Services").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li><span className="font-medium">Personal Information:</span> When you sign up for an account, we collect personal information such as your name, email address, and payment information (if you choose to subscribe to our premium service).</li>
                <li><span className="font-medium">Location Data:</span> LocScout collects your GPS location when you use the app to provide you with relevant location-based search results. This information is used to suggest nearby locations and enhance your user experience.</li>
                <li><span className="font-medium">Usage Data:</span> We collect data on how you use the app, including search queries, interaction with content, and feature usage. This helps us improve the app and tailor the experience to your needs.</li>
                <li><span className="font-medium">Device Information:</span> We may collect information about your device, including your operating system, device model, IP address, and browser type to improve app functionality.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">We use the collected data for the following purposes:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>To personalize your experience and provide relevant location-based search results.</li>
                <li>To improve and enhance the functionality of the app.</li>
                <li>To process payments and manage your subscription to premium services.</li>
                <li>To communicate with you, including sending important service updates, promotional offers, and other information related to LocScout.</li>
                <li>To comply with legal obligations and protect our rights and the rights of our users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Sharing Your Information</h2>
              <p className="text-muted-foreground">We do not sell, rent, or lease your personal data to third parties. However, we may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li><span className="font-medium">Service Providers:</span> We may share your data with trusted third-party vendors and service providers who assist us in operating the app, processing payments, and providing services to you.</li>
                <li><span className="font-medium">Legal Compliance:</span> We may disclose your information if required by law, regulation, or legal process (e.g., subpoenas or court orders).</li>
                <li><span className="font-medium">Business Transfers:</span> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
              <p className="text-muted-foreground">We will retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy Policy. You can request the deletion of your account and personal data at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground">Depending on your location, you may have certain rights regarding your personal data, including:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                <li>The right to access, correct, or delete your personal data.</li>
                <li>The right to object to the processing of your data or withdraw consent.</li>
                <li>The right to request data portability.</li>
              </ul>
              <p className="text-muted-foreground mt-4">To exercise these rights, please contact us at locscoutai@gmail.com.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
              <p className="text-muted-foreground">We implement reasonable security measures to protect your personal data from unauthorized access, use, or disclosure. However, no data transmission or storage method is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
              <p className="text-muted-foreground">LocScout is not intended for children under the age of 13, and we do not knowingly collect personal data from children. If we become aware that we have collected personal data from a child under 13, we will take steps to delete that data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">We may update this Privacy Policy from time to time. If we make material changes, we will notify you by updating the "Last Updated" date at the top of this page or by providing notice through the app or other communication channels.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground">If you have any questions or concerns about this Privacy Policy, please contact us at locscoutai@gmail.com</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
